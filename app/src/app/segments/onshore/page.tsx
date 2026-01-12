'use client';

import {
  Factory,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  Building2,
  Target,
} from 'lucide-react';
import { strategyData } from '@/data/strategy';
import { MetricCard } from '@/components/MetricCard';

export default function OnshoreSegmentPage() {
  const segment = strategyData.segments.find(s => s.id === 'onshore');

  if (!segment) {
    return <div>Segment not found</div>;
  }

  // Find related outcomes and priorities
  const relatedPriorities = strategyData.priorities.filter(p =>
    p.outcome === 'strategy-action' || p.outcome === 'customer-responsiveness'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slb-blue rounded-xl flex items-center justify-center">
            <Factory className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-slb-black">{segment.name}</h1>
            <p className="text-sm font-light text-gray-500 mt-1">
              {segment.description}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-light rounded-full">
          Active Segment
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Market Size"
          value={`$${segment.marketSize}M`}
          change="Current addressable market"
          changeType="neutral"
          icon={<Target className="w-5 h-5" />}
        />
        <MetricCard
          title="Growth Rate"
          value={`${segment.growthRate}%`}
          change="CAGR"
          changeType="increase"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          title="Products"
          value={segment.products.length}
          change="Product lines"
          changeType="neutral"
          icon={<Package className="w-5 h-5" />}
        />
        <MetricCard
          title="Competitors"
          value={segment.competitors?.length || 0}
          change="Key competitors tracked"
          changeType="neutral"
          icon={<Building2 className="w-5 h-5" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products */}
        <div className="card">
          <h2 className="text-lg font-light text-slb-black mb-4">Product Portfolio</h2>
          <div className="space-y-3">
            {segment.products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slb-blue/10 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-slb-blue" />
                  </div>
                  <span className="text-sm font-light text-gray-900">{product}</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-light bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Competitors */}
        <div className="card">
          <h2 className="text-lg font-light text-slb-black mb-4">Competitive Landscape</h2>
          {segment.competitors && segment.competitors.length > 0 ? (
            <div className="space-y-4">
              {segment.competitors.map((competitor) => (
                <div key={competitor.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {competitor.name}
                      </span>
                    </div>
                    <span className="text-sm font-light text-gray-600">
                      {competitor.marketShare}% share
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-light text-gray-500 mb-1">Strengths</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.strengths.slice(0, 3).map((strength, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs font-light bg-green-50 text-green-700 rounded"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-light text-gray-500 mb-1">Weaknesses</p>
                      <div className="flex flex-wrap gap-1">
                        {competitor.weaknesses.slice(0, 2).map((weakness, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs font-light bg-red-50 text-red-700 rounded"
                          >
                            {weakness}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-light text-gray-500">
              No competitors data available for this segment
            </p>
          )}
        </div>
      </div>

      {/* Related Priorities */}
      <div className="card">
        <h2 className="text-lg font-light text-slb-black mb-4">Related 2026 Priorities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {relatedPriorities.slice(0, 6).map((priority) => {
            const statusConfig = {
              completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
              'in-progress': { icon: TrendingUp, color: 'text-slb-blue', bg: 'bg-blue-50' },
              pending: { icon: AlertTriangle, color: 'text-gray-400', bg: 'bg-gray-50' },
            };
            const config = statusConfig[priority.status];
            const Icon = config.icon;

            return (
              <div
                key={priority.id}
                className={`flex items-start space-x-3 p-3 rounded-lg ${config.bg}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light text-gray-900 line-clamp-2">
                    {priority.action}
                  </p>
                  <p className="text-xs font-light text-gray-500 mt-1">
                    {priority.quarter}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
