'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis, Cell } from 'recharts';
import type { InvestmentAnalysis, DigitalSegment, FilterState } from '@/types/digital-integration-strategy';

interface InvestmentReturnScatterProps {
  investments: InvestmentAnalysis[];
  segments: DigitalSegment[];
  filterState: FilterState;
}

const importanceColors = {
  critical: '#DC2626',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#9CA3AF',
};

export default function InvestmentReturnScatter({ investments, segments, filterState }: InvestmentReturnScatterProps) {
  // Transform data for scatter plot
  const chartData = investments.map(inv => ({
    ...inv,
    x: inv.investment,
    y: inv.returnValue,
    z: inv.roi,
    color: importanceColors[inv.strategicImportance],
  }));

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.investment, 0);
  const totalReturn = investments.reduce((sum, inv) => sum + inv.returnValue, 0);
  const avgROI = investments.reduce((sum, inv) => sum + inv.roi, 0) / investments.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Investment vs. Return Analysis</h2>
        <p className="text-lg font-light text-gray-600">
          Strategic importance and ROI across digital initiatives
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">Total Investment</div>
          <div className="text-3xl font-light text-gray-900">${totalInvestment.toFixed(1)}M</div>
        </div>
        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">Total Return</div>
          <div className="text-3xl font-light text-green-600">${totalReturn.toFixed(1)}M</div>
        </div>
        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">Average ROI</div>
          <div className="text-3xl font-light text-slb-blue">{avgROI.toFixed(0)}%</div>
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-light text-gray-900 mb-2">Investment vs. Return Value</h3>
          <p className="text-sm font-light text-gray-600">Color indicates strategic importance</p>
        </div>

        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              dataKey="x"
              name="Investment"
              label={{ value: 'Investment ($M)', position: 'insideBottom', offset: -10, style: { fontSize: 12, fontWeight: 300 } }}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Return"
              label={{ value: 'Return Value ($M)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fontWeight: 300 } }}
              tick={{ fontSize: 10 }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} name="ROI %" />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                      <div className="font-light text-gray-900 mb-2">{data.initiative}</div>
                      <div className="text-sm font-light text-gray-600 space-y-1">
                        <div>Investment: ${data.investment.toFixed(1)}M</div>
                        <div>Return: ${data.returnValue.toFixed(1)}M</div>
                        <div>ROI: {data.roi}%</div>
                        <div>Payback: {data.paybackPeriod} months</div>
                        <div className="pt-2 border-t border-gray-200">
                          <span className={`text-xs px-2 py-1 rounded ${
                            data.strategicImportance === 'critical' ? 'bg-red-100 text-red-700' :
                            data.strategicImportance === 'high' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {data.strategicImportance.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Investments" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm font-light">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="text-gray-600">Critical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-600">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span className="text-gray-600">Low</span>
          </div>
        </div>
      </div>

      {/* Investment List */}
      <div className="grid md:grid-cols-2 gap-4">
        {investments.map((inv) => {
          const segment = segments.find(s => s.id === inv.segmentId);
          return (
            <div key={inv.initiative} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-light text-gray-900 mb-1">{inv.initiative}</h4>
                  <p className="text-sm font-light text-gray-500">{segment?.name}</p>
                </div>
                <span className={`text-xs font-light px-2 py-1 rounded ${
                  inv.status === 'optimized' ? 'bg-green-100 text-green-700' :
                  inv.status === 'deployed' ? 'bg-blue-100 text-blue-700' :
                  inv.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {inv.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-sm font-light">
                <div>
                  <div className="text-gray-600 text-xs mb-1">ROI</div>
                  <div className="text-slb-blue">{inv.roi}%</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs mb-1">Investment</div>
                  <div className="text-gray-900">${inv.investment.toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs mb-1">Payback</div>
                  <div className="text-gray-900">{inv.paybackPeriod}mo</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
