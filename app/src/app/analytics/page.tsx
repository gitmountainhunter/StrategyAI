'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  LineChart,
  Download,
  Calendar,
} from 'lucide-react';
import { strategyData } from '@/data/strategy';
import { RechartsWrapper } from '@/components/charts/RechartsWrapper';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('quarter');

  // Prepare data for charts
  const segmentData = strategyData.segments.map(s => ({
    name: s.name,
    marketSize: s.marketSize || 0,
    growthRate: s.growthRate || 0,
  }));

  const outcomeData = strategyData.strategicOutcomes.map(o => {
    const progress = o.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) / o.kpis.length;
    return {
      name: o.title.split(' ').slice(0, 3).join(' '),
      progress: Math.round(progress),
      target: 100,
    };
  });

  const priorityStatusData = [
    { name: 'Completed', value: strategyData.priorities.filter(p => p.status === 'completed').length, color: '#10B981' },
    { name: 'In Progress', value: strategyData.priorities.filter(p => p.status === 'in-progress').length, color: '#0014DC' },
    { name: 'Pending', value: strategyData.priorities.filter(p => p.status === 'pending').length, color: '#9CA3AF' },
  ];

  const kpiTrendData = [
    { month: 'Jan', performance: 45, target: 60 },
    { month: 'Feb', performance: 52, target: 62 },
    { month: 'Mar', performance: 58, target: 65 },
    { month: 'Apr', performance: 62, target: 68 },
    { month: 'May', performance: 68, target: 70 },
    { month: 'Jun', performance: 72, target: 72 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-slb-black">Analytics</h1>
          <p className="text-sm font-light text-gray-500 mt-1">
            Strategy performance metrics and market analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm font-light border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slb-blue"
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Segment Sizes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light text-slb-black">Market Segment Sizes ($M)</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <RechartsWrapper
            type="bar"
            data={segmentData}
            dataKey="marketSize"
            xAxisKey="name"
            height={300}
            color="#0014DC"
          />
        </div>

        {/* Strategic Outcomes Progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light text-slb-black">Strategic Outcomes Progress</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <RechartsWrapper
            type="bar"
            data={outcomeData}
            dataKey="progress"
            xAxisKey="name"
            height={300}
            color="#0014DC"
            horizontal
          />
        </div>

        {/* Priority Status Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light text-slb-black">2026 Priority Status</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <RechartsWrapper
            type="pie"
            data={priorityStatusData}
            dataKey="value"
            nameKey="name"
            height={300}
          />
        </div>

        {/* KPI Performance Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-light text-slb-black">KPI Performance Trend</h2>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <RechartsWrapper
            type="line"
            data={kpiTrendData}
            dataKey="performance"
            secondaryDataKey="target"
            xAxisKey="month"
            height={300}
            color="#0014DC"
            secondaryColor="#9CA3AF"
          />
        </div>
      </div>

      {/* Growth Rates Table */}
      <div className="card">
        <h2 className="text-lg font-light text-slb-black mb-4">Segment Growth Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-sm font-light text-gray-500 pb-3">Segment</th>
                <th className="text-right text-sm font-light text-gray-500 pb-3">Market Size</th>
                <th className="text-right text-sm font-light text-gray-500 pb-3">Growth Rate</th>
                <th className="text-right text-sm font-light text-gray-500 pb-3">2030 Projection</th>
                <th className="text-right text-sm font-light text-gray-500 pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {strategyData.segments.map((segment) => {
                const projection = (segment.marketSize || 0) * Math.pow(1 + (segment.growthRate || 0) / 100, 6);
                return (
                  <tr key={segment.id} className="border-b border-gray-50">
                    <td className="py-3 text-sm font-light text-gray-900">{segment.name}</td>
                    <td className="py-3 text-sm font-light text-gray-700 text-right">
                      ${segment.marketSize}M
                    </td>
                    <td className="py-3 text-sm font-light text-right">
                      <span className="text-green-600">{segment.growthRate}%</span>
                    </td>
                    <td className="py-3 text-sm font-light text-gray-700 text-right">
                      ${projection.toFixed(0)}M
                    </td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 text-xs font-light bg-green-100 text-green-700 rounded-full">
                        Growing
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
