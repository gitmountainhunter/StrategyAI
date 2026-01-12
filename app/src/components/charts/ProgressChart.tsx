'use client';

import { StrategicOutcome } from '@/types';

interface ProgressChartProps {
  outcomes: StrategicOutcome[];
}

export function ProgressChart({ outcomes }: ProgressChartProps) {
  return (
    <div className="space-y-4">
      {outcomes.map((outcome) => {
        // Calculate average progress for the outcome
        const avgProgress = outcome.kpis.length > 0
          ? outcome.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) / outcome.kpis.length
          : 0;

        const statusColors = {
          'on-track': 'bg-green-500',
          'at-risk': 'bg-yellow-500',
          'delayed': 'bg-red-500',
          'completed': 'bg-slb-blue',
        };

        const statusLabels = {
          'on-track': 'On Track',
          'at-risk': 'At Risk',
          'delayed': 'Delayed',
          'completed': 'Completed',
        };

        return (
          <div key={outcome.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-light text-gray-900 truncate">
                  {outcome.title}
                </p>
                <p className="text-xs font-light text-gray-500">
                  Owner: {outcome.owner}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-light text-gray-700">
                  {avgProgress.toFixed(0)}%
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-light rounded-full text-white ${statusColors[outcome.status]}`}
                >
                  {statusLabels[outcome.status]}
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  outcome.status === 'on-track' ? 'bg-slb-blue' :
                  outcome.status === 'at-risk' ? 'bg-yellow-500' :
                  outcome.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(avgProgress, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
