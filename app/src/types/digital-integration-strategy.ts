// Digital Integration Strategy Type Definitions
// Comprehensive type system for the Digital Integration Strategy page

export type SegmentId =
  | 'onshore-unconventional'
  | 'onshore-conventional'
  | 'offshore'
  | 'recovery'
  | 'midstream'
  | 'integrated-solutions';

export type ImplementationStatus = 'planned' | 'in-progress' | 'deployed' | 'optimized';
export type TrendDirection = 'improving' | 'stable' | 'declining';
export type StatusLevel = 'on-track' | 'at-risk' | 'behind';
export type MeasurementFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
export type SynergyType = 'technology' | 'intelligence' | 'customer' | 'solution' | 'competitive';
export type SynergyStatus = 'identified' | 'validated' | 'realized';

// Digital Enabler - Specific technology or capability
export interface DigitalEnabler {
  id: string;
  name: string;
  description: string;
  implementationStatus: ImplementationStatus;
  businessValue: string;
  technicalRequirements: string[];
  estimatedROI?: number;
  timelineMonths?: number;
}

// Digital Segment - Market segment with digital transformation details
export interface DigitalSegment {
  id: SegmentId;
  name: string;
  subSegments?: string[];
  description: string;
  marketSize: number; // in millions USD
  growthRate: number; // percentage
  digitalEnablers: DigitalEnabler[];
  keyApplications: string[];
  maturityScore: number; // 0-100
  opportunities: string[];
  challenges: string[];
  customerPainPoints: string[];
  valuePropositions: string[];
  keyMetrics: {
    efficiencyGain: number; // percentage
    costReduction: number; // percentage
    safetyImprovement: number; // percentage
    downtimeReduction: number; // percentage
  };
}

// Time Series Data Point - For historical KPI tracking
export interface TimeSeriesDataPoint {
  date: string; // ISO format
  value: number;
  notes?: string;
}

// KPI - Key Performance Indicator
export interface KPI {
  id: string;
  name: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  measurementFrequency: MeasurementFrequency;
  dataSource: string;
  trend: TrendDirection;
  historicalData: TimeSeriesDataPoint[];
  lastUpdated: string;
}

// KPO - Key Performance Objective
export interface KPO {
  id: string;
  name: string;
  objective: string;
  owner: string;
  status: StatusLevel;
  overallScore: number; // 0-100
  kpis: KPI[];
  lastReviewed: string;
}

// Capability Score - Individual capability assessment
export interface CapabilityScore {
  capability: string;
  score: number; // 1-5
  evidence: string;
  improvementPlan: string;
  priority: 'high' | 'medium' | 'low';
}

// Maturity Assessment - Comprehensive capability evaluation
export interface MaturityAssessment {
  segmentId: SegmentId;
  capabilities: CapabilityScore[];
  overallScore: number; // 0-100
  lastAssessment: string;
  nextAssessment: string;
  assessor: string;
}

// Synergy Connection - Cross-segment value relationships
export interface SynergyConnection {
  id: string;
  sourceSegment: SegmentId;
  targetSegment: SegmentId;
  synergyType: SynergyType;
  value: number; // estimated value in millions USD
  description: string;
  status: SynergyStatus;
  realizationDate?: string;
  dependencies: string[];
}

// Competitor Digital Position - Competitive landscape
export interface CompetitorDigitalPosition {
  competitorId: string;
  name: string;
  digitalMaturity: number; // 0-100 (x-axis)
  segmentCoverage: number; // 0-100 (y-axis)
  marketShare: number; // percentage (bubble size)
  primarySegment: SegmentId;
  lastUpdated: string;
  digitalCapabilities: string[];
  strengths: string[];
  weaknesses: string[];
}

// Roadmap Phase - Implementation timeline phase
export interface RoadmapPhase {
  id: string;
  name: string;
  quarter: string; // e.g., "Q1 2024"
  startDate: string;
  endDate: string;
  objectives: string[];
  deliverables: string[];
  status: 'completed' | 'in-progress' | 'planned';
  progress: number; // 0-100
  milestones: RoadmapMilestone[];
}

// Roadmap Milestone - Specific milestone within a phase
export interface RoadmapMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  completionDate?: string;
  status: 'completed' | 'in-progress' | 'at-risk' | 'planned';
  dependencies: string[];
  owner: string;
  relatedSegments: SegmentId[];
}

// Value Breakdown - Financial impact categories
export interface ValueBreakdown {
  category: string;
  value: number; // in millions USD
  percentage: number;
  description: string;
  segments: {
    segmentId: SegmentId;
    contribution: number;
  }[];
}

// Risk Assessment - Risk mitigation matrix
export interface RiskAssessment {
  category: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  probability: number; // 0-100
  impact: number; // 0-100
  mitigationStrategy: string;
  digitalMitigationRole: string;
  status: 'mitigated' | 'in-progress' | 'identified';
}

// Investment Analysis - ROI and investment tracking
export interface InvestmentAnalysis {
  initiative: string;
  segmentId: SegmentId;
  investment: number; // in millions USD
  returnValue: number; // in millions USD
  roi: number; // percentage
  paybackPeriod: number; // months
  strategicImportance: 'critical' | 'high' | 'medium' | 'low';
  status: ImplementationStatus;
}

// Digital Integration Strategy Data - Main data structure
export interface DigitalIntegrationStrategyData {
  lastUpdated: string;
  overview: {
    totalMarketSize: number; // in millions USD
    digitalAdoptionRate: number; // percentage
    efficiencyGains: number; // percentage
    overallHealthScore: number; // 0-100
  };
  segments: DigitalSegment[];
  kpos: KPO[];
  maturityAssessments: MaturityAssessment[];
  roadmap: RoadmapPhase[];
  synergies: SynergyConnection[];
  competitors: CompetitorDigitalPosition[];
  valueBreakdown: ValueBreakdown[];
  riskAssessments: RiskAssessment[];
  investments: InvestmentAnalysis[];
}

// Chart Data Types - For visualization components
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface NetworkNode {
  id: string;
  label: string;
  group: string;
  value: number;
  color?: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  value: number;
  label?: string;
}

// Filter State - For interactive filtering
export interface FilterState {
  selectedSegments: SegmentId[];
  timeRange: {
    start: string;
    end: string;
  };
  showProjections: boolean;
  comparisonMode: boolean;
}

// Export Configuration - For report generation
export interface ExportConfig {
  format: 'pdf' | 'excel' | 'png';
  sections: string[];
  includeCharts: boolean;
  includeData: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}
