'use client';

import { ArrowRight, Database, Zap, GitBranch } from 'lucide-react';
import { digitalIntegrationData } from '@/data/digital-integration';

interface CrossSegmentSynergiesProps {
  data: typeof digitalIntegrationData;
}

const synergyTypeIcons = {
  data: Database,
  technology: Zap,
  platform: GitBranch,
  process: ArrowRight,
};

const synergyTypeColors = {
  data: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  technology: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  platform: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  process: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
};

export function CrossSegmentSynergies({ data }: CrossSegmentSynergiesProps) {
  // Group synergies by type
  const synergyByType = data.synergies.reduce((acc, synergy) => {
    if (!acc[synergy.type]) acc[synergy.type] = [];
    acc[synergy.type].push(synergy);
    return acc;
  }, {} as Record<string, typeof data.synergies>);

  // Calculate synergy matrix
  const segmentKeys = Object.keys(data.segments);
  const synergyMatrix: Record<string, Record<string, number>> = {};

  segmentKeys.forEach((from) => {
    synergyMatrix[from] = {};
    segmentKeys.forEach((to) => {
      if (from === to) {
        synergyMatrix[from][to] = -1; // Self
      } else {
        const synergy = data.synergies.find((s) => s.from === from && s.to === to);
        synergyMatrix[from][to] = synergy?.strength || 0;
      }
    });
  });

  const getStrengthColor = (strength: number) => {
    if (strength >= 85) return 'bg-green-600';
    if (strength >= 70) return 'bg-blue-600';
    if (strength >= 50) return 'bg-yellow-600';
    return 'bg-gray-400';
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-slb-black mb-2">Cross-Segment Synergies</h2>
        <p className="text-sm font-light text-gray-600">
          Integration opportunities and data flows between segments
        </p>
      </div>

      {/* Synergies by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(synergyByType).map(([type, synergies]) => {
          const Icon = synergyTypeIcons[type as keyof typeof synergyTypeIcons];
          const colors = synergyTypeColors[type as keyof typeof synergyTypeColors];

          return (
            <div key={type} className={`card ${colors.border} border-2`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <h3 className="text-lg font-light text-slb-black capitalize">{type} Synergies</h3>
                  <p className="text-xs font-light text-gray-600">{synergies.length} connections</p>
                </div>
              </div>

              <div className="space-y-2">
                {synergies.slice(0, 3).map((synergy, index) => {
                  const fromSegment = data.segments[synergy.from as keyof typeof data.segments];
                  const toSegment = data.segments[synergy.to as keyof typeof data.segments];

                  return (
                    <div key={index} className={`${colors.bg} rounded-lg p-3`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className={`font-light ${colors.text}`}>{fromSegment.name}</span>
                          <ArrowRight className={`w-4 h-4 ${colors.text}`} />
                          <span className={`font-light ${colors.text}`}>{toSegment.name}</span>
                        </div>
                        <span className={`text-xs font-light ${colors.text}`}>{synergy.strength}%</span>
                      </div>
                      <p className="text-xs font-light text-gray-700">{synergy.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Synergy Network Visualization */}
      <div className="card">
        <h3 className="text-lg font-light text-slb-black mb-6">Integration Network Map</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {Object.entries(data.segments).map(([key, segment]) => {
            const connections = data.synergies.filter((s) => s.from === key || s.to === key);
            const avgStrength =
              connections.reduce((sum, s) => sum + s.strength, 0) / connections.length || 0;

            return (
              <div key={key} className="text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slb-blue to-primary-400 rounded-full flex items-center justify-center mb-3 shadow-lg hover:scale-105 transition-transform">
                  <div className="text-white text-center">
                    <p className="text-xs font-light">{segment.name}</p>
                    <p className="text-2xl font-light">{connections.length}</p>
                    <p className="text-xs font-light opacity-80">links</p>
                  </div>
                </div>
                <div className="text-xs font-light text-gray-600">
                  Avg Strength: {avgStrength.toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Key Synergies List */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-light text-slb-black mb-4">Strongest Synergies</h4>
          <div className="space-y-2">
            {data.synergies
              .sort((a, b) => b.strength - a.strength)
              .slice(0, 5)
              .map((synergy, index) => {
                const fromSegment = data.segments[synergy.from as keyof typeof data.segments];
                const toSegment = data.segments[synergy.to as keyof typeof data.segments];

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-2 h-2 rounded-full ${getStrengthColor(synergy.strength)}`}></div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-light text-gray-700">{fromSegment.name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-light text-gray-700">{toSegment.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-light text-gray-600 capitalize">{synergy.type}</span>
                      <span className="text-sm font-light text-slb-black">{synergy.strength}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Synergy Matrix */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-light text-slb-black mb-6">Synergy Strength Matrix</h3>

        <div className="min-w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-light text-gray-600">From / To</th>
                {segmentKeys.map((key) => (
                  <th key={key} className="text-center py-3 px-2 text-xs font-light text-gray-600">
                    {data.segments[key as keyof typeof data.segments].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {segmentKeys.map((fromKey) => (
                <tr key={fromKey} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-light text-slb-black">
                    {data.segments[fromKey as keyof typeof data.segments].name}
                  </td>
                  {segmentKeys.map((toKey) => {
                    const strength = synergyMatrix[fromKey][toKey];
                    const isSelf = strength === -1;

                    return (
                      <td key={toKey} className="py-3 px-2 text-center">
                        {isSelf ? (
                          <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center mx-auto">
                            <span className="text-xs font-light text-gray-500">-</span>
                          </div>
                        ) : strength > 0 ? (
                          <div
                            className={`w-16 h-8 ${getStrengthColor(strength)} rounded flex items-center justify-center mx-auto cursor-pointer group relative`}
                          >
                            <span className="text-xs font-light text-white">{strength}%</span>

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs font-light px-3 py-2 rounded shadow-lg z-10 whitespace-nowrap">
                              {data.synergies.find((s) => s.from === fromKey && s.to === toKey)?.description}
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-8 bg-gray-100 rounded flex items-center justify-center mx-auto">
                            <span className="text-xs font-light text-gray-400">0%</span>
                          </div>
                        )}
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
          <p className="text-xs font-light text-gray-600 mb-3">Synergy Strength:</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-xs font-light text-gray-700">Strong (≥85%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-xs font-light text-gray-700">Good (70-85%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
              <span className="text-xs font-light text-gray-700">Moderate (50-70%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-xs font-light text-gray-700">Weak (&lt;50%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
