import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { checkRateLimit, getRateLimitPreset } from '@/lib/rateLimiter';

const DATA_DIR = path.join(process.cwd(), 'data');

// Whitelist of allowed file types to prevent path traversal
const ALLOWED_TYPES = ['outcomes', 'revenue', 'priorities', 'history', 'all'] as const;
type AllowedType = typeof ALLOWED_TYPES[number];

// Map types to filenames
const TYPE_TO_FILENAME: Record<Exclude<AllowedType, 'all'>, string> = {
  'outcomes': 'strategic-outcomes.json',
  'revenue': 'revenue-targets.json',
  'priorities': 'priorities.json',
  'history': 'kpi-history.json',
};

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read JSON file with validation
async function readJsonFile(filename: string) {
  // Validate filename to prevent path traversal
  if (!filename.endsWith('.json') || filename.includes('..') || filename.includes('/')) {
    throw new Error('Invalid filename');
  }

  const filePath = path.join(DATA_DIR, filename);

  // Ensure resolved path is still within DATA_DIR
  const resolvedPath = path.resolve(filePath);
  const resolvedDataDir = path.resolve(DATA_DIR);
  if (!resolvedPath.startsWith(resolvedDataDir)) {
    throw new Error('Path traversal detected');
  }

  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Write JSON file with backup and validation
async function writeJsonFile(filename: string, data: any) {
  // Validate filename to prevent path traversal
  if (!filename.endsWith('.json') || filename.includes('..') || filename.includes('/')) {
    throw new Error('Invalid filename');
  }

  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  // Ensure resolved path is still within DATA_DIR
  const resolvedPath = path.resolve(filePath);
  const resolvedDataDir = path.resolve(DATA_DIR);
  if (!resolvedPath.startsWith(resolvedDataDir)) {
    throw new Error('Path traversal detected');
  }

  const backupPath = path.join(DATA_DIR, filename.replace('.json', '.backup.json'));

  // Create backup if file exists
  try {
    const existing = await fs.readFile(filePath, 'utf8');
    await fs.writeFile(backupPath, existing);
  } catch {
    // No existing file to backup
  }

  // Write new data
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Validate type parameter
function validateType(type: string | null): type is AllowedType {
  return type !== null && ALLOWED_TYPES.includes(type as AllowedType);
}

// GET - Read data from local files
export async function GET(request: NextRequest) {
  // Rate limiting for GET requests
  const rateLimitPreset = getRateLimitPreset('DATA_OPS');
  const rateLimitResult = checkRateLimit(
    request,
    'data-read',
    rateLimitPreset.max,
    rateLimitPreset.window
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: rateLimitResult.error,
        retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
      },
      { status: 429 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  // Validate type parameter
  if (!validateType(type)) {
    return NextResponse.json(
      {
        error: 'Invalid type parameter',
        message: `Type must be one of: ${ALLOWED_TYPES.join(', ')}`
      },
      { status: 400 }
    );
  }

  try {
    let data;

    if (type === 'all') {
      data = {
        outcomes: await readJsonFile(TYPE_TO_FILENAME.outcomes),
        revenue: await readJsonFile(TYPE_TO_FILENAME.revenue),
        priorities: await readJsonFile(TYPE_TO_FILENAME.priorities),
        history: await readJsonFile(TYPE_TO_FILENAME.history),
      };
    } else {
      const filename = TYPE_TO_FILENAME[type];
      data = await readJsonFile(filename);
    }

    if (!data) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// POST - Save data to local files
export async function POST(request: NextRequest) {
  // Rate limiting for POST requests (write operations)
  const rateLimitPreset = getRateLimitPreset('DATA_OPS');
  const rateLimitResult = checkRateLimit(
    request,
    'data-write',
    rateLimitPreset.max,
    rateLimitPreset.window
  );

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: rateLimitResult.error,
        retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { type, data } = body;

    // Validate type parameter
    if (!validateType(type) || type === 'all') {
      return NextResponse.json(
        {
          error: 'Invalid type parameter',
          message: `Type must be one of: ${Object.keys(TYPE_TO_FILENAME).join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validate data payload exists
    if (!data) {
      return NextResponse.json(
        { error: 'Missing data payload' },
        { status: 400 }
      );
    }

    const filename = TYPE_TO_FILENAME[type];
    await writeJsonFile(filename, data);

    return NextResponse.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
