'use client';

import { Segment } from '@/types';
import { TrendingUp } from 'lucide-react';

interface SegmentChartProps {
  segments: Segment[];
}

export function SegmentChart({ segments }: SegmentChartProps) {
  // Find max market size for scaling
  const maxSize = Math.max(...segments.map(s => s.marketSize || 0));

  return (
    <div className="space-y-4">
      {segments.map((segment) => {
        const widthPercent = ((segment.marketSize || 0) / maxSize) * 100;

        return (
          <div key={segment.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-gray-900">{segment.name}</p>
                <p className="text-xs font-light text-gray-500">
                  {segment.products.slice(0, 2).join(', ')}
                  {segment.products.length > 2 && ` +${segment.products.length - 2} more`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-light text-gray-900">
                  ${segment.marketSize || 0}M
                </p>
                {segment.growthRate && (
                  <p className="text-xs font-light text-green-600 flex items-center justify-end">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {segment.growthRate}% CAGR
                  </p>
                )}
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slb-blue rounded-full transition-all duration-500"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
