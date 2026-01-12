'use client';

import { useMemo } from 'react';
import type { IntelligenceItem } from '@/types/intelligence';
import { Activity } from 'lucide-react';

interface CompetitorActivityHeatmapProps {
  intelligence: IntelligenceItem[];
}

interface HeatmapCell {
  competitor: string;
  segment: string;
  count: number;
  intensity: number; // 0-100
}

export function CompetitorActivityHeatmap({ intelligence }: CompetitorActivityHeatmapProps) {
  const { heatmapData, competitors, segments, maxCount } = useMemo(() => {
    // Extract competitor names from source data
    const competitorSet = new Set<string>();
    const segmentSet = new Set<string>();
    const activityMap = new Map<string, number>();

    intelligence.forEach(item => {
      const competitor = item.source.name;
      const segment = item.segment;

      competitorSet.add(competitor);
      segmentSet.add(segment);

      const key = `${competitor}|${segment}`;
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    });

    const competitors = Array.from(competitorSet).sort();
    const segments = Array.from(segmentSet).sort();

    // Find max count for normalization
    let maxCount = 0;
    activityMap.forEach(count => {
      if (count > maxCount) maxCount = count;
    });

    // Build heatmap data
    const heatmapData: HeatmapCell[] = [];
    competitors.forEach(competitor => {
      segments.forEach(segment => {
        const key = `${competitor}|${segment}`;
        const count = activityMap.get(key) || 0;
        const intensity = maxCount > 0 ? (count / maxCount) * 100 : 0;

        heatmapData.push({
          competitor,
          segment,
          count,
          intensity
        });
      });
    });

    return { heatmapData, competitors, segments, maxCount };
  }, [intelligence]);

  const getIntensityColor = (intensity: number): string => {
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 20) return 'bg-blue-200';
    if (intensity < 40) return 'bg-blue-300';
    if (intensity < 60) return 'bg-blue-400';
    if (intensity < 80) return 'bg-blue-500';
    return 'bg-blue-600';
  };

  const getIntensityTextColor = (intensity: number): string => {
    if (intensity < 60) return 'text-gray-800';
    return 'text-white';
  };

  const segmentLabels: Record<string, string> = {
    offshore: 'Offshore',
    onshore: 'Onshore',
    midstream: 'Midstream',
    recovery: 'Recovery',
    integratedSolutions: 'Integrated',
    general: 'General'
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center">
          <Activity className="w-5 h-5 text-slb-blue" />
        </div>
        <div>
          <h3 className="text-xl font-light text-slb-black">Competitor Activity Heatmap</h3>
          <p className="text-sm font-light text-gray-600">
            Intelligence volume by competitor and market segment
          </p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Column Headers */}
          <div className="flex">
            <div className="w-40 flex-shrink-0"></div>
            {segments.map(segment => (
              <div
                key={segment}
                className="w-24 flex-shrink-0 text-center py-2 px-1"
              >
                <span className="text-xs font-light text-gray-700">
                  {segmentLabels[segment] || segment}
                </span>
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          {competitors.map(competitor => (
            <div key={competitor} className="flex border-t border-gray-200">
              {/* Row Header */}
              <div className="w-40 flex-shrink-0 py-3 px-2 flex items-center">
                <span className="text-xs font-light text-gray-800 truncate">
                  {competitor}
                </span>
              </div>

              {/* Cells */}
              {segments.map(segment => {
                const cell = heatmapData.find(
                  c => c.competitor === competitor && c.segment === segment
                );
                const intensity = cell?.intensity || 0;
                const count = cell?.count || 0;

                return (
                  <div
                    key={`${competitor}-${segment}`}
                    className="w-24 flex-shrink-0 p-1"
                  >
                    <div
                      className={`
                        ${getIntensityColor(intensity)}
                        ${getIntensityTextColor(intensity)}
                        rounded h-12 flex items-center justify-center
                        transition-all hover:scale-105 hover:shadow-md cursor-pointer
                      `}
                      title={`${competitor} - ${segmentLabels[segment] || segment}: ${count} items`}
                    >
                      <span className="text-xs font-light">
                        {count > 0 ? count : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-light text-gray-600">Activity Level:</span>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-light text-gray-600">Low</span>
            <div className="flex space-x-1">
              <div className="w-6 h-6 bg-gray-100 rounded"></div>
              <div className="w-6 h-6 bg-blue-200 rounded"></div>
              <div className="w-6 h-6 bg-blue-300 rounded"></div>
              <div className="w-6 h-6 bg-blue-400 rounded"></div>
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
            <span className="text-xs font-light text-gray-600">High</span>
          </div>
        </div>
        <div className="mt-2 text-xs font-light text-gray-500 text-center">
          Hover over cells for details • Max activity: {maxCount} items
        </div>
      </div>
    </div>
  );
}
