/**
 * Rate Limiting Utility
 *
 * In-memory rate limiter to prevent abuse and DOS attacks.
 * Uses sliding window algorithm for accurate rate limiting.
 *
 * Features:
 * - Per-endpoint rate limits
 * - Per-IP tracking
 * - Sliding window algorithm
 * - Automatic cleanup of old entries
 * - Configurable limits via environment variables
 *
 * Usage in API routes:
 * ```typescript
 * import { checkRateLimit } from '@/lib/rateLimiter';
 *
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = checkRateLimit(request, 'endpoint-name', 10, 60000);
 *   if (!rateLimitResult.allowed) {
 *     return NextResponse.json(
 *       { error: rateLimitResult.error },
 *       { status: 429 }
 *     );
 *   }
 *   // ... rest of handler
 * }
 * ```
 */

import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
  requests: number[]; // Timestamps of requests for sliding window
}

interface RateLimitStore {
  [key: string]: RateLimitEntry;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  error?: string;
}

// In-memory store for rate limit data
// Note: This will reset when server restarts. For production at scale,
// consider using Redis or similar persistent store.
const rateLimitStore: RateLimitStore = {};

// Cleanup interval to remove old entries (runs every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

/**
 * Rate Limit Presets
 * Can be overridden via environment variables
 */
export const RATE_LIMITS = {
  MARKET_INTELLIGENCE: {
    max: Number(process.env.RATE_LIMIT_MARKET_INTELLIGENCE) || 1,
    window: 15 * 60 * 1000, // 15 minutes
  },
  DATA_OPS: {
    max: Number(process.env.RATE_LIMIT_DATA_OPS) || 10,
    window: 60 * 1000, // 1 minute
  },
  REPORTS: {
    max: Number(process.env.RATE_LIMIT_REPORTS) || 5,
    window: 60 * 1000, // 1 minute
  },
  CHAT: {
    max: Number(process.env.RATE_LIMIT_CHAT) || 20,
    window: 60 * 1000, // 1 minute
  },
  DEFAULT: {
    max: 10,
    window: 60 * 1000, // 1 minute
  },
};

/**
 * Check if request should be rate limited
 *
 * @param request - NextRequest object
 * @param endpoint - Unique identifier for the endpoint
 * @param maxRequests - Maximum requests allowed in window
 * @param windowMs - Time window in milliseconds
 * @returns RateLimitResult indicating if request is allowed
 */
export function checkRateLimit(
  request: NextRequest,
  endpoint: string,
  maxRequests: number = RATE_LIMITS.DEFAULT.max,
  windowMs: number = RATE_LIMITS.DEFAULT.window
): RateLimitResult {
  // Get client identifier (IP address or fallback)
  const clientId = getClientId(request);
  const key = `${endpoint}:${clientId}`;
  const now = Date.now();

  // Periodic cleanup of old entries
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    cleanupOldEntries();
    lastCleanup = now;
  }

  // Get or create entry
  let entry = rateLimitStore[key];
  if (!entry) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
      requests: [],
    };
    rateLimitStore[key] = entry;
  }

  // Sliding window: Remove requests older than window
  entry.requests = entry.requests.filter(timestamp => timestamp > now - windowMs);

  // Check if limit exceeded
  if (entry.requests.length >= maxRequests) {
    const oldestRequest = Math.min(...entry.requests);
    const resetAt = oldestRequest + windowMs;

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      error: `Rate limit exceeded. Try again in ${Math.ceil((resetAt - now) / 1000)} seconds.`,
    };
  }

  // Add current request timestamp
  entry.requests.push(now);
  entry.count = entry.requests.length;

  return {
    allowed: true,
    remaining: maxRequests - entry.requests.length,
    resetAt: now + windowMs,
  };
}

/**
 * Get preset rate limit for specific endpoint types
 */
export function getRateLimitPreset(type: keyof typeof RATE_LIMITS) {
  return RATE_LIMITS[type] || RATE_LIMITS.DEFAULT;
}

/**
 * Get client identifier from request
 * Uses IP address if available, falls back to user agent hash
 */
function getClientId(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = request.ip;

  // Use first IP from x-forwarded-for if available
  if (forwarded) {
    const ips = forwarded.split(',');
    return ips[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (ip) {
    return ip;
  }

  // Fallback: Use hash of user agent (less secure but better than nothing)
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `ua-${hashString(userAgent)}`;
}

/**
 * Simple string hash function for user agent fallback
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Clean up old entries from rate limit store
 * Removes entries that have expired
 */
function cleanupOldEntries(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, entry] of Object.entries(rateLimitStore)) {
    // Remove entries where all requests are older than their window
    const hasActiveRequests = entry.requests.some(timestamp => timestamp > now - 60000);
    if (!hasActiveRequests && entry.requests.length === 0) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => {
    delete rateLimitStore[key];
  });

  if (keysToDelete.length > 0) {
    console.log(`Rate limiter: Cleaned up ${keysToDelete.length} expired entries`);
  }
}

/**
 * Reset rate limit for a specific key (useful for testing)
 */
export function resetRateLimit(endpoint: string, clientId: string): void {
  const key = `${endpoint}:${clientId}`;
  delete rateLimitStore[key];
}

/**
 * Get current rate limit status for a client (useful for debugging)
 */
export function getRateLimitStatus(endpoint: string, clientId: string): RateLimitEntry | null {
  const key = `${endpoint}:${clientId}`;
  return rateLimitStore[key] || null;
}
