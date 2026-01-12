'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Maximize2, Info } from 'lucide-react';
import { ChartData } from '@/lib/chartDataGenerator';

interface ChatChartProps {
  chartData: ChartData;
  onExport?: () => void;
}

// SLB Brand Colors
const DEFAULT_COLORS = [
  '#0014DC', // SLB Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ef4444', // Red
];

export function ChatChart({ chartData, onExport }: ChatChartProps) {
  const { type, title, description, data, config, insights } = chartData;

  const handleExport = () => {
    // Create a simple export by converting data to CSV
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row).map(val =>
        typeof val === 'string' ? `"${val}"` : val
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden my-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          {description && (
            <p className="text-xs font-light text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
            title="Export data"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4" style={{ height: config?.height || 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart(type, data, config || {})}
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-3.5 h-3.5 text-slb-blue" />
              <span className="text-xs font-medium text-gray-700">Key Insights</span>
            </div>
            <ul className="space-y-1">
              {insights.map((insight, index) => (
                <li key={index} className="text-xs font-light text-gray-600 flex items-start">
                  <span className="text-slb-blue mr-2">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function renderChart(type: string, data: any[], config: any) {
  switch (type) {
    case 'bar':
      return (
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey={config.xAxisKey || 'name'}
            tick={{ fontSize: 10 }}
            width={75}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Progress']}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey={config.yAxisKey || 'progress'} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || config.colors?.[index % config.colors.length] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      );

    case 'line':
      // Get all data keys except the x-axis key
      const lineKeys = Object.keys(data[0] || {}).filter(
        key => key !== config.xAxisKey && key !== 'date'
      );

      return (
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={config.xAxisKey || 'date'} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          {config.showLegend && <Legend wrapperStyle={{ fontSize: 10 }} />}
          {lineKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={config.colors?.[index % config.colors.length] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      );

    case 'pie':
      return (
        <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey={config.yAxisKey || 'share'}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || config.colors?.[index % config.colors.length] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12 }} />
          {config.showLegend && <Legend wrapperStyle={{ fontSize: 10 }} />}
        </PieChart>
      );

    case 'progress':
      // Simple progress bar representation
      return (
        <div className="flex flex-col space-y-3 py-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-light text-gray-700">{item.name}</span>
                <span className="font-medium text-gray-900">{item.progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.progress}%`,
                    backgroundColor: item.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      );

    case 'gauge':
      // Simple gauge representation
      const gaugeData = data[0] || { progress: 0 };
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f0f0f0"
                strokeWidth="8"
              />
              {/* Progress arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#0014DC"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(gaugeData.progress / 100) * 251.2} 251.2`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-light text-gray-900">
                {gaugeData.progress?.toFixed(0) || 0}%
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm font-light text-gray-600">{gaugeData.name || 'Progress'}</p>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Chart type &ldquo;{type}&rdquo; not supported
        </div>
      );
  }
}

export default ChatChart;
