'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Globe,
  Beaker,
  Loader2
} from 'lucide-react';
import { strategyData } from '@/data/strategy';
import { MetricCard } from '@/components/MetricCard';
import { ProgressChart } from '@/components/charts/ProgressChart';
import { SegmentChart } from '@/components/charts/SegmentChart';
import { PriorityTimeline } from '@/components/PriorityTimeline';
import { AlertsList } from '@/components/AlertsList';
import { QuickActions } from '@/components/QuickActions';

interface LocalOutcome {
  id: string;
  name: string;
  progress_percentage: number;
  status: string;
  owner: string;
  last_updated: string;
  notes: string;
}

interface LocalPriority {
  id: string;
  name: string;
  completion_percentage: number;
  status: string;
  due_date: string;
  last_updated: string;
}

interface LocalRevenue {
  id: string;
  target_year: number;
  target_amount: number;
  actual_amount: number;
  progress_percentage: number;
  last_updated: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleDateString());

  // Live data from local files
  const [liveOutcomes, setLiveOutcomes] = useState<LocalOutcome[]>([]);
  const [livePriorities, setLivePriorities] = useState<LocalPriority[]>([]);
  const [liveRevenue, setLiveRevenue] = useState<LocalRevenue | null>(null);

  // Load data from local files on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/data?type=all');
        if (response.ok) {
          const data = await response.json();

          if (data.outcomes?.outcomes) {
            setLiveOutcomes(data.outcomes.outcomes);
            // Update last updated from most recent outcome
            const dates = data.outcomes.outcomes.map((o: LocalOutcome) => new Date(o.last_updated));
            if (dates.length > 0) {
              const mostRecent = new Date(Math.max(...dates.map((d: Date) => d.getTime())));
              setLastUpdated(mostRecent.toLocaleDateString());
            }
          }

          if (data.revenue?.targets?.[0]) {
            setLiveRevenue(data.revenue.targets[0]);
          }

          if (data.priorities?.priorities) {
            setLivePriorities(data.priorities.priorities);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Calculate metrics from live data or fall back to static data
  const totalOutcomes = liveOutcomes.length > 0 ? liveOutcomes.length : strategyData.strategicOutcomes.length;
  const onTrackOutcomes = liveOutcomes.length > 0
    ? liveOutcomes.filter(o => o.status === 'on-track').length
    : strategyData.strategicOutcomes.filter(o => o.status === 'on-track').length;
  const atRiskOutcomes = liveOutcomes.length > 0
    ? liveOutcomes.filter(o => o.status === 'at-risk').length
    : strategyData.strategicOutcomes.filter(o => o.status === 'at-risk').length;

  const totalPriorities = livePriorities.length > 0 ? livePriorities.length : strategyData.priorities.length;
  const completedPriorities = livePriorities.length > 0
    ? livePriorities.filter(p => p.status === 'completed').length
    : strategyData.priorities.filter(p => p.status === 'completed').length;
  const inProgressPriorities = livePriorities.length > 0
    ? livePriorities.filter(p => p.status === 'in-progress').length
    : strategyData.priorities.filter(p => p.status === 'in-progress').length;

  // Calculate average KPI progress from live data
  const avgKpiProgress = liveOutcomes.length > 0
    ? liveOutcomes.reduce((acc, outcome) => acc + outcome.progress_percentage, 0) / liveOutcomes.length
    : strategyData.strategicOutcomes.reduce((acc, outcome) => {
        const outcomeAvg = outcome.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) / outcome.kpis.length;
        return acc + outcomeAvg;
      }, 0) / strategyData.strategicOutcomes.length;

  // Get revenue data
  const actualRevenue = liveRevenue?.actual_amount || 785;
  const targetRevenue = liveRevenue?.target_amount || strategyData.ambition.revenueTarget;
  const revenueProgress = liveRevenue?.progress_percentage || ((actualRevenue / targetRevenue) * 100);

  // Transform live outcomes for ProgressChart
  const chartOutcomes = liveOutcomes.length > 0
    ? liveOutcomes.map(o => ({
        id: o.id,
        title: o.name,
        status: o.status as 'on-track' | 'at-risk' | 'delayed' | 'completed',
        owner: o.owner,
        collaborators: [],
        description: '',
        kpis: [{
          id: `${o.id}-progress`,
          name: 'Progress',
          current: o.progress_percentage,
          target: 100,
          unit: '%',
          trend: 'stable' as const
        }]
      }))
    : strategyData.strategicOutcomes;

  // Transform live priorities for PriorityTimeline
  const timelinePriorities = livePriorities.length > 0
    ? livePriorities.slice(0, 5).map(p => ({
        id: p.id,
        action: p.name,
        outcome: 'General',
        quarter: p.due_date ? `Q${Math.ceil((new Date(p.due_date).getMonth() + 1) / 3)}` : 'Q1',
        status: p.status as 'pending' | 'in-progress' | 'completed'
      }))
    : strategyData.priorities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-slb-black">Strategy Dashboard</h1>
          <p className="text-sm font-light text-gray-500 mt-1">
            PCT Marketing & Technology Strategy - 2030 Ambition
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-light rounded-full flex items-center space-x-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading...</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-light rounded-full">
              Live Data
            </span>
          )}
          <span className="text-sm font-light text-gray-500">
            Last updated: {lastUpdated}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="2030 Revenue Target"
          value={`$${actualRevenue}M / $${targetRevenue}M`}
          change={`${revenueProgress.toFixed(1)}% achieved`}
          changeType="increase"
          icon={<Target className="w-5 h-5" />}
          description="Revenue progress to target"
        />
        <MetricCard
          title="Strategic Outcomes"
          value={`${onTrackOutcomes}/${totalOutcomes}`}
          change={`${atRiskOutcomes} at risk`}
          changeType={atRiskOutcomes > 2 ? 'decrease' : 'neutral'}
          icon={<CheckCircle className="w-5 h-5" />}
          description="On track outcomes"
        />
        <MetricCard
          title="KPI Progress"
          value={`${avgKpiProgress.toFixed(0)}%`}
          change="+8% from last month"
          changeType="increase"
          icon={<TrendingUp className="w-5 h-5" />}
          description="Average KPI achievement"
        />
        <MetricCard
          title="2026 Priorities"
          value={`${completedPriorities}/${totalPriorities}`}
          change={`${inProgressPriorities} in progress`}
          changeType="neutral"
          icon={<Clock className="w-5 h-5" />}
          description="Completed priorities"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Strategic Outcomes Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-light text-slb-black">Strategic Outcomes Progress</h2>
              <button className="text-sm font-light text-slb-blue hover:underline">
                View Details
              </button>
            </div>
            <ProgressChart outcomes={chartOutcomes} />
          </div>

          {/* Market Segments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-light text-slb-black">Market Segment Performance</h2>
              <button className="text-sm font-light text-slb-blue hover:underline">
                View All Segments
              </button>
            </div>
            <SegmentChart segments={strategyData.segments} />
          </div>
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Alerts */}
          <AlertsList />

          {/* Priority Timeline */}
          <div className="card">
            <h2 className="text-lg font-light text-slb-black mb-4">2026 Priorities</h2>
            <PriorityTimeline priorities={timelinePriorities} />
          </div>
        </div>
      </div>

      {/* Focus Areas Summary */}
      <div className="card">
        <h2 className="text-lg font-light text-slb-black mb-4">2030 Focus Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategyData.ambition.focusAreas.map((area, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-8 h-8 bg-slb-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Beaker className="w-4 h-4 text-slb-blue" />
              </div>
              <p className="text-sm font-light text-gray-700">{area}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
