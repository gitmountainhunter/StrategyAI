'use client';

import {
  Beaker,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle,
  Building2,
  Target,
  Puzzle,
  Cpu,
} from 'lucide-react';
import { strategyData } from '@/data/strategy';
import { MetricCard } from '@/components/MetricCard';

export default function IntegratedSegmentPage() {
  const segment = strategyData.segments.find(s => s.id === 'integrated-solutions');

  if (!segment) {
    return <div>Segment not found</div>;
  }

  const relatedPriorities = strategyData.priorities.filter(p =>
    p.outcome === 'market-growth' || p.outcome === 'digital-core'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slb-blue rounded-xl flex items-center justify-center">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-light text-slb-black">{segment.name}</h1>
            <p className="text-sm font-light text-gray-500 mt-1">
              {segment.description}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-slb-blue text-white text-sm font-light rounded-full">
          Core Differentiator
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
          change="CAGR - Highest potential"
          changeType="increase"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          title="Products"
          value={segment.products.length}
          change="Solution packages"
          changeType="neutral"
          icon={<Package className="w-5 h-5" />}
        />
        <MetricCard
          title="Digital Integration"
          value="Core"
          change="PROact DigiTEAMS"
          changeType="increase"
          icon={<Cpu className="w-5 h-5" />}
        />
      </div>

      {/* Strategic Focus */}
      <div className="card bg-slb-blue/5 border-slb-blue/20">
        <div className="flex items-center space-x-3 mb-3">
          <Puzzle className="w-5 h-5 text-slb-blue" />
          <h3 className="text-sm font-medium text-slb-blue">Strategic Focus: Chemistry as Core Differentiator</h3>
        </div>
        <p className="text-sm font-light text-gray-700">
          Integrated Solutions is our highest growth segment at {segment.growthRate}% CAGR. This is where we differentiate SLB
          through end-to-end chemistry solutions, digital monitoring with PROact DigiTEAMS, and performance contracts.
          Key constraint: We&apos;ve had limited success selling integrated solutions - this must change.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solutions */}
        <div className="card">
          <h2 className="text-lg font-light text-slb-black mb-4">Solution Offerings</h2>
          <div className="space-y-3">
            {segment.products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slb-blue/10 rounded-lg flex items-center justify-center">
                    <Puzzle className="w-4 h-4 text-slb-blue" />
                  </div>
                  <span className="text-sm font-light text-gray-900">{product}</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-light bg-slb-blue/10 text-slb-blue rounded-full">
                  Strategic
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="card">
          <h2 className="text-lg font-light text-slb-black mb-4">Value Proposition</h2>
          <div className="space-y-3">
            <div className="p-3 bg-slb-blue/5 rounded-lg">
              <p className="text-sm font-medium text-slb-blue">Complete Field Solutions</p>
              <p className="text-xs font-light text-gray-600 mt-1">
                End-to-end chemistry programs across all product lines
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-700">Digital Monitoring</p>
              <p className="text-xs font-light text-green-600 mt-1">
                PROact DigiTEAMS real-time monitoring and surveillance
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-700">Performance Contracts</p>
              <p className="text-xs font-light text-purple-600 mt-1">
                Outcome-based agreements with shared risk and reward
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-700">Control Tower</p>
              <p className="text-xs font-light text-orange-600 mt-1">
                Centralized monitoring and optimization capabilities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Challenge */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="text-sm font-medium text-yellow-700 mb-2">Key Challenge to Address</h3>
        <p className="text-sm font-light text-gray-700">
          &ldquo;We&apos;ve had limited success selling integrated solutions&rdquo; - This is identified as a root cause constraint.
          2026 priority: Integrated Solutions Selling – skills, tools, mindset development across Q2-Q4.
        </p>
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
