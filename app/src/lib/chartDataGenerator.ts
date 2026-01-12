// Chart Data Generator - Fetches local JSON data and formats for charts

import { ChartType, DataSource } from './queryAnalyzer';
import { strategyData } from '@/data/strategy';

export interface ChartData {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  data: any[];
  config?: ChartConfig;
  insights?: string[];
}

export interface ChartConfig {
  xAxisKey?: string;
  yAxisKey?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  animate?: boolean;
  height?: number;
}

// SLB Brand Colors
const SLB_COLORS = {
  primary: '#0014DC',
  secondary: '#000000',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

const STATUS_COLORS: Record<string, string> = {
  'on-track': SLB_COLORS.success,
  'at-risk': SLB_COLORS.warning,
  'delayed': SLB_COLORS.danger,
  'completed': SLB_COLORS.primary,
  'in-progress': SLB_COLORS.primary,
  'pending': '#9ca3af',
};

// Generate chart data based on data source
export async function generateChartData(
  dataSource: DataSource,
  chartType: ChartType,
  title: string,
  filters?: any
): Promise<ChartData> {
  switch (dataSource) {
    case 'outcomes':
      return await generateOutcomesChart(chartType, title, filters);
    case 'revenue':
      return await generateRevenueChart(chartType, title, filters);
    case 'priorities':
      return await generatePrioritiesChart(chartType, title, filters);
    case 'history':
      return await generateHistoryChart(chartType, title, filters);
    case 'segments':
      return generateSegmentsChart(chartType, title, filters);
    case 'competitors':
      return generateCompetitorsChart(chartType, title, filters);
    default:
      return await generateOutcomesChart(chartType, title, filters);
  }
}

// Generate Strategic Outcomes Chart
async function generateOutcomesChart(
  chartType: ChartType,
  title: string,
  filters?: any
): Promise<ChartData> {
  // Fetch from local JSON
  const response = await fetch('/api/data?type=outcomes');
  const data = await response.json();
  const outcomes = data.outcomes || [];

  // Apply filters
  let filteredOutcomes = outcomes;
  if (filters?.status) {
    filteredOutcomes = outcomes.filter((o: any) => o.status === filters.status);
  }

  // Format for chart
  const chartData = filteredOutcomes.map((outcome: any) => ({
    name: outcome.name.length > 25 ? outcome.name.substring(0, 25) + '...' : outcome.name,
    fullName: outcome.name,
    progress: outcome.progress_percentage,
    status: outcome.status,
    fill: STATUS_COLORS[outcome.status] || SLB_COLORS.primary,
  }));

  // Generate insights
  const insights = generateOutcomesInsights(filteredOutcomes);

  return {
    id: `outcomes-${Date.now()}`,
    type: chartType,
    title,
    description: `Progress across ${filteredOutcomes.length} strategic outcomes`,
    data: chartData,
    config: {
      xAxisKey: 'name',
      yAxisKey: 'progress',
      colors: [SLB_COLORS.primary],
      showLegend: false,
      showGrid: true,
      animate: true,
      height: 300,
    },
    insights,
  };
}

// Generate Revenue Chart
async function generateRevenueChart(
  chartType: ChartType,
  title: string,
  filters?: any
): Promise<ChartData> {
  // Fetch revenue targets
  const revenueResponse = await fetch('/api/data?type=revenue');
  const revenueData = await revenueResponse.json();
  const target = revenueData.targets?.[0];

  // Fetch history for trend
  const historyResponse = await fetch('/api/data?type=history');
  const historyData = await historyResponse.json();
  const history = historyData.history || [];

  // Format data based on chart type
  let chartData;
  if (chartType === 'line') {
    // Line chart showing revenue over time
    chartData = history.map((h: any) => ({
      date: new Date(h.date).toLocaleDateString('en-US', { month: 'short' }),
      revenue: h.revenue,
      target: target?.target_amount || 1055,
    }));
  } else {
    // Bar/gauge showing current progress
    chartData = [{
      name: 'Revenue',
      actual: target?.actual_amount || 785,
      target: target?.target_amount || 1055,
      progress: target?.progress_percentage || 74.4,
    }];
  }

  const insights = [
    `Current revenue: $${target?.actual_amount || 785}M`,
    `Target: $${target?.target_amount || 1055}M by 2030`,
    `Progress: ${(target?.progress_percentage || 74.4).toFixed(1)}%`,
    history.length > 1
      ? `Growth: +$${history[history.length - 1].revenue - history[0].revenue}M over ${history.length} months`
      : '',
  ].filter(Boolean);

  return {
    id: `revenue-${Date.now()}`,
    type: chartType,
    title,
    description: 'Revenue progress toward 2030 target',
    data: chartData,
    config: {
      xAxisKey: chartType === 'line' ? 'date' : 'name',
      yAxisKey: chartType === 'line' ? 'revenue' : 'actual',
      colors: [SLB_COLORS.primary, '#9ca3af'],
      showLegend: chartType === 'line',
      showGrid: true,
      animate: true,
      height: 250,
    },
    insights,
  };
}

// Generate Priorities Chart
async function generatePrioritiesChart(
  chartType: ChartType,
  title: string,
  filters?: any
): Promise<ChartData> {
  const response = await fetch('/api/data?type=priorities');
  const data = await response.json();
  let priorities = data.priorities || [];

  // Apply filters
  if (filters?.status) {
    priorities = priorities.filter((p: any) => p.status === filters.status);
  }

  // Format for chart
  const chartData = priorities.map((priority: any) => ({
    name: priority.name.length > 30 ? priority.name.substring(0, 30) + '...' : priority.name,
    fullName: priority.name,
    progress: priority.completion_percentage,
    status: priority.status,
    fill: STATUS_COLORS[priority.status] || SLB_COLORS.primary,
  }));

  // Generate insights
  const completed = priorities.filter((p: any) => p.status === 'completed').length;
  const inProgress = priorities.filter((p: any) => p.status === 'in-progress').length;
  const avgProgress = priorities.reduce((sum: number, p: any) => sum + p.completion_percentage, 0) / priorities.length;

  const insights = [
    `${completed} of ${priorities.length} priorities completed`,
    `${inProgress} in progress`,
    `Average completion: ${avgProgress.toFixed(0)}%`,
  ];

  return {
    id: `priorities-${Date.now()}`,
    type: chartType,
    title,
    description: `Status of ${priorities.length} priorities for 2026`,
    data: chartData,
    config: {
      xAxisKey: 'name',
      yAxisKey: 'progress',
      colors: [SLB_COLORS.primary],
      showLegend: false,
      showGrid: true,
      animate: true,
      height: 350,
    },
    insights,
  };
}

// Generate Historical Trends Chart
async function generateHistoryChart(
  chartType: ChartType,
  title: string,
  filters?: any
): Promise<ChartData> {
  const response = await fetch('/api/data?type=history');
  const data = await response.json();
  const history = data.history || [];

  // Format for multi-line chart showing outcome trends
  const chartData = history.map((h: any) => ({
    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short' }),
    'Strategy in Action': h.outcomes['strategy-action'] || 0,
    'Faster Innovation': h.outcomes['faster-innovation'] || 0,
    'Simpler Workflows': h.outcomes['simpler-workflows'] || 0,
    'Customer First': h.outcomes['customer-responsiveness'] || 0,
    revenue: h.revenue,
  }));

  // Calculate trends
  const insights = [];
  if (history.length > 1) {
    const first = history[0];
    const last = history[history.length - 1];

    // Calculate average improvement
    const firstAvg = Object.values(first.outcomes as Record<string, number>).reduce((a, b) => a + b, 0) /
                     Object.keys(first.outcomes).length;
    const lastAvg = Object.values(last.outcomes as Record<string, number>).reduce((a, b) => a + b, 0) /
                    Object.keys(last.outcomes).length;

    insights.push(`Overall improvement: +${(lastAvg - firstAvg).toFixed(0)}% over ${history.length} months`);
    insights.push(`Revenue growth: +$${last.revenue - first.revenue}M`);
  }

  return {
    id: `history-${Date.now()}`,
    type: 'line',
    title,
    description: `Performance trends over last ${history.length} months`,
    data: chartData,
    config: {
      xAxisKey: 'date',
      yAxisKey: '',
      colors: [SLB_COLORS.primary, SLB_COLORS.warning, SLB_COLORS.success, SLB_COLORS.purple],
      showLegend: true,
      showGrid: true,
      animate: true,
      height: 300,
    },
    insights,
  };
}

// Generate Market Segments Chart
function generateSegmentsChart(
  chartType: ChartType,
  title: string,
  filters?: any
): ChartData {
  const segments = strategyData.segments;

  // Apply segment filter if specified
  let filteredSegments = segments;
  if (filters?.segment) {
    filteredSegments = segments.filter(s =>
      s.name.toLowerCase().includes(filters.segment.toLowerCase())
    );
  }

  // Format for chart
  const chartData = filteredSegments.map(segment => ({
    name: segment.name,
    marketSize: segment.marketSize || 0,
    growth: segment.growthRate || 0,
    fill: SLB_COLORS.primary,
  }));

  const totalMarket = segments.reduce((sum, s) => sum + (s.marketSize || 0), 0);
  const avgGrowth = segments.reduce((sum, s) => sum + (s.growthRate || 0), 0) / segments.length;

  const insights = [
    `Total addressable market: $${(totalMarket / 1000).toFixed(1)}B`,
    `Average growth rate: ${avgGrowth.toFixed(1)}%`,
    `Highest growth: ${segments.reduce((max, s) => (s.growthRate || 0) > (max.growthRate || 0) ? s : max).name}`,
  ];

  return {
    id: `segments-${Date.now()}`,
    type: chartType,
    title,
    description: 'Market size and growth by segment',
    data: chartData,
    config: {
      xAxisKey: 'name',
      yAxisKey: 'marketSize',
      colors: [SLB_COLORS.primary, SLB_COLORS.cyan, SLB_COLORS.success, SLB_COLORS.warning, SLB_COLORS.purple],
      showLegend: chartType === 'pie',
      showGrid: chartType !== 'pie',
      animate: true,
      height: 300,
    },
    insights,
  };
}

// Generate Competitors Chart
function generateCompetitorsChart(
  chartType: ChartType,
  title: string,
  filters?: any
): ChartData {
  // Get competitor data from segments
  const competitors = [
    { name: 'SLB (Us)', share: 20, fill: SLB_COLORS.primary },
    { name: 'Baker Hughes', share: 20, fill: '#6b7280' },
    { name: 'Halliburton', share: 15, fill: '#9ca3af' },
    { name: 'Others', share: 45, fill: '#d1d5db' },
  ];

  const insights = [
    'Competitive market with top 3 holding ~55% share',
    'Baker Hughes: Strong flow assurance portfolio',
    'Halliburton: Cost-competitive positioning',
    'Opportunity for market share gains in digital solutions',
  ];

  return {
    id: `competitors-${Date.now()}`,
    type: chartType === 'bar' ? 'bar' : 'pie',
    title,
    description: 'Market share distribution',
    data: competitors,
    config: {
      xAxisKey: 'name',
      yAxisKey: 'share',
      colors: [SLB_COLORS.primary, '#6b7280', '#9ca3af', '#d1d5db'],
      showLegend: true,
      showGrid: chartType === 'bar',
      animate: true,
      height: 280,
    },
    insights,
  };
}

// Helper function to generate insights for outcomes
function generateOutcomesInsights(outcomes: any[]): string[] {
  const onTrack = outcomes.filter(o => o.status === 'on-track').length;
  const atRisk = outcomes.filter(o => o.status === 'at-risk').length;
  const avgProgress = outcomes.reduce((sum, o) => sum + o.progress_percentage, 0) / outcomes.length;

  const insights = [
    `${onTrack} of ${outcomes.length} outcomes on track`,
    `Average progress: ${avgProgress.toFixed(0)}%`,
  ];

  if (atRisk > 0) {
    insights.push(`${atRisk} outcome${atRisk > 1 ? 's' : ''} at risk - needs attention`);
  }

  // Find highest and lowest
  if (outcomes.length > 1) {
    const sorted = [...outcomes].sort((a, b) => b.progress_percentage - a.progress_percentage);
    insights.push(`Leading: ${sorted[0].name.substring(0, 30)} (${sorted[0].progress_percentage}%)`);
  }

  return insights;
}
