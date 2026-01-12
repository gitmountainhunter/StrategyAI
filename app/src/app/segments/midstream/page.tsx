'use client';

import {
  Layers,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle,
  Building2,
  Target,
  GitBranch,
} from 'lucide-react';
import { strategyData } from '@/data/strategy';
import { MetricCard } from '@/components/MetricCard';

export default function MidstreamSegmentPage() {
  const segment = strategyData.segments.find(s => s.id === 'midstream');

  if (!segment) {
    return <div>Segment not found</div>;
  }

  const relatedPriorities = strategyData.priorities.filter(p =>
    p.outcome === 'market-growth' || p.outcome === 'simpler-workflows'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slb-blue rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-slb-black">{segment.name}</h1>
            <p className="text-sm font-light text-gray-500 mt-1">
              {segment.description}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-light rounded-full">
          Fastest Growing
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
          change="CAGR - Highest growth"
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

      {/* Strategic Focus */}
      <div className="card bg-slb-blue/5 border-slb-blue/20">
        <div className="flex items-center space-x-3 mb-3">
          <GitBranch className="w-5 h-5 text-slb-blue" />
          <h3 className="text-sm font-medium text-slb-blue">Strategic Focus: Grow & Transform Midstream</h3>
        </div>
        <p className="text-sm font-light text-gray-700">
          Midstream represents our highest growth opportunity at {segment.growthRate}% CAGR. Focus on pipeline flow assurance,
          gas processing and treatment, and midstream water management. Key to capturing integrated solutions value.
        </p>
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

        {/* Market Opportunities */}
        <div className="card">
          <h2 className="text-lg font-light text-slb-black mb-4">Market Opportunities</h2>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-700">Pipeline Flow Assurance</p>
              <p className="text-xs font-light text-green-600 mt-1">
                Growing demand for drag reducers and corrosion inhibitors
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-700">Gas Processing</p>
              <p className="text-xs font-light text-blue-600 mt-1">
                Increasing LNG and gas treatment needs globally
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-700">Water Management</p>
              <p className="text-xs font-light text-purple-600 mt-1">
                Environmental compliance driving treatment demand
              </p>
            </div>
          </div>
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
