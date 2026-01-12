'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { ValueBreakdown, DigitalSegment, FilterState } from '@/types/digital-integration-strategy';

interface ValueCreationWaterfallProps {
  valueBreakdown: ValueBreakdown[];
  segments: DigitalSegment[];
  filterState: FilterState;
}

export default function ValueCreationWaterfall({ valueBreakdown, segments, filterState }: ValueCreationWaterfallProps) {
  const totalValue = valueBreakdown.reduce((sum, v) => sum + v.value, 0);

  // Prepare data for waterfall chart
  const chartData = [
    { name: 'Baseline', value: 0, color: '#9CA3AF' },
    ...valueBreakdown.map((vb, idx) => ({
      name: vb.category,
      value: vb.value,
      color: idx === 0 ? '#3B82F6' : idx === 1 ? '#10B981' : '#8B5CF6',
    })),
    { name: 'Total Value', value: totalValue, color: '#0014DC' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Value Creation Waterfall</h2>
        <p className="text-lg font-light text-gray-600">
          Cumulative value delivered through digital transformation initiatives
        </p>
      </div>

      {/* Total Value Card */}
      <div className="card p-8 bg-gradient-to-r from-slb-blue to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-light opacity-90 mb-2">Total Digital Value Creation</div>
            <div className="text-5xl font-light">${totalValue.toFixed(0)}M</div>
          </div>
          <div className="text-right text-sm font-light opacity-90">
            <div>42% Cost Savings</div>
            <div>37% Revenue Growth</div>
            <div>21% Risk Reduction</div>
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="card p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 300 }} />
            <YAxis tick={{ fontSize: 12, fontWeight: 300 }} label={{ value: 'Value ($M)', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={{ fontSize: 12, fontWeight: 300 }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Value Breakdown Details */}
      <div className="grid md:grid-cols-3 gap-6">
        {valueBreakdown.map((vb) => (
          <div key={vb.category} className="card p-6">
            <h3 className="text-lg font-light text-gray-900 mb-2">{vb.category}</h3>
            <div className="text-3xl font-light text-slb-blue mb-2">${vb.value}M</div>
            <p className="text-sm font-light text-gray-600 mb-4">{vb.description}</p>
            <div className="space-y-1">
              {vb.segments.slice(0, 3).map((seg) => {
                const segment = segments.find(s => s.id === seg.segmentId);
                return (
                  <div key={seg.segmentId} className="flex items-center justify-between text-xs font-light">
                    <span className="text-gray-600">{segment?.name.split(' - ')[0]}</span>
                    <span className="text-gray-900">${seg.contribution}M</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
