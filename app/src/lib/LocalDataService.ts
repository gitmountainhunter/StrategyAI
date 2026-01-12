/**
 * LocalDataService.ts
 *
 * Client-side service for managing market intelligence data.
 * Handles fetching, filtering, and statistics for intelligence items.
 */

import DynamicDateManager from './DynamicDateManager';

export interface IntelligenceItem {
  id: string;
  timestamp?: string;
  original_publication_date?: string;
  title: string;
  summary: string;
  category: string;
  market_segments: string[];
  tags: string[];
  relevance_score?: number;
  competitor?: string;
  threat_level?: 'HIGH' | 'MEDIUM' | 'LOW';
  source?: any;
  [key: string]: any;
}

export class LocalDataService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/intelligence';
  }

  /**
   * Get all intelligence items
   */
  async getAllIntelligence(): Promise<IntelligenceItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=all`);
      if (!response.ok) throw new Error('Failed to fetch intelligence');

      const data = await response.json();
      return data.intelligence?.intelligence_items || [];
    } catch (error) {
      console.error('Error fetching intelligence:', error);
      return [];
    }
  }

  /**
   * Get intelligence filtered by parameters
   */
  async getFilteredIntelligence(filters: {
    category?: string;
    segment?: string;
    competitor?: string;
    limit?: number;
  }): Promise<IntelligenceItem[]> {
    try {
      const params = new URLSearchParams();
      params.append('type', 'all');

      if (filters.category) params.append('category', filters.category);
      if (filters.segment) params.append('segment', filters.segment);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch intelligence');

      const data = await response.json();
      let items = data.intelligence?.intelligence_items || [];

      // Client-side competitor filter
      if (filters.competitor) {
        items = items.filter((item: IntelligenceItem) => item.competitor === filters.competitor);
      }

      return items;
    } catch (error) {
      console.error('Error fetching filtered intelligence:', error);
      return [];
    }
  }

  /**
   * Get intelligence statistics
   */
  async getIntelligenceStats(): Promise<{
    total: number;
    strategyDocs: number;
    webScraped: number;
    competitors: number;
    withinWindow: number;
    expired: number;
  }> {
    try {
      const items = await this.getAllIntelligence();

      const stats = {
        total: items.length,
        strategyDocs: items.filter((item) => item.is_strategic_document).length,
        webScraped: items.filter((item) => item.web_scraped).length,
        competitors: new Set(items.map((item) => item.competitor).filter(Boolean)).size,
        withinWindow: items.filter((item) => {
          const date = item.original_publication_date || item.timestamp;
          return date && DynamicDateManager.isWithinWindow(date);
        }).length,
        expired: items.filter((item) => {
          const date = item.original_publication_date || item.timestamp;
          return date && DynamicDateManager.isExpired(date);
        }).length,
      };

      return stats;
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        total: 0,
        strategyDocs: 0,
        webScraped: 0,
        competitors: 0,
        withinWindow: 0,
        expired: 0,
      };
    }
  }

  /**
   * Get competitor-specific intelligence
   */
  async getCompetitorIntelligence(competitorName?: string): Promise<IntelligenceItem[]> {
    try {
      const items = await this.getAllIntelligence();

      const competitorItems = items.filter((item) => item.competitor);

      if (competitorName) {
        return competitorItems.filter((item) => item.competitor === competitorName);
      }

      return competitorItems;
    } catch (error) {
      console.error('Error fetching competitor intelligence:', error);
      return [];
    }
  }

  /**
   * Get unique competitors from intelligence data
   */
  async getUniqueCompetitors(): Promise<string[]> {
    try {
      const items = await this.getAllIntelligence();
      const competitors = new Set(
        items.map((item) => item.competitor).filter((c): c is string => typeof c === 'string')
      );
      return Array.from(competitors).sort();
    } catch (error) {
      console.error('Error fetching competitors:', error);
      return [];
    }
  }

  /**
   * Get intelligence by threat level
   */
  async getIntelligenceByThreatLevel(level: 'HIGH' | 'MEDIUM' | 'LOW'): Promise<IntelligenceItem[]> {
    try {
      const items = await this.getAllIntelligence();
      return items.filter((item) => item.threat_level === level);
    } catch (error) {
      console.error('Error fetching by threat level:', error);
      return [];
    }
  }

  /**
   * Get intelligence within current date window
   */
  async getIntelligenceWithinWindow(): Promise<IntelligenceItem[]> {
    try {
      const items = await this.getAllIntelligence();
      return items.filter((item) => {
        const date = item.original_publication_date || item.timestamp;
        return date && DynamicDateManager.isWithinWindow(date);
      });
    } catch (error) {
      console.error('Error fetching within window:', error);
      return [];
    }
  }

  /**
   * Get expired intelligence (older than 365 days)
   */
  async getExpiredIntelligence(): Promise<IntelligenceItem[]> {
    try {
      const items = await this.getAllIntelligence();
      return items.filter((item) => {
        const date = item.original_publication_date || item.timestamp;
        return date && DynamicDateManager.isExpired(date);
      });
    } catch (error) {
      console.error('Error fetching expired items:', error);
      return [];
    }
  }

  /**
   * Save all intelligence (for cleanup operations)
   */
  async saveAllIntelligence(items: IntelligenceItem[]): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'intelligence',
          data: {
            intelligence_items: items,
          },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error saving intelligence:', error);
      return false;
    }
  }

  /**
   * Get date window information
   */
  getDateWindowInfo() {
    return DynamicDateManager.getDateWindowStats();
  }

  /**
   * Get display date range
   */
  getDisplayDateRange(): string {
    return DynamicDateManager.getDisplayDateRange();
  }
}

export default LocalDataService;
