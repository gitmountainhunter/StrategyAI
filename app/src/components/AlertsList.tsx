'use client';

import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

// Sample alerts - in production, these would come from the database
const sampleAlerts = [
  {
    id: '1',
    type: 'warning' as const,
    title: 'Customer Response Time Declining',
    message: 'Response time increased to 48h, target is 24h',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'New Competitor Activity',
    message: 'Baker Hughes announced new sustainable chemistry line',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
  },
  {
    id: '3',
    type: 'success' as const,
    title: 'Q1 Priority Completed',
    message: 'OGSM alignment successfully operationalized',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];

export function AlertsList() {
  const alertConfig = {
    info: {
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    error: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-light text-slb-black">Recent Alerts</h2>
        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-light rounded-full">
          {sampleAlerts.filter(a => !a.read).length} new
        </span>
      </div>

      <div className="space-y-3">
        {sampleAlerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`flex items-start space-x-3 p-3 rounded-lg ${config.bg} ${
                !alert.read ? 'ring-1 ring-inset ring-gray-200' : ''
              }`}
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light text-gray-900">{alert.title}</p>
                <p className="text-xs font-light text-gray-600 mt-0.5">
                  {alert.message}
                </p>
                <p className="text-xs font-light text-gray-400 mt-1">
                  {formatTime(alert.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full text-sm font-light text-slb-blue hover:underline py-2 mt-2">
        View all alerts
      </button>
    </div>
  );
}
