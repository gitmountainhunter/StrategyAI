'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { KPO, FilterState } from '@/types/digital-integration-strategy';

interface KPODashboardProps {
  kpos: KPO[];
  overallScore: number;
  filterState: FilterState;
}

export default function KPODashboard({ kpos, overallScore, filterState }: KPODashboardProps) {
  const [expandedKPO, setExpandedKPO] = useState<string | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-700';
      case 'at-risk': return 'bg-yellow-100 text-yellow-700';
      case 'behind': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Key Performance Objectives (KPO) Dashboard</h2>
        <p className="text-lg font-light text-gray-600">
          Track 6 strategic objectives across 30 key performance indicators
        </p>
      </div>

      {/* Overall Health Score */}
      <div className="card p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">Overall Digital Health Score</h3>
            <p className="text-sm font-light text-gray-600">Aggregate performance across all KPOs</p>
          </div>
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#0014DC"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 56 * (overallScore / 100)} ${2 * Math.PI * 56}`}
                  strokeLinecap="round"
                  transform="rotate(-90 64 64)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-light text-slb-blue">{overallScore}</div>
                  <div className="text-xs font-light text-gray-500">/100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPO Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpos.map((kpo) => (
          <div
            key={kpo.id}
            className={`card overflow-hidden cursor-pointer transition-all duration-300 ${
              expandedKPO === kpo.id ? 'ring-2 ring-slb-blue' : ''
            }`}
            onClick={() => setExpandedKPO(expandedKPO === kpo.id ? null : kpo.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-light text-gray-900 mb-1">{kpo.name}</h3>
                  <p className="text-sm font-light text-gray-600">{kpo.objective}</p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                    expandedKPO === kpo.id ? 'rotate-90' : ''
                  }`}
                />
              </div>

              {/* Score */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-light text-slb-blue">{kpo.overallScore}</div>
                  <div className="text-xs font-light text-gray-500">Overall Score</div>
                </div>
                <span className={`text-xs font-light px-3 py-1 rounded-full ${getStatusColor(kpo.status)}`}>
                  {kpo.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* KPI Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-light">
                  <span className="text-gray-600">KPIs Tracked:</span>
                  <span className="text-gray-900">{kpo.kpis.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-light">
                  <span className="text-gray-600">Owner:</span>
                  <span className="text-gray-900 text-xs">{kpo.owner}</span>
                </div>
              </div>
            </div>

            {/* KPI Progress Indicators */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {kpo.kpis.slice(0, 5).map((kpi) => {
                  const achievement = (kpi.currentValue / kpi.targetValue) * 100;
                  return (
                    <div
                      key={kpi.id}
                      className={`h-2 flex-1 rounded-full ${
                        achievement >= 100 ? 'bg-green-500' :
                        achievement >= 80 ? 'bg-blue-500' :
                        achievement >= 60 ? 'bg-yellow-500' :
                        'bg-red-400'
                      }`}
                      title={kpi.name}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded KPO Detail */}
      {expandedKPO && (
        <div className="card p-6 animate-slide-down">
          {(() => {
            const kpo = kpos.find(k => k.id === expandedKPO);
            if (!kpo) return null;

            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h3 className="text-2xl font-light text-gray-900">{kpo.name}</h3>
                    <p className="text-sm font-light text-gray-600 mt-1">{kpo.objective}</p>
                  </div>
                  <button
                    onClick={() => setExpandedKPO(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* KPI List */}
                <div className="space-y-4">
                  {kpo.kpis.map((kpi) => {
                    const achievement = (kpi.currentValue / kpi.targetValue) * 100;
                    const isSelected = selectedKPI === kpi.id;

                    return (
                      <div
                        key={kpi.id}
                        className={`border border-gray-200 rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-slb-blue bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedKPI(isSelected ? null : kpi.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-light text-gray-900">{kpi.name}</h4>
                              {getTrendIcon(kpi.trend)}
                            </div>
                            <p className="text-sm font-light text-gray-600">{kpi.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-light text-slb-blue">
                              {kpi.currentValue.toFixed(1)} {kpi.unit}
                            </div>
                            <div className="text-xs font-light text-gray-500">
                              Target: {kpi.targetValue} {kpi.unit}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs font-light text-gray-600 mb-1">
                            <span>Achievement</span>
                            <span>{achievement.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                achievement >= 100 ? 'bg-green-500' :
                                achievement >= 80 ? 'bg-blue-500' :
                                achievement >= 60 ? 'bg-yellow-500' :
                                'bg-red-400'
                              }`}
                              style={{ width: `${Math.min(achievement, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center space-x-4 text-xs font-light text-gray-500">
                          <span>Frequency: {kpi.measurementFrequency}</span>
                          <span>•</span>
                          <span>Source: {kpi.dataSource}</span>
                          <span>•</span>
                          <span>Updated: {kpi.lastUpdated}</span>
                        </div>

                        {/* Historical Trend Chart */}
                        {isSelected && kpi.historicalData.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="text-sm font-light text-gray-700 mb-3">Historical Trend</h5>
                            <ResponsiveContainer width="100%" height={200}>
                              <LineChart data={kpi.historicalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip
                                  contentStyle={{ fontSize: 12, fontWeight: 300 }}
                                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#0014DC"
                                  strokeWidth={2}
                                  dot={{ fill: '#0014DC', r: 3 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
