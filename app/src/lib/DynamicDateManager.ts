/**
 * DynamicDateManager.ts
 *
 * Manages dynamic date ranges for intelligence scraping.
 * ALWAYS uses current date (TODAY) and looks back exactly 365 days.
 * No hardcoded dates - all dates are computed dynamically.
 */

export class DynamicDateManager {
  /**
   * Get the current date (TODAY) - this is always dynamic
   */
  static getToday(): Date {
    return new Date();
  }

  /**
   * Get the date exactly 1 year ago from today
   */
  static getOneYearAgo(): Date {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return oneYearAgo;
  }

  /**
   * Get the date range for scraping (always last 365 days)
   */
  static getScrapingDateRange(): {
    start: Date;
    end: Date;
    description: string;
  } {
    return {
      start: this.getOneYearAgo(),
      end: this.getToday(),
      description: `${this.formatDate(this.getOneYearAgo())} to ${this.formatDate(this.getToday())} (365 days)`,
    };
  }

  /**
   * Format date for display (YYYY-MM-DD)
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Format date for API queries (ISO 8601)
   */
  static formatDateForAPI(date: Date): string {
    return date.toISOString();
  }

  /**
   * Get date for display in UI
   */
  static getDisplayDateRange(): string {
    const range = this.getScrapingDateRange();
    return `${range.start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} - ${range.end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`;
  }

  /**
   * Check if an intelligence item is older than 1 year
   * If yes, it should be archived/removed
   */
  static isExpired(itemDate: string | Date): boolean {
    const oneYearAgo = this.getOneYearAgo();
    const itemDateObj = typeof itemDate === 'string' ? new Date(itemDate) : itemDate;
    return itemDateObj < oneYearAgo;
  }

  /**
   * Get rolling date windows for chunked scraping
   * Breaks 1 year into manageable chunks (e.g., monthly)
   */
  static getRollingDateChunks(chunkSizeInDays: number = 30): Array<{
    start: Date;
    end: Date;
    description: string;
  }> {
    const chunks = [];
    const end = this.getToday();
    const start = this.getOneYearAgo();

    let currentStart = new Date(start);

    while (currentStart < end) {
      const currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + chunkSizeInDays);

      // Don't go past today
      if (currentEnd > end) {
        currentEnd.setTime(end.getTime());
      }

      chunks.push({
        start: new Date(currentStart),
        end: new Date(currentEnd),
        description: `${this.formatDate(currentStart)} to ${this.formatDate(currentEnd)}`,
      });

      currentStart.setDate(currentStart.getDate() + chunkSizeInDays);
    }

    return chunks;
  }

  /**
   * Get lookback date for incremental updates
   * @param hours - Number of hours to look back
   */
  static getLookbackDate(hours: number): Date {
    const now = new Date();
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  }

  /**
   * Check if date is within the current 365-day window
   */
  static isWithinWindow(date: string | Date): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const oneYearAgo = this.getOneYearAgo();
    const today = this.getToday();
    return dateObj >= oneYearAgo && dateObj <= today;
  }

  /**
   * Get statistics about the current date window
   */
  static getDateWindowStats(): {
    startDate: string;
    endDate: string;
    totalDays: number;
    description: string;
  } {
    const range = this.getScrapingDateRange();
    const diffTime = Math.abs(range.end.getTime() - range.start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      startDate: this.formatDate(range.start),
      endDate: this.formatDate(range.end),
      totalDays: diffDays,
      description: `Rolling ${diffDays}-day window ending ${this.formatDate(range.end)}`,
    };
  }

  /**
   * Format relative time (e.g., "2 days ago", "3 hours ago")
   */
  static formatRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }
}

export default DynamicDateManager;
