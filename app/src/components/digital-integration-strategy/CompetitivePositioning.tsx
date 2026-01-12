'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import type { CompetitorDigitalPosition, DigitalSegment, FilterState } from '@/types/digital-integration-strategy';

interface CompetitivePositioningProps {
  competitors: CompetitorDigitalPosition[];
  segments: DigitalSegment[];
  filterState: FilterState;
}

export default function CompetitivePositioning({ competitors, segments, filterState }: CompetitivePositioningProps) {
  // Transform data for scatter plot
  const chartData = competitors.map(comp => ({
    ...comp,
    x: comp.digitalMaturity,
    y: comp.segmentCoverage,
    z: comp.marketShare * 100, // Scale for bubble size
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Competitive Digital Positioning</h2>
        <p className="text-lg font-light text-gray-600">
          Digital maturity vs. market segment coverage for 18 tracked competitors
        </p>
      </div>

      {/* Scatter Plot */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-light text-gray-900 mb-2">Digital Maturity vs. Segment Coverage</h3>
          <p className="text-sm font-light text-gray-600">Bubble size represents market share</p>
        </div>

        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              dataKey="x"
              name="Digital Maturity"
              domain={[0, 100]}
              label={{ value: 'Digital Maturity Score', position: 'insideBottom', offset: -10, style: { fontSize: 12, fontWeight: 300 } }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Segment Coverage"
              domain={[0, 100]}
              label={{ value: 'Segment Coverage %', angle: -90, position: 'insideLeft', style: { fontSize: 12, fontWeight: 300 } }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Market Share" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                      <div className="font-light text-gray-900 mb-2">{data.name}</div>
                      <div className="text-sm font-light text-gray-600 space-y-1">
                        <div>Digital Maturity: {data.digitalMaturity}/100</div>
                        <div>Segment Coverage: {data.segmentCoverage}%</div>
                        <div>Market Share: {data.marketShare}%</div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter name="Competitors" data={chartData} fill="#0014DC" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Competitor List */}
      <div className="grid md:grid-cols-2 gap-4">
        {competitors.slice(0, 6).map((comp) => (
          <div key={comp.competitorId} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-light text-gray-900">{comp.name}</h4>
                <p className="text-sm font-light text-gray-500">{comp.marketShare}% market share</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-light text-slb-blue">{comp.digitalMaturity}/100</div>
                <div className="text-xs font-light text-gray-500">maturity</div>
              </div>
            </div>
            <div className="text-xs font-light text-gray-600">
              <span className="text-green-600">Strengths:</span> {comp.strengths[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
