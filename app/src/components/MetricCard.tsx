'use client';

import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: ReactNode;
  description?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
}: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-light text-gray-500">{title}</p>
          <p className="text-2xl font-light text-slb-black mt-1">{value}</p>
        </div>
        {icon && (
          <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center text-slb-blue">
            {icon}
          </div>
        )}
      </div>

      {(change || description) && (
        <div className="mt-3 flex items-center space-x-2">
          {change && (
            <span
              className={`inline-flex items-center text-xs font-light ${
                changeType === 'increase'
                  ? 'text-green-600'
                  : changeType === 'decrease'
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {changeType === 'increase' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
              {changeType === 'decrease' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {changeType === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
              {change}
            </span>
          )}
          {description && !change && (
            <span className="text-xs font-light text-gray-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
