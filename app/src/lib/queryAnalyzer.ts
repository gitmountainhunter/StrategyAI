// Query Analyzer for Chat Visualization Intent Detection

export type ChartType = 'bar' | 'line' | 'pie' | 'progress' | 'gauge' | 'area' | 'radar';
export type DataSource = 'outcomes' | 'revenue' | 'priorities' | 'history' | 'segments' | 'competitors';

export interface VisualizationIntent {
  shouldVisualize: boolean;
  chartType: ChartType;
  dataSource: DataSource;
  title: string;
  filters?: {
    status?: string;
    dateRange?: string;
    segment?: string;
  };
}

interface PatternMatch {
  patterns: RegExp[];
  chartType: ChartType;
  dataSource: DataSource;
  title: string;
}

const visualizationPatterns: PatternMatch[] = [
  // Strategic Outcomes Progress
  {
    patterns: [
      /show\s+(me\s+)?(strategic\s+)?outcomes?/i,
      /outcomes?\s+progress/i,
      /how\s+are\s+(the\s+)?outcomes?/i,
      /visualize\s+outcomes?/i,
      /progress\s+on\s+outcomes?/i,
      /strategic\s+progress/i,
    ],
    chartType: 'bar',
    dataSource: 'outcomes',
    title: 'Strategic Outcomes Progress',
  },
  // Revenue Trends
  {
    patterns: [
      /revenue\s+trend/i,
      /revenue\s+(over\s+time|history)/i,
      /show\s+(me\s+)?revenue/i,
      /2030\s+(revenue\s+)?target/i,
      /revenue\s+progress/i,
      /how\s+(is|are)\s+(we|our)\s+tracking.*revenue/i,
      /revenue\s+trajectory/i,
    ],
    chartType: 'line',
    dataSource: 'revenue',
    title: 'Revenue Progress to 2030 Target',
  },
  // Market Segments
  {
    patterns: [
      /market\s+segment/i,
      /segment\s+(comparison|performance)/i,
      /compare\s+segments?/i,
      /show\s+(me\s+)?segments?/i,
      /(onshore|offshore|midstream|recovery|integrated)\s+performance/i,
      /segment\s+breakdown/i,
      /market\s+size/i,
    ],
    chartType: 'bar',
    dataSource: 'segments',
    title: 'Market Segment Performance',
  },
  // Priorities Status
  {
    patterns: [
      /priorities?\s+(status|progress)/i,
      /show\s+(me\s+)?priorities/i,
      /2026\s+priorities/i,
      /how\s+are\s+(the\s+)?priorities/i,
      /action\s+items?\s+(status|progress)/i,
      /priority\s+completion/i,
    ],
    chartType: 'bar',
    dataSource: 'priorities',
    title: '2026 Priorities Status',
  },
  // Historical Trends / KPI History
  {
    patterns: [
      /trend(s)?\s+over\s+time/i,
      /historical\s+(data|trends?)/i,
      /kpi\s+trend/i,
      /performance\s+over\s+time/i,
      /last\s+(3|three)\s+months?/i,
      /monthly\s+progress/i,
      /how\s+has\s+.+\s+(changed|trended)/i,
    ],
    chartType: 'line',
    dataSource: 'history',
    title: 'KPI Performance Trends',
  },
  // Competitor Analysis
  {
    patterns: [
      /competitor/i,
      /market\s+share/i,
      /baker\s+hughes/i,
      /halliburton/i,
      /competitive\s+(landscape|analysis)/i,
    ],
    chartType: 'bar',
    dataSource: 'competitors',
    title: 'Competitive Market Analysis',
  },
  // Overall/Dashboard View
  {
    patterns: [
      /overall\s+(status|progress|performance)/i,
      /comprehensive\s+view/i,
      /dashboard/i,
      /how\s+are\s+we\s+doing/i,
      /general\s+overview/i,
    ],
    chartType: 'bar',
    dataSource: 'outcomes',
    title: 'Overall Strategic Performance',
  },
  // Distribution/Breakdown (Pie Charts)
  {
    patterns: [
      /breakdown/i,
      /distribution/i,
      /composition/i,
      /pie\s+chart/i,
      /share\s+of/i,
    ],
    chartType: 'pie',
    dataSource: 'segments',
    title: 'Distribution Analysis',
  },
];

