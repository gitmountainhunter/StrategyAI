'use client';

import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { digitalIntegrationData } from '@/data/digital-integration';

interface DigitalMaturityAssessmentProps {
  data: typeof digitalIntegrationData;
}

const maturityDimensions = [
  { key: 'dataAnalytics', label: 'Data Analytics' },
  { key: 'iotIntegration', label: 'IoT Integration' },
  { key: 'automation', label: 'Automation' },
  { key: 'aiMl', label: 'AI/ML' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'skills', label: 'Skills' },
  { key: 'customerInterface', label: 'Customer UX' },
  { key: 'predictiveMaint', label: 'Predictive Maint.' },
];

const segmentColors = {
  offshore: '#3b82f6',
  onshore: '#10b981',
  midstream: '#a855f7',
  recovery: '#f97316',
  integratedSolutions: '#6366f1',
};

export function DigitalMaturityAssessment({ data }: DigitalMaturityAssessmentProps) {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([
    'offshore',
    'onshore',
    'midstream',
    'recovery',
    'integratedSolutions',
  ]);

  const toggleSegment = (segment: string) => {
    setSelectedSegments((prev) =>
      prev.includes(segment) ? prev.filter((s) => s !== segment) : [...prev, segment]
    );
  };

  // Prepare radar chart data
  const radarData = maturityDimensions.map((dim) => {
    const point: any = { dimension: dim.label };
    Object.entries(data.segments).forEach(([key, segment]) => {
      if (selectedSegments.includes(key)) {
        point[segment.name] = segment.maturity[dim.key as keyof typeof segment.maturity];
      }
    });
    return point;
  });

  // Maturity level helper
  const getMaturityLevel = (score: number) => {
    if (score >= 80) return { level: 'Advanced', color: 'bg-green-600', text: 'text-green-600' };
    if (score >= 60) return { level: 'Mature', color: 'bg-blue-600', text: 'text-blue-600' };
    if (score >= 40) return { level: 'Developing', color: 'bg-yellow-600', text: 'text-yellow-600' };
    return { level: 'Emerging', color: 'bg-gray-600', text: 'text-gray-600' };
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-slb-black mb-2">Digital Maturity Assessment</h2>
        <p className="text-sm font-light text-gray-600">
          Comparative analysis of digital capabilities across segments
        </p>
      </div>

      {/* Radar Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-light text-slb-black">Maturity Spider Chart</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.segments).map(([key, segment]) => (
              <button
                key={key}
                onClick={() => toggleSegment(key)}
                className={`px-3 py-1 rounded-lg text-xs font-light transition-all ${
                  selectedSegments.includes(key)
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedSegments.includes(key)
                    ? segmentColors[key as keyof typeof segmentColors]
                    : undefined,
                }}
              >
                {segment.name}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
            {Object.entries(data.segments).map(([key, segment]) => {
              if (selectedSegments.includes(key)) {
                return (
                  <Radar
                    key={key}
                    name={segment.name}
                    dataKey={segment.name}
                    stroke={segmentColors[key as keyof typeof segmentColors]}
                    fill={segmentColors[key as keyof typeof segmentColors]}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                );
              }
              return null;
            })}
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Maturity Heatmap */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-light text-slb-black mb-6">Maturity Heatmap</h3>
        <div className="min-w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Segment</th>
                {maturityDimensions.map((dim) => (
                  <th key={dim.key} className="text-center py-3 px-2 text-xs font-light text-gray-600">
                    {dim.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.segments).map(([key, segment]) => (
                <tr key={key} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: segmentColors[key as keyof typeof segmentColors] }}
                      ></div>
                      <span className="text-sm font-light text-slb-black">{segment.name}</span>
                    </div>
                  </td>
                  {maturityDimensions.map((dim) => {
                    const score = segment.maturity[dim.key as keyof typeof segment.maturity];
                    const maturity = getMaturityLevel(score);
                    return (
                      <td key={dim.key} className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center">
                          <div
                            className={`w-16 h-8 ${maturity.color} rounded flex items-center justify-center cursor-pointer group relative`}
                            title={`${score}% - ${maturity.level}`}
                          >
                            <span className="text-xs font-light text-white">{score}%</span>
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs font-light px-2 py-1 rounded whitespace-nowrap">
                              {maturity.level}
                            </div>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs font-light text-gray-600 mb-3">Maturity Levels:</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-xs font-light text-gray-700">Advanced (&gt;80%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-xs font-light text-gray-700">Mature (60-80%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
              <span className="text-xs font-light text-gray-700">Developing (40-60%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-xs font-light text-gray-700">Emerging (&lt;40%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
