/**
 * Dynamic Date Utilities for Digital Integration Market Intelligence
 * CRITICAL: All dates are calculated relative to the current date
 * NO HARDCODED DATES ALLOWED
 */

export interface DateRanges {
  today: Date;
  yesterday: Date;
  last7Days: Date;
  last30Days: Date;
  last90Days: Date;
  last365Days: Date;
  archiveCutoff: Date;
  currentYear: number;
  currentMonth: number;
  currentQuarter: number;
  currentDateString: string;
  archiveCutoffString: string;
}

/**
 * Get all dynamic date ranges relative to current date
 * USE THIS EVERYWHERE - never hardcode dates
 */
export const getDateRanges = (): DateRanges => {
  const now = new Date();

  const last7 = new Date();
  last7.setDate(now.getDate() - 7);

  const last30 = new Date();
  last30.setDate(now.getDate() - 30);

  const last90 = new Date();
  last90.setDate(now.getDate() - 90);

  const last365 = new Date();
  last365.setFullYear(now.getFullYear() - 1);

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  return {
    today: now,
    yesterday,
    last7Days: last7,
    last30Days: last30,
    last90Days: last90,
    last365Days: last365,
    archiveCutoff: last365, // Same as 365 days ago
    currentYear: now.getFullYear(),
    currentMonth: now.getMonth() + 1,
    currentQuarter: Math.ceil((now.getMonth() + 1) / 3),
    currentDateString: now.toISOString().split('T')[0],
    archiveCutoffString: last365.toISOString().split('T')[0]
  };
};

/**
 * Get date range for current intelligence (rolling 365-day window)
 */
export const getCurrentIntelligenceDateRange = () => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return {
    currentDate: today.toISOString().split('T')[0],
    startDate: oneYearAgo.toISOString().split('T')[0],
    archiveCutoff: oneYearAgo.toISOString().split('T')[0]
  };
};

/**
 * Check if a date is within the current intelligence window (past 365 days)
 */
export const isWithinCurrentWindow = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const { archiveCutoff } = getDateRanges();
  return dateObj >= archiveCutoff;
};

/**
 * Check if a date should be archived (older than 365 days)
 */
export const shouldBeArchived = (date: Date | string): boolean => {
  return !isWithinCurrentWindow(date);
};

/**
 * Format date for display (relative or absolute)
 */
export const formatIntelligenceDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Get time since last update in human-readable format
 */
export const getTimeSinceUpdate = (lastUpdate: Date | string): string => {
  const dateObj = typeof lastUpdate === 'string' ? new Date(lastUpdate) : lastUpdate;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

/**
 * Check if refresh is needed (based on last scrape time)
 */
export const needsRefresh = (lastScraped: Date | string | null, intervalHours: number = 24): boolean => {
  if (!lastScraped) return true;

  const lastScrapedDate = typeof lastScraped === 'string' ? new Date(lastScraped) : lastScraped;
  const now = new Date();
  const diffMs = now.getTime() - lastScrapedDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours >= intervalHours;
};

/**
 * Get date range string for search queries
 */
export const getSearchDateRangeString = (): string => {
  const { archiveCutoffString } = getDateRanges();
  return `after:${archiveCutoffString}`;
};

/**
 * Partition intelligence items into current and archived
 */
export const partitionIntelligence = <T extends { publishedDate: string }>(
  items: T[]
): { current: T[]; archived: T[] } => {
  const { archiveCutoff } = getDateRanges();

  const current: T[] = [];
  const archived: T[] = [];

  items.forEach(item => {
    const itemDate = new Date(item.publishedDate);
    if (itemDate >= archiveCutoff) {
      current.push(item);
    } else {
      archived.push(item);
    }
  });

  return { current, archived };
};

/**
 * Check if item should be permanently deleted (in archive for 2+ years)
 */
export const shouldBeDeleted = (archivedDate: Date | string): boolean => {
  const dateObj = typeof archivedDate === 'string' ? new Date(archivedDate) : archivedDate;
  const now = new Date();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(now.getFullYear() - 2);

  return dateObj < twoYearsAgo;
};
