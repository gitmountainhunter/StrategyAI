/**
 * API Route: /api/competitor-scraping
 *
 * Handles competitor intelligence scraping, cleanup, and statistics.
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { CompetitorIntelligenceService } from '@/lib/CompetitorIntelligenceService';
import { DynamicDateManager } from '@/lib/DynamicDateManager';
import { getAllCompetitorNames, getTotalCompetitorCount } from '@/lib/CompetitorConfiguration';

const DATA_DIR = path.join(process.cwd(), 'data');
const INTELLIGENCE_FILE = path.join(DATA_DIR, 'market-intelligence.json');

/**
 * GET: Fetch competitor intelligence or statistics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'stats';
    const competitor = searchParams.get('competitor');

    const service = new CompetitorIntelligenceService();

    // Return competitor statistics
    if (action === 'stats') {
      const stats = service.getCompetitorStats();
      const dateWindow = DynamicDateManager.getDateWindowStats();

      return NextResponse.json({
        ...stats,
        date_window: dateWindow,
        date_range_display: DynamicDateManager.getDisplayDateRange(),
      });
    }

    // Return competitor queries
    if (action === 'queries') {
      const queries = service.generateCompetitorQueries(competitor || undefined);

      return NextResponse.json({
        total_queries: queries.length,
        queries: queries.slice(0, 50), // Limit for display
        competitor: competitor || 'all',
      });
    }

    // Return competitor list
    if (action === 'list') {
      const competitors = getAllCompetitorNames();
      return NextResponse.json({
        total: getTotalCompetitorCount(),
        competitors,
      });
    }

    // Return date window information
    if (action === 'date-window') {
      const dateWindow = DynamicDateManager.getDateWindowStats();
      const displayRange = DynamicDateManager.getDisplayDateRange();

      return NextResponse.json({
        ...dateWindow,
        display_range: displayRange,
        is_dynamic: true,
        updates: 'Daily (automatic)',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Competitor scraping API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

/**
 * POST: Perform scraping, cleanup, or generate mock data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, competitor, count } = body;

    const service = new CompetitorIntelligenceService();

    // Generate mock competitor intelligence
    if (action === 'generate-mock') {
      const competitorName = competitor || 'Baker Hughes';
      const itemCount = count || 5;

      console.log(`Generating ${itemCount} mock intelligence items for ${competitorName}`);

      const mockIntelligence = service.generateMockIntelligence(competitorName, itemCount);

      // Read existing intelligence
      const intelligenceData = await fs.readFile(INTELLIGENCE_FILE, 'utf-8');
      const intelligence = JSON.parse(intelligenceData);

      // Add mock intelligence
      intelligence.intelligence_items.push(...mockIntelligence);

      // Save updated intelligence
      await fs.writeFile(INTELLIGENCE_FILE, JSON.stringify(intelligence, null, 2));

      return NextResponse.json({
        success: true,
        generated: mockIntelligence.length,
        competitor: competitorName,
        items: mockIntelligence,
      });
    }

    // Generate mock intelligence for all competitors
    if (action === 'generate-all-mock') {
      const competitors = getAllCompetitorNames();
      const itemsPerCompetitor = count || 2;
      let totalGenerated = 0;

      console.log(`Generating mock intelligence for ${competitors.length} competitors`);

      const allMockIntelligence = [];

      for (const comp of competitors) {
        const mockItems = service.generateMockIntelligence(comp, itemsPerCompetitor);
        allMockIntelligence.push(...mockItems);
        totalGenerated += mockItems.length;
      }

      // Read existing intelligence
      const intelligenceData = await fs.readFile(INTELLIGENCE_FILE, 'utf-8');
      const intelligence = JSON.parse(intelligenceData);

      // Add mock intelligence
      intelligence.intelligence_items.push(...allMockIntelligence);

      // Save updated intelligence
      await fs.writeFile(INTELLIGENCE_FILE, JSON.stringify(intelligence, null, 2));

      return NextResponse.json({
        success: true,
        generated: totalGenerated,
        competitors: competitors.length,
        items_per_competitor: itemsPerCompetitor,
      });
    }

    // Cleanup expired intelligence
    if (action === 'cleanup') {
      console.log('Cleaning up expired intelligence...');

      // Read existing intelligence
      const intelligenceData = await fs.readFile(INTELLIGENCE_FILE, 'utf-8');
      const intelligence = JSON.parse(intelligenceData);

      const originalCount = intelligence.intelligence_items.length;

      // Filter out expired items
      intelligence.intelligence_items = intelligence.intelligence_items.filter((item: any) => {
        const date = item.original_publication_date || item.timestamp;
        if (!date) return true;
        return !DynamicDateManager.isExpired(date);
      });

      const removed = originalCount - intelligence.intelligence_items.length;

      // Save cleaned intelligence
      await fs.writeFile(INTELLIGENCE_FILE, JSON.stringify(intelligence, null, 2));

      const dateRange = DynamicDateManager.getScrapingDateRange();

      return NextResponse.json({
        success: true,
        removed,
        remaining: intelligence.intelligence_items.length,
        timestamp: new Date().toISOString(),
        date_range: {
          start: DynamicDateManager.formatDate(dateRange.start),
          end: DynamicDateManager.formatDate(dateRange.end),
        },
      });
    }

    // Preview expired items
    if (action === 'preview-cleanup') {
      const intelligenceData = await fs.readFile(INTELLIGENCE_FILE, 'utf-8');
      const intelligence = JSON.parse(intelligenceData);

      const expired = intelligence.intelligence_items.filter((item: any) => {
        const date = item.original_publication_date || item.timestamp;
        if (!date) return false;
        return DynamicDateManager.isExpired(date);
      });

      const preview = expired.slice(0, 10).map((item: any) => ({
        id: item.id,
        title: item.title,
        date: item.original_publication_date || item.timestamp,
        competitor: item.competitor || 'N/A',
      }));

      return NextResponse.json({
        count: expired.length,
        preview,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Competitor scraping POST error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
