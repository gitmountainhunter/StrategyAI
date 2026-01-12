'use client';

import { Activity, TrendingUp, CheckCircle2, Target } from 'lucide-react';
import { digitalIntegrationData } from '@/data/digital-integration';

interface ExecutiveOverviewProps {
  data: typeof digitalIntegrationData;
}

export function ExecutiveOverview({ data }: ExecutiveOverviewProps) {
  const healthColor = data.overallHealth >= 75
    ? 'text-green-600'
    : data.overallHealth >= 50
    ? 'text-yellow-600'
    : 'text-red-600';

  const healthBgColor = data.overallHealth >= 75
    ? 'bg-green-100'
    : data.overallHealth >= 50
    ? 'bg-yellow-100'
    : 'bg-red-100';

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-slb-black mb-2">Executive Overview</h2>
        <p className="text-sm font-light text-gray-600">
          Strategic snapshot of digital transformation across all market segments
        </p>
      </div>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Digital Initiatives */}
        <div className="card group hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-slb-blue" />
                </div>
              </div>
              <p className="text-sm font-light text-gray-600 mb-1">Total Digital Initiatives</p>
              <p className="text-3xl font-light text-slb-black">{data.totalInitiatives}</p>
              <p className="text-xs font-light text-gray-500 mt-1">Active projects</p>
            </div>
          </div>
        </div>

        {/* Segments Under Transformation */}
        <div className="card group hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-light text-gray-600 mb-1">Segments Transformed</p>
              <p className="text-3xl font-light text-slb-black">{data.segmentsTransformed}/5</p>
              <p className="text-xs font-light text-green-600 mt-1">100% coverage</p>
            </div>
          </div>
        </div>

        {/* Projected Efficiency Gain */}
        <div className="card group hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-light text-gray-600 mb-1">Efficiency Improvement</p>
              <p className="text-3xl font-light text-slb-black">{data.projectedEfficiency}%</p>
              <p className="text-xs font-light text-blue-600 mt-1">Year over year</p>
            </div>
          </div>
        </div>

        {/* Investment Priority Score */}
        <div className="card group hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-sm font-light text-gray-600 mb-1">Investment Priority</p>
              <p className="text-3xl font-light text-slb-black">{data.investmentPriority}/100</p>
              <p className="text-xs font-light text-purple-600 mt-1">Strategic alignment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Health Pulse */}
      <div className="card">
        <h3 className="text-lg font-light text-slb-black mb-4">Strategy Health Pulse</h3>
        <div className="flex items-center justify-center py-8">
          <div className="relative">
            {/* Animated pulse rings */}
            <div className={`absolute inset-0 ${healthBgColor} rounded-full animate-ping opacity-20`}></div>
            <div className={`absolute inset-0 ${healthBgColor} rounded-full animate-pulse opacity-30`}></div>

            {/* Main gauge */}
            <div className={`relative w-48 h-48 ${healthBgColor} rounded-full flex items-center justify-center`}>
              <div className="text-center">
                <div className={`text-5xl font-light ${healthColor} mb-2`}>
                  {data.overallHealth}%
                </div>
                <div className="text-sm font-light text-gray-600">
                  {data.overallHealth >= 75 ? 'Excellent' : data.overallHealth >= 50 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-light text-slb-black">
              {Object.keys(data.segments).length}
            </p>
            <p className="text-xs font-light text-gray-600 mt-1">Segments Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-slb-black">
              ${data.impactMetrics.annualValueCreated}M
            </p>
            <p className="text-xs font-light text-gray-600 mt-1">Annual Value</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-slb-black">
              {data.impactMetrics.overallROI}%
            </p>
            <p className="text-xs font-light text-gray-600 mt-1">Overall ROI</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-light text-slb-black">
              {data.synergies.length}
            </p>
            <p className="text-xs font-light text-gray-600 mt-1">Cross-Segment Links</p>
          </div>
        </div>
      </div>
    </section>
  );
}
