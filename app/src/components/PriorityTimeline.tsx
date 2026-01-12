'use client';

import { Priority } from '@/types';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface PriorityTimelineProps {
  priorities: Priority[];
}

export function PriorityTimeline({ priorities }: PriorityTimelineProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    'in-progress': {
      icon: Clock,
      color: 'text-slb-blue',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    pending: {
      icon: Circle,
      color: 'text-gray-400',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
    },
  };

  return (
    <div className="space-y-3">
      {priorities.map((priority, index) => {
        const config = statusConfig[priority.status];
        const Icon = config.icon;

        return (
          <div
            key={priority.id}
            className={`flex items-start space-x-3 p-3 rounded-lg border ${config.bg} ${config.border}`}
          >
            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-light text-gray-900 line-clamp-2">
                {priority.action}
              </p>
              <p className="text-xs font-light text-gray-500 mt-1">
                {priority.quarter}
              </p>
            </div>
          </div>
        );
      })}

      <button className="w-full text-sm font-light text-slb-blue hover:underline py-2">
        View all priorities
      </button>
    </div>
  );
}
