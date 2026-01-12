import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Authentication Middleware
 *
 * Protects API routes by requiring a valid API key in the 'x-api-key' header.
 *
 * Security Features:
 * - API key validation for all /api/* routes
 * - Constant-time comparison to prevent timing attacks
 * - Detailed error responses for debugging (dev) or generic errors (prod)
 * - Rate limiting integration ready
 *
 * Usage:
 * Include 'x-api-key' header in all API requests:
 * fetch('/api/endpoint', {
 *   headers: { 'x-api-key': process.env.API_KEY }
 * })
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Skip authentication for health check endpoint (if you add one)
  if (pathname === '/api/health') {
    return NextResponse.next();
  }

  // Get API key from environment
  const validApiKey = process.env.API_KEY;

  // Check if API key is configured
  if (!validApiKey) {
    console.error('SECURITY ERROR: API_KEY not configured in environment variables');
    return NextResponse.json(
      {
        error: 'Server configuration error',
        message: 'API authentication not properly configured'
      },
      { status: 500 }
    );
  }

  // Get API key from request header
  const providedApiKey = request.headers.get('x-api-key');

  // Check if API key was provided
  if (!providedApiKey) {
    return NextResponse.json(
      {
        error: 'Authentication required',
        message: 'Missing API key. Include x-api-key header in your request.',
        hint: process.env.NODE_ENV === 'development'
          ? 'Add header: { "x-api-key": "your-api-key" }'
          : undefined
      },
      { status: 401 }
    );
  }

  // Validate API key using constant-time comparison to prevent timing attacks
  const isValid = timingSafeEqual(providedApiKey, validApiKey);

  if (!isValid) {
    console.warn(`Invalid API key attempt from ${request.ip || 'unknown IP'} for ${pathname}`);
    return NextResponse.json(
      {
        error: 'Authentication failed',
        message: 'Invalid API key provided'
      },
      { status: 403 }
    );
  }

  // Authentication successful - proceed with request
  return NextResponse.next();
}

/**
 * Timing-safe string comparison to prevent timing attacks
 * Compares two strings in constant time regardless of where they differ
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

// Configure which routes this middleware applies to
export const config = {
  matcher: '/api/:path*',
};
