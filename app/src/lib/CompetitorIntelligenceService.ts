/**
 * CompetitorIntelligenceService.ts
 *
 * Service for scraping and analyzing competitor intelligence using dynamic date ranges.
 * Generates comprehensive queries for each competitor across multiple categories.
 */

import DynamicDateManager from './DynamicDateManager';
import COMPREHENSIVE_COMPETITOR_LIST, {
  EXCLUDED_COMPANIES,
  type CompetitorDetails,
} from './CompetitorConfiguration';

export interface CompetitorQuery {
  competitor: string;
  query: string;
  category:
    | 'general'
    | 'product_launch'
    | 'business_development'
    | 'contracts'
    | 'financial'
    | 'technology'
    | 'specific_product'
    | 'focus_area';
  focus_area?: string;
}

export interface CompetitorIntelligence {
  id: string;
  intelligence_type: 'web-scraped';
  source_category: 'external';
  sub_category: 'competitive_intelligence';
  is_strategic_document: false;
  web_scraped: true;
  scrape_date: string;

  // Competitor-specific fields
  competitor: string;
  competitor_aliases: string[];
  competitor_category: string;
  competitor_focus_area: string | null;
  competitor_website: string;
  competitive_intelligence_type: string;
  threat_level: 'HIGH' | 'MEDIUM' | 'LOW';
  relevance_score: number;

  // Standard intelligence fields
  title: string;
  summary: string;
  source: {
    name: string;
    url: string;
    publication_date: string;
    author?: string;
    credibility_score: number;
  };
  original_publication_date: string;
  tags: string[];
  market_segments: string[];
  date_range_scraped: {
    start: string;
    end: string;
  };
}

export class CompetitorIntelligenceService {
  private competitors: Record<string, CompetitorDetails>;
  private excludedCompanies: string[];

  constructor() {
    this.competitors = COMPREHENSIVE_COMPETITOR_LIST;
    this.excludedCompanies = EXCLUDED_COMPANIES;

    console.log(`Monitoring ${Object.keys(this.competitors).length} competitors`);
    console.log(`Excluded (now part of SLB): ${this.excludedCompanies.join(', ')}`);
  }

  /**
   * Generate search queries for each competitor
   */
  generateCompetitorQueries(competitorName?: string): CompetitorQuery[] {
    const queries: CompetitorQuery[] = [];
    const competitors = competitorName
      ? { [competitorName]: this.competitors[competitorName] }
      : this.competitors;

    Object.entries(competitors).forEach(([name, details]) => {
      // Base company queries
      queries.push({
        competitor: name,
        query: `"${name}" AND ("oilfield chemicals" OR "oil and gas" OR "production chemicals")`,
        category: 'general',
      });

      // Product launch queries
      queries.push({
        competitor: name,
        query: `"${name}" AND ("product launch" OR "new product" OR "introduces" OR "announces")`,
        category: 'product_launch',
      });

      // Partnership/M&A queries
      queries.push({
        competitor: name,
        query: `"${name}" AND ("partnership" OR "acquisition" OR "merger" OR "joint venture" OR "agreement")`,
        category: 'business_development',
      });

      // Contract/customer queries
      queries.push({
        competitor: name,
        query: `"${name}" AND ("contract" OR "awarded" OR "wins" OR "secures" OR "agreement")`,
        category: 'contracts',
      });

      // Financial queries
      queries.push({
        competitor: name,
        query: `"${name}" AND ("earnings" OR "revenue" OR "financial results" OR "investment" OR "R&D spending")`,
        category: 'financial',
      });

      // Technology/innovation queries
      queries.push({
        competitor: name,
        query: `"${name}" AND ("technology" OR "innovation" OR "patent" OR "digital" OR "AI")`,
        category: 'technology',
      });

      // Specific keyword queries
      details.keywords.forEach((keyword) => {
        queries.push({
          competitor: name,
          query: `"${keyword}"`,
          category: 'specific_product',
        });
      });

      // Focus area queries
      details.focus_areas.forEach((area) => {
        queries.push({
          competitor: name,
          query: `"${name}" AND "${area}"`,
          category: 'focus_area',
          focus_area: area,
        });
      });
    });

    return queries;
  }

