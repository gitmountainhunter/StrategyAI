import { NextRequest, NextResponse } from 'next/server';
import { marketIntelligenceData } from '@/data/market-intelligence';
import { getDateRanges, partitionIntelligence, needsRefresh } from '@/lib/dateUtils';
import { webScraperService } from '@/lib/WebScraperService';
import { checkRateLimit, getRateLimitPreset } from '@/lib/rateLimiter';
import type { IntelligenceItem } from '@/types/intelligence';

/**
 * GET /api/market-intelligence
 * Fetch current market intelligence with dynamic date filtering
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action') || 'fetch';
  const segment = searchParams.get('segment');
  const category = searchParams.get('category');
  const days = parseInt(searchParams.get('days') || '365'); // Default to full rolling window

  // Apply rate limiting for expensive operations (refresh/initialize)
  if (action === 'refresh' || action === 'initialize') {
    const rateLimitPreset = getRateLimitPreset('MARKET_INTELLIGENCE');
    const rateLimitResult = checkRateLimit(
      request,
      'market-intelligence-scrape',
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
  }

  try {
    switch (action) {
      case 'fetch':
        return handleFetch(segment, category, days);

      case 'refresh':
        return await handleRefresh();

      case 'initialize':
        return await handleInitialize();

      case 'stats':
        return handleStats();

      case 'date-info':
        return handleDateInfo();

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Market intelligence API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market intelligence' },
      { status: 500 }
    );
  }
}

/**
 * Fetch intelligence with filters
 */
function handleFetch(segment: string | null, category: string | null, days: number) {
  const { today } = getDateRanges();
  const cutoffDate = new Date();
  cutoffDate.setDate(today.getDate() - days);

  let filtered = [...marketIntelligenceData.currentIntelligence];

  // Filter by segment
  if (segment && segment !== 'all') {
    filtered = filtered.filter(item => item.segment === segment);
  }

  // Filter by category
  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category);
  }

  // Filter by date range
  filtered = filtered.filter(item => {
    const itemDate = new Date(item.publishedDate);
    return itemDate >= cutoffDate;
  });

  // Sort by date (most recent first)
  filtered.sort((a, b) =>
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

  return NextResponse.json({
    success: true,
    data: {
      intelligence: filtered,
      total: filtered.length,
      lastScraped: marketIntelligenceData.lastScraped,
      filters: {
        segment: segment || 'all',
        category: category || 'all',
        days
      }
    }
  });
}

/**
 * Initialize intelligence data on first load
 * Triggers scraping if no data exists
 */
async function handleInitialize() {
  const { currentIntelligence, lastScraped } = marketIntelligenceData;

  // Check if we need to initialize (no data or never scraped)
  if (currentIntelligence.length === 0 || !lastScraped) {
    console.log('🔄 No data found - initializing with real web scraping...');

    // FORCE SCRAPING - bypass all cooldowns and checks
    const scrapedItems = await webScraperService.scrapeAll();
    const now = new Date().toISOString();
    marketIntelligenceData.lastScraped = now;

    // Merge scraped items (there should be no existing items, but just in case)
    const allCurrent = [...marketIntelligenceData.currentIntelligence, ...scrapedItems];

    // Partition data into current and archived (365-day rolling window)
    const { current, archived } = partitionIntelligence(allCurrent);

    marketIntelligenceData.currentIntelligence = current;
    marketIntelligenceData.archivedIntelligence = archived.map(item =>
      ({ ...item, isArchived: true, archivedDate: now })
    );

    console.log(`✅ Initialization complete: ${current.length} items loaded from 6 sources`);

    return NextResponse.json({
      success: true,
      message: 'Intelligence initialized successfully with real web scraping',
      data: {
        lastScraped: now,
        currentCount: current.length,
        archivedCount: marketIntelligenceData.archivedIntelligence.length,
        newItemsScraped: scrapedItems.length,
        sourcesScraped: ['Baker Hughes', 'Halliburton', 'Oil & Gas Journal', 'Offshore Technology', 'World Oil', 'Pipeline & Gas Journal']
      }
    });
  }

  // Already has real data, just return current state
  return NextResponse.json({
    success: true,
    message: 'Intelligence already initialized',
    data: {
      currentCount: currentIntelligence.length,
      lastScraped: marketIntelligenceData.lastScraped,
      needsScraping: false
    }
  });
}

/**
 * Refresh intelligence data
 * Triggers REAL web scraping from competitor sources
 */
