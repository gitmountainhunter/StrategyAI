/**
 * Type definitions for Digital Integration Market Intelligence
 */

export type IntelligenceSegment = 'offshore' | 'onshore' | 'midstream' | 'recovery' | 'integratedSolutions' | 'general';

export type IntelligenceCategory =
  | 'technology_trend'
  | 'market_analysis'
  | 'product_launch'
  | 'strategic_moves'
  | 'case_study'
  | 'regulatory'
  | 'research'
  | 'general_news';

export interface IntelligenceSource {
  name: string;
  url: string;
  author?: string;
  publishedDate: string;
  logo?: string;
}

export interface IntelligenceCitation {
  formatted: string;
  linkVerified: boolean;
  lastVerified: string;
}

export interface IntelligenceItem {
  id: string;
  segment: IntelligenceSegment;
  title: string;
  summary: string;
  source: IntelligenceSource;
  publishedDate: string;
  scrapedDate: string;
  category: IntelligenceCategory;
  relevanceScore: number;
  tags: string[];
  isArchived: boolean;
  archivedDate?: string;
  citation: IntelligenceCitation;
}

export interface MarketIntelligenceData {
  lastScraped: string | null;
  scrapingConfig: {
    rollingWindowDays: number;
    archiveEnabled: boolean;
    autoRefreshHours: number;
    manualRefreshCooldownMinutes: number;
    maxItemsPerSegment: number;
    deleteArchivedAfterDays: number;
  };
  currentIntelligence: IntelligenceItem[];
  archivedIntelligence: IntelligenceItem[];
}

export const INTELLIGENCE_CATEGORIES: Record<
  IntelligenceCategory,
  {
    label: string;
    icon: string;
    color: string;
    description: string;
  }
> = {
  technology_trend: {
    label: 'Technology Trends',
    icon: '🔬',
    color: '#0014DC',
    description: 'Emerging digital technologies and innovations'
  },
  market_analysis: {
    label: 'Market Analysis',
    icon: '📊',
    color: '#2E7D32',
    description: 'Market sizing, forecasts, and growth projections'
  },
  product_launch: {
    label: 'Product Launches',
    icon: '🚀',
    color: '#F57C00',
    description: 'New digital products and solutions'
  },
  strategic_moves: {
    label: 'Strategic Moves',
    icon: '♟️',
    color: '#7B1FA2',
    description: 'M&A, partnerships, and strategic initiatives'
  },
  case_study: {
    label: 'Case Studies',
    icon: '📋',
    color: '#00838F',
    description: 'Implementation success stories and deployments'
  },
  regulatory: {
    label: 'Regulatory Updates',
    icon: '⚖️',
    color: '#C62828',
    description: 'Compliance, standards, and policy changes'
  },
  research: {
    label: 'Research & Analysis',
    icon: '🔍',
    color: '#1565C0',
    description: 'Industry studies and technical papers'
  },
  general_news: {
    label: 'Industry News',
    icon: '📰',
    color: '#455A64',
    description: 'General digital transformation news'
  }
};

export const SEGMENT_LABELS: Record<IntelligenceSegment, string> = {
  offshore: 'Offshore',
  onshore: 'Onshore',
  midstream: 'Midstream',
  recovery: 'Recovery',
  integratedSolutions: 'Integrated Solutions',
  general: 'General'
};
