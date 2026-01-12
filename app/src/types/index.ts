// Strategy Document Types
export interface StrategyDocument {
  id: string;
  version: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  content: StrategyContent;
}

export interface StrategyContent {
  ambition: Ambition;
  segments: Segment[];
  strategicOutcomes: StrategicOutcome[];
  priorities: Priority[];
  constraints: string[];
  foundation: string[];
}

export interface Ambition {
  year: number;
  revenueTarget: number;
  revenueGrowth: string;
  ibtTarget: string;
  focusAreas: string[];
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  products: string[];
  marketSize?: number;
  growthRate?: number;
  competitors?: Competitor[];
}

export interface StrategicOutcome {
  id: string;
  title: string;
  description: string;
  owner: string;
  collaborators: string[];
  kpis: KPI[];
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
}

export interface Priority {
  id: string;
  outcome: string;
  action: string;
  quarter: string;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies?: string[];
}

export interface KPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

// Market Intelligence Types
export interface MarketIntelligence {
  id: string;
  type: 'news' | 'trend' | 'competitor' | 'regulatory' | 'technology';
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedAt: Date;
  scrapedAt: Date;
  segment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
  tags: string[];
}

export interface Competitor {
  id: string;
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  products: string[];
  marketShare?: number;
  recentActivities: string[];
}

export interface MarketTrend {
  id: string;
  name: string;
  segment: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  sources: string[];
  dataPoints: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: Date;
  value: number;
  label?: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    charts?: ChartData[];
    sources?: string[];
    suggestions?: string[];
  };
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

// Visualization Types
export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'progress' | 'gauge' | 'area' | 'radar';
  title: string;
  description?: string;
  data: any[];
  config?: ChartConfig;
  insights?: string[];
}

export interface ChartConfig {
  xAxis?: string;
  xAxisKey?: string;
  yAxis?: string;
  yAxisKey?: string;
  colors?: string[];
  legend?: boolean;
  showLegend?: boolean;
  grid?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  height?: number;
}

// Dashboard Types
export interface DashboardMetric {
  id: string;
  name: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  unit?: string;
  icon?: string;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Strategy Version Control
export interface StrategyVersion {
  id: string;
  version: number;
  createdAt: Date;
  author: string;
  changeType: 'major' | 'minor' | 'patch';
  changeSummary: string;
  changes: StrategyChange[];
}

export interface StrategyChange {
  field: string;
  oldValue: any;
  newValue: any;
  reason: string;
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'pptx' | 'csv' | 'json';
  sections: string[];
  includeCharts: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