  /**
   * Get date-aware query string with dynamic date range
   */
  getDateAwareQuery(baseQuery: string): string {
    const dateRange = DynamicDateManager.getScrapingDateRange();
    const startDate = DynamicDateManager.formatDate(dateRange.start);
    const endDate = DynamicDateManager.formatDate(dateRange.end);

    // This would be used with search APIs that support date filtering
    return `${baseQuery} published:[${startDate} TO ${endDate}]`;
  }

  /**
   * Categorize the type of competitive intelligence
   */
  categorizeCompetitiveIntel(category: CompetitorQuery['category']): string {
    const categories = {
      product_launch: 'New Product/Service Launch',
      business_development: 'Partnership/M&A',
      contracts: 'Customer Win/Contract Award',
      financial: 'Financial Performance',
      technology: 'Technology/Innovation',
      specific_product: 'Product-Specific Activity',
      focus_area: 'Focus Area Activity',
      general: 'General Company News',
    };

    return categories[category] || 'Other';
  }

  /**
   * Assess threat level based on activity keywords
   */
  assessThreatLevel(title: string, summary: string, competitorName: string): 'HIGH' | 'MEDIUM' | 'LOW' {
    const text = `${title} ${summary}`.toLowerCase();

    // High threat indicators
    const highThreatKeywords = [
      'breakthrough',
      'revolutionary',
      'market leader',
      'dominates',
      'major contract',
      'exclusive',
      'partnership',
      'acquisition',
      'significant investment',
      'expansion',
      'growth',
    ];

    // Medium threat indicators
    const mediumThreatKeywords = [
      'new product',
      'launches',
      'introduces',
      'wins contract',
      'partnership',
      'agreement',
      'investment',
    ];

    const hasHighThreat = highThreatKeywords.some((keyword) => text.includes(keyword));
    const hasMediumThreat = mediumThreatKeywords.some((keyword) => text.includes(keyword));

    if (hasHighThreat) return 'HIGH';
    if (hasMediumThreat) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Calculate relevance score for competitive intelligence
   */
  calculateRelevance(title: string, summary: string, competitorName: string): number {
    let score = 5.0; // Base score

    const competitor = this.competitors[competitorName];
    if (!competitor) return score;

    // Boost for market leaders
    if (competitor.market_position.includes('Leader')) {
      score += 2.0;
    }

    // Boost for major players
    if (competitor.market_position.includes('Major')) {
      score += 1.5;
    }

    // Boost for relevant keywords
    const relevantKeywords = [
      'eor',
      'polymer',
      'production chemicals',
      'drilling fluids',
      'water treatment',
      'scale inhibitor',
      'corrosion',
      'demulsifier',
    ];

    const text = `${title} ${summary}`.toLowerCase();
    const keywordMatches = relevantKeywords.filter((kw) => text.includes(kw)).length;
    score += keywordMatches * 0.5;

    // Cap at 10.0
    return Math.min(score, 10.0);
  }

  /**
   * Process a scraped result into competitor intelligence format
   */
  processCompetitorResult(
    result: {
      title: string;
      summary: string;
      source: string;
      url: string;
      date: string;
      author?: string;
      credibility?: number;
    },
    queryObj: CompetitorQuery
  ): CompetitorIntelligence {
    const competitor = this.competitors[queryObj.competitor];
    const threatLevel = this.assessThreatLevel(result.title, result.summary, queryObj.competitor);
    const relevanceScore = this.calculateRelevance(result.title, result.summary, queryObj.competitor);

    return {
      id: `competitor-intel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      intelligence_type: 'web-scraped',
      source_category: 'external',
      sub_category: 'competitive_intelligence',
      is_strategic_document: false,
      web_scraped: true,
      scrape_date: new Date().toISOString(),

      // Competitor-specific fields
      competitor: queryObj.competitor,
      competitor_aliases: competitor.aliases,
      competitor_category: queryObj.category,
      competitor_focus_area: queryObj.focus_area || null,
      competitor_website: competitor.website,
      competitive_intelligence_type: this.categorizeCompetitiveIntel(queryObj.category),
      threat_level: threatLevel,
      relevance_score: relevanceScore,

      // Standard intelligence fields
      title: result.title,
      summary: result.summary,
      source: {
        name: result.source,
        url: result.url,
        publication_date: result.date,
        author: result.author,
        credibility_score: result.credibility || 8.0,
      },
      original_publication_date: result.date,
      tags: [
        'competitor',
        queryObj.competitor.toLowerCase().replace(/\s+/g, '-'),
        queryObj.category,
        'competitive-intelligence',
        threatLevel.toLowerCase(),
      ],
      market_segments: this.mapFocusAreasToSegments(competitor.focus_areas),
      date_range_scraped: {
        start: DynamicDateManager.formatDateForAPI(DynamicDateManager.getOneYearAgo()),
        end: DynamicDateManager.formatDateForAPI(DynamicDateManager.getToday()),
      },
    };
  }

  /**
   * Map competitor focus areas to market segments
   */
  private mapFocusAreasToSegments(focusAreas: string[]): string[] {
    const segments: string[] = [];
    const mapping: Record<string, string[]> = {
      'drilling fluids': ['Onshore', 'Offshore'],
      'production chemicals': ['Production Chemistry', 'Recovery'],
      'completion fluids': ['Onshore', 'Offshore'],
      EOR: ['Recovery'],
      'water treatment': ['Midstream', 'Production Chemistry'],
      stimulation: ['Onshore'],
      cementing: ['Onshore', 'Offshore'],
    };

    focusAreas.forEach((area) => {
      const areaLower = area.toLowerCase();
      Object.entries(mapping).forEach(([key, segs]) => {
        if (areaLower.includes(key)) {
          segments.push(...segs);
        }
      });
    });

    return Array.from(new Set(segments)); // Remove duplicates
  }

  /**
   * Get statistics about competitor tracking
   */
  getCompetitorStats() {
    return {
      total_competitors: Object.keys(this.competitors).length,
      excluded_companies: this.excludedCompanies,
      queries_per_competitor: 7, // Base query types
      total_queries: this.generateCompetitorQueries().length,
      market_leaders: Object.entries(this.competitors)
        .filter(([_, d]) => d.market_position.includes('Leader'))
        .map(([name]) => name),
      specialty_players: Object.entries(this.competitors)
        .filter(([_, d]) => d.market_position.includes('Specialty') || d.market_position.includes('specialist'))
        .map(([name]) => name),
    };
  }

  /**
   * Generate mock competitor intelligence for testing
   * (This would be replaced with real scraping in production)
   */
  generateMockIntelligence(competitorName: string, count: number = 3): CompetitorIntelligence[] {
    const competitor = this.competitors[competitorName];
    if (!competitor) return [];

    const mockResults: CompetitorIntelligence[] = [];
    const categories: CompetitorQuery['category'][] = [
      'product_launch',
      'business_development',
      'contracts',
      'financial',
      'technology',
    ];

    for (let i = 0; i < count; i++) {
      const category = categories[i % categories.length];
      const daysAgo = Math.floor(Math.random() * 365);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      const mockResult = {
        title: `${competitorName} ${this.categorizeCompetitiveIntel(category)} - Mock ${i + 1}`,
        summary: `Sample intelligence about ${competitorName}'s recent ${category} activity in the oilfield chemicals sector.`,
        source: 'Oil & Gas Journal',
        url: `https://www.ogj.com/mock/${competitorName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
        date: date.toISOString(),
        author: 'Industry Reporter',
        credibility: 9.0,
      };

      const queryObj: CompetitorQuery = {
        competitor: competitorName,
        query: `"${competitorName}" mock`,
        category,
      };

      mockResults.push(this.processCompetitorResult(mockResult, queryObj));
    }

    return mockResults;
  }
}

export default CompetitorIntelligenceService;