async function handleRefresh() {
  const { lastScraped } = marketIntelligenceData;
  const { autoRefreshHours, manualRefreshCooldownMinutes } = marketIntelligenceData.scrapingConfig;

  // Check if refresh is allowed (skip if never scraped or cooldown is 0)
  if (lastScraped && manualRefreshCooldownMinutes > 0) {
    const lastScrapedDate = new Date(lastScraped);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastScrapedDate.getTime()) / (1000 * 60);

    if (diffMinutes < manualRefreshCooldownMinutes) {
      const waitMinutes = Math.ceil(manualRefreshCooldownMinutes - diffMinutes);
      return NextResponse.json({
        success: false,
        message: `Please wait ${waitMinutes} minutes before refreshing again`,
        nextRefreshAllowed: new Date(lastScrapedDate.getTime() + manualRefreshCooldownMinutes * 60 * 1000).toISOString()
      }, { status: 429 });
    }
  }

  // TRIGGER REAL WEB SCRAPING
  console.log('🔍 Initiating real-time web scraping...');
  const scrapedItems = await webScraperService.scrapeAll();

  const now = new Date().toISOString();
  marketIntelligenceData.lastScraped = now;

  // Merge scraped items with existing data (avoid duplicates)
  const existingIds = new Set(marketIntelligenceData.currentIntelligence.map(item => item.id));
  const newItems = scrapedItems.filter(item => !existingIds.has(item.id));

  // Add new items to current intelligence
  const allCurrent = [...marketIntelligenceData.currentIntelligence, ...newItems];

  // Partition data into current and archived (365-day rolling window)
  const { current, archived } = partitionIntelligence(allCurrent);

  marketIntelligenceData.currentIntelligence = current;
  marketIntelligenceData.archivedIntelligence = [
    ...marketIntelligenceData.archivedIntelligence,
    ...archived.map(item => ({ ...item, isArchived: true, archivedDate: now }))
  ];

  console.log(`✅ Scraping complete: ${newItems.length} new items, ${current.length} total current, ${archived.length} newly archived`);

  return NextResponse.json({
    success: true,
    message: 'Intelligence refreshed successfully with real web scraping',
    data: {
      lastScraped: now,
      currentCount: current.length,
      archivedCount: marketIntelligenceData.archivedIntelligence.length,
      newlyArchived: archived.length,
      newItemsScraped: newItems.length,
      sourcesScraped: ['Baker Hughes', 'Halliburton', 'Oil & Gas Journal', 'Offshore Technology', 'World Oil', 'Pipeline & Gas Journal']
    }
  });
}

/**
 * Get intelligence statistics
 */
function handleStats() {
  const { currentIntelligence, archivedIntelligence } = marketIntelligenceData;
  const { today, last30Days, last90Days } = getDateRanges();

  // Count by segment
  const bySegment: Record<string, number> = {};
  currentIntelligence.forEach(item => {
    bySegment[item.segment] = (bySegment[item.segment] || 0) + 1;
  });

  // Count by category
  const byCategory: Record<string, number> = {};
  currentIntelligence.forEach(item => {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
  });

  // Count by time period
  const last30DaysCount = currentIntelligence.filter(
    item => new Date(item.publishedDate) >= last30Days
  ).length;

  const last90DaysCount = currentIntelligence.filter(
    item => new Date(item.publishedDate) >= last90Days
  ).length;

  return NextResponse.json({
    success: true,
    data: {
      total: currentIntelligence.length,
      archived: archivedIntelligence.length,
      last30Days: last30DaysCount,
      last90Days: last90DaysCount,
      bySegment,
      byCategory,
      lastScraped: marketIntelligenceData.lastScraped,
      needsAutoRefresh: needsRefresh(
        marketIntelligenceData.lastScraped,
        marketIntelligenceData.scrapingConfig.autoRefreshHours
      )
    }
  });
}

/**
 * Get current date information for UI display
 */
function handleDateInfo() {
  const dateRanges = getDateRanges();

  return NextResponse.json({
    success: true,
    data: {
      today: dateRanges.today.toISOString(),
      currentDateString: dateRanges.currentDateString,
      archiveCutoff: dateRanges.archiveCutoff.toISOString(),
      archiveCutoffString: dateRanges.archiveCutoffString,
      currentYear: dateRanges.currentYear,
      currentQuarter: dateRanges.currentQuarter,
      rollingWindowDays: marketIntelligenceData.scrapingConfig.rollingWindowDays
    }
  });
}
