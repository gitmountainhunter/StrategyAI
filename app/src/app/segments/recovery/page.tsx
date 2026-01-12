'use client';

import {
  FlaskConical,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle,
  Building2,
  Target,
  Zap,
} from 'lucide-react';
import { strategyData } from '@/data/strategy';
import { MetricCard } from '@/components/MetricCard';

export default function RecoverySegmentPage() {
  const segment = strategyData.segments.find(s => s.id === 'recovery');

  if (!segment) {
    return <div>Segment not found</div>;
  }

  const relatedPriorities = strategyData.priorities.filter(p =>
    p.outcome === 'faster-innovation' || p.outcome === 'customer-responsiveness'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slb-blue rounded-xl flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-slb-black">{segment.name}</h1>
            <p className="text-sm font-light text-gray-500 mt-1">
              {segment.description}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-light rounded-full">
          Strategic Priority
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
          change="CAGR - High growth potential"
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
      <div className="card bg-yellow-50 border-yellow-200">
        <div className="flex items-center space-x-3 mb-3">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h3 className="text-sm font-medium text-yellow-700">Strategic Focus: Grow Chemistry Enabled Recovery</h3>
        </div>
        <p className="text-sm font-light text-gray-700">
          Recovery is identified as a key constraint - we are weak on Recovery (P&R) capabilities and support.
          This segment has the highest growth rate at {segment.growthRate}% CAGR. Focus on building EOR polymer capabilities,
          surfactant technologies, and stimulation fluids expertise.
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
                <span className="px-2 py-0.5 text-xs font-light bg-yellow-100 text-yellow-700 rounded-full">
                  Building
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Capability Gaps */}
        <div className="card">
          <h2 className="text-lg font-light text-slb-black mb-4">Capability Development</h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-700">Current Gap</p>
              <p className="text-xs font-light text-red-600 mt-1">
                Weak on Recovery (P&R) capabilities and support
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-700">In Progress</p>
              <p className="text-xs font-light text-yellow-600 mt-1">
                Building Recovery capability within Product Line Management
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-700">Target State</p>
              <p className="text-xs font-light text-green-600 mt-1">
                Leading Production & Recovery with chemistry-enabled solutions
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
