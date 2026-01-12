import { MarketIntelligenceData } from '@/types/intelligence';
import { comprehensiveSampleData } from './comprehensive-intelligence-sample';
import { getDateRanges } from '@/lib/dateUtils';

/**
 * Market Intelligence Data
 * Using comprehensive sample data covering all 5 segments over 365-day rolling window
 * NOTE: This will be dynamically updated by the scraping service
 */

const { today } = getDateRanges();

export const marketIntelligenceData: MarketIntelligenceData = {
  lastScraped: today.toISOString(),
  scrapingConfig: {
    rollingWindowDays: 365,
    archiveEnabled: true,
    autoRefreshHours: 24,
    manualRefreshCooldownMinutes: 15,
    maxItemsPerSegment: 100,
    deleteArchivedAfterDays: 1095 // 3 years total
  },
  currentIntelligence: comprehensiveSampleData,
  archivedIntelligence: []
};
