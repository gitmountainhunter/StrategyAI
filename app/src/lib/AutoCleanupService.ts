/**
 * AutoCleanupService.ts
 *
 * Automatic cleanup service for expired intelligence items.
 * Removes intelligence older than 365 days on a daily schedule.
 */

import DynamicDateManager from './DynamicDateManager';
import LocalDataService from './LocalDataService';

export interface CleanupResult {
  removed: number;
  remaining: number;
  timestamp: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export class AutoCleanupService {
  private dataService: LocalDataService;
  private cleanupIntervalId: NodeJS.Timeout | null = null;
  private lastCleanup: Date | null = null;

  constructor() {
    this.dataService = new LocalDataService();
  }

  /**
   * Perform cleanup of expired intelligence items
   */
  async cleanupExpiredIntelligence(): Promise<CleanupResult> {
    console.log('🧹 Running automatic intelligence cleanup...');

    try {
      // Get all intelligence
      const allIntelligence = await this.dataService.getAllIntelligence();
      console.log(`📊 Total items before cleanup: ${allIntelligence.length}`);

      // Filter out expired items
      const validIntelligence = allIntelligence.filter((item) => {
        const date = item.original_publication_date || item.timestamp;
        if (!date) return true; // Keep items without dates
        return !DynamicDateManager.isExpired(date);
      });

      const expiredCount = allIntelligence.length - validIntelligence.length;

      // Save cleaned data if items were removed
      if (expiredCount > 0) {
        console.log(`🗑️ Removing ${expiredCount} expired intelligence items (older than 1 year)`);
        const saved = await this.dataService.saveAllIntelligence(validIntelligence);

        if (!saved) {
          console.error('❌ Failed to save cleaned intelligence data');
        } else {
          console.log(`✅ Cleanup complete: ${expiredCount} removed, ${validIntelligence.length} remaining`);
          this.lastCleanup = new Date();
        }
      } else {
        console.log('✨ No expired items to clean up');
      }

      const dateRange = DynamicDateManager.getScrapingDateRange();

      return {
        removed: expiredCount,
        remaining: validIntelligence.length,
        timestamp: new Date().toISOString(),
        dateRange: {
          start: DynamicDateManager.formatDate(dateRange.start),
          end: DynamicDateManager.formatDate(dateRange.end),
        },
      };
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      throw error;
    }
  }

  /**
   * Start automatic daily cleanup at 2 AM
   */
  startAutoCleanup(): void {
    if (this.cleanupIntervalId) {
      console.log('⚠️ Auto-cleanup already running');
      return;
    }

    console.log('🚀 Starting automatic intelligence cleanup service');

    // Calculate time until next 2 AM
    const now = new Date();
    const next2AM = new Date(now);
    next2AM.setHours(2, 0, 0, 0);

    if (next2AM <= now) {
      next2AM.setDate(next2AM.getDate() + 1);
    }

    const timeUntilNext2AM = next2AM.getTime() - now.getTime();

    console.log(`⏰ Next cleanup scheduled for: ${next2AM.toLocaleString()}`);
    console.log(`⏳ Time until next cleanup: ${Math.round(timeUntilNext2AM / 1000 / 60)} minutes`);

    // Schedule first cleanup
    setTimeout(() => {
      this.cleanupExpiredIntelligence();

      // Then run every 24 hours
      this.cleanupIntervalId = setInterval(() => {
        this.cleanupExpiredIntelligence();
      }, 24 * 60 * 60 * 1000);
    }, timeUntilNext2AM);
  }

  /**
   * Stop automatic cleanup
   */
  stopAutoCleanup(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
      console.log('🛑 Auto-cleanup stopped');
    }
  }

  /**
   * Get cleanup status
   */
  getCleanupStatus(): {
    isRunning: boolean;
    lastCleanup: string | null;
    nextCleanup: string | null;
  } {
    const now = new Date();
    let nextCleanup: Date | null = null;

    if (this.cleanupIntervalId) {
      nextCleanup = new Date(now);
      nextCleanup.setHours(2, 0, 0, 0);

      if (nextCleanup <= now) {
        nextCleanup.setDate(nextCleanup.getDate() + 1);
      }
    }

    return {
      isRunning: this.cleanupIntervalId !== null,
      lastCleanup: this.lastCleanup ? this.lastCleanup.toISOString() : null,
      nextCleanup: nextCleanup ? nextCleanup.toISOString() : null,
    };
  }

  /**
   * Get preview of items that would be removed
   */
  async getExpiredItemsPreview(): Promise<{
    count: number;
    oldestDate: string | null;
    items: Array<{ id: string; title: string; date: string }>;
  }> {
    try {
      const expired = await this.dataService.getExpiredIntelligence();

      const preview = expired.slice(0, 10).map((item) => ({
        id: item.id,
        title: item.title,
        date: item.original_publication_date || item.timestamp || 'Unknown',
      }));

      // Find oldest date
      let oldestDate: string | null = null;
      expired.forEach((item) => {
        const date = item.original_publication_date || item.timestamp;
        if (date && (!oldestDate || date < oldestDate)) {
          oldestDate = date;
        }
      });

      return {
        count: expired.length,
        oldestDate,
        items: preview,
      };
    } catch (error) {
      console.error('Error getting expired items preview:', error);
      return {
        count: 0,
        oldestDate: null,
        items: [],
      };
    }
  }
}

export default AutoCleanupService;
