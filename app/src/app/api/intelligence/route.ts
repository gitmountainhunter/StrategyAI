import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const segment = searchParams.get('segment');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (type === 'intelligence' || type === 'all') {
      const intelligenceData = await fs.readFile(
        path.join(DATA_DIR, 'market-intelligence.json'),
        'utf-8'
      );
      let intelligence = JSON.parse(intelligenceData);

      // Filter by segment if provided
      if (segment) {
        intelligence.intelligence_items = intelligence.intelligence_items.filter(
          (item: any) => item.market_segments.includes(segment)
        );
      }

      // Filter by category if provided
      if (category) {
        intelligence.intelligence_items = intelligence.intelligence_items.filter(
          (item: any) => item.category === category
        );
      }

      // Limit results
      intelligence.intelligence_items = intelligence.intelligence_items.slice(0, limit);

      if (type === 'intelligence') {
        return NextResponse.json(intelligence);
      }

      // Also load trends if type is 'all'
      const trendsData = await fs.readFile(
        path.join(DATA_DIR, 'market-trends.json'),
        'utf-8'
      );
      const trends = JSON.parse(trendsData);

      return NextResponse.json({
        intelligence,
        trends,
      });
    }

    if (type === 'trends') {
      const trendsData = await fs.readFile(
        path.join(DATA_DIR, 'market-trends.json'),
        'utf-8'
      );
      const trends = JSON.parse(trendsData);
      return NextResponse.json(trends);
    }

    if (type === 'item') {
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json(
          { error: 'Item ID required' },
          { status: 400 }
        );
      }

      const intelligenceData = await fs.readFile(
        path.join(DATA_DIR, 'market-intelligence.json'),
        'utf-8'
      );
      const intelligence = JSON.parse(intelligenceData);
      const item = intelligence.intelligence_items.find(
        (i: any) => i.id === id
      );

      if (!item) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(item);
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Intelligence API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch intelligence data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'intelligence') {
      const filePath = path.join(DATA_DIR, 'market-intelligence.json');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true });
    }

    if (type === 'trends') {
      const filePath = path.join(DATA_DIR, 'market-trends.json');
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Intelligence API error:', error);
    return NextResponse.json(
      { error: 'Failed to save intelligence data' },
      { status: 500 }
    );
  }
}