// Additional keywords that suggest visualization need
const visualizationKeywords = [
  'show', 'display', 'visualize', 'graph', 'chart', 'plot', 'draw',
  'trend', 'compare', 'progress', 'breakdown', 'distribution',
  'over time', 'historical', 'track', 'status'
];

export function analyzeQuery(query: string): VisualizationIntent {
  const normalizedQuery = query.toLowerCase().trim();

  // Check for explicit "don't visualize" or text-only requests
  if (/just\s+text|no\s+chart|without\s+(a\s+)?chart/i.test(normalizedQuery)) {
    return {
      shouldVisualize: false,
      chartType: 'bar',
      dataSource: 'outcomes',
      title: '',
    };
  }

  // Check each pattern for a match
  for (const pattern of visualizationPatterns) {
    for (const regex of pattern.patterns) {
      if (regex.test(normalizedQuery)) {
        return {
          shouldVisualize: true,
          chartType: pattern.chartType,
          dataSource: pattern.dataSource,
          title: pattern.title,
          filters: extractFilters(normalizedQuery),
        };
      }
    }
  }

  // Check for general visualization keywords
  const hasVisualizationKeyword = visualizationKeywords.some(keyword =>
    normalizedQuery.includes(keyword)
  );

  if (hasVisualizationKeyword) {
    // Default to outcomes progress if we detect visualization intent but no specific pattern
    return {
      shouldVisualize: true,
      chartType: 'bar',
      dataSource: 'outcomes',
      title: 'Strategic Overview',
      filters: extractFilters(normalizedQuery),
    };
  }

  // No visualization needed
  return {
    shouldVisualize: false,
    chartType: 'bar',
    dataSource: 'outcomes',
    title: '',
  };
}

function extractFilters(query: string): VisualizationIntent['filters'] {
  const filters: VisualizationIntent['filters'] = {};

  // Extract status filters
  if (/on[\s-]?track/i.test(query)) {
    filters.status = 'on-track';
  } else if (/at[\s-]?risk/i.test(query)) {
    filters.status = 'at-risk';
  } else if (/delayed/i.test(query)) {
    filters.status = 'delayed';
  } else if (/completed/i.test(query)) {
    filters.status = 'completed';
  }

  // Extract segment filters
  const segmentMatch = query.match(/(onshore|offshore|midstream|recovery|integrated)/i);
  if (segmentMatch) {
    filters.segment = segmentMatch[1].toLowerCase();
  }

  // Extract date range
  if (/last\s+(3|three)\s+months?/i.test(query)) {
    filters.dateRange = '3months';
  } else if (/this\s+(month|quarter)/i.test(query)) {
    filters.dateRange = 'current';
  } else if (/year[\s-]?to[\s-]?date|ytd/i.test(query)) {
    filters.dateRange = 'ytd';
  }

  return Object.keys(filters).length > 0 ? filters : undefined;
}

// Suggest chart type based on data characteristics
export function suggestChartType(
  dataPoints: number,
  hasTimeComponent: boolean,
  isComparison: boolean,
  isDistribution: boolean
): ChartType {
  if (hasTimeComponent && dataPoints > 2) {
    return 'line';
  }
  if (isDistribution && dataPoints <= 6) {
    return 'pie';
  }
  if (isComparison || dataPoints > 1) {
    return 'bar';
  }
  if (dataPoints === 1) {
    return 'gauge';
  }
  return 'bar';
}

// Get follow-up suggestions based on current visualization
export function getFollowUpSuggestions(dataSource: DataSource): string[] {
  const suggestions: Record<DataSource, string[]> = {
    outcomes: [
      'Show me the at-risk outcomes',
      'What are the KPI trends?',
      'Compare with priorities progress',
    ],
    revenue: [
      'Show revenue by segment',
      'What are the growth trends?',
      'Compare to last year',
    ],
    priorities: [
      'Show only completed priorities',
      'What priorities are at risk?',
      'Link to strategic outcomes',
    ],
    history: [
      'Show revenue trend separately',
      'Compare all outcomes over time',
      'Focus on at-risk items',
    ],
    segments: [
      'Show growth rates by segment',
      'Compare competitor market share',
      'Drill into specific segment',
    ],
    competitors: [
      'Show our market position',
      'Compare product portfolios',
      'Show growth comparison',
    ],
  };

  return suggestions[dataSource] || [];
}
