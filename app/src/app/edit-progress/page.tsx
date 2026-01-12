'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  DollarSign,
  Loader2,
  LineChart,
} from 'lucide-react';
import { strategyData } from '@/data/strategy';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface EditableOutcome {
  id: string;
  title: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  owner: string;
  notes: string;
  lastUpdated: string;
}

interface EditableKPI {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
}

interface EditablePriority {
  id: string;
  action: string;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
}

interface HistoryEntry {
  date: string;
  outcomes: { [key: string]: number };
  revenue: number;
  priorities_completed: number;
}

export default function EditProgressPage() {
  // Initialize editable outcomes from strategy data
  const [outcomes, setOutcomes] = useState<EditableOutcome[]>(
    strategyData.strategicOutcomes.map((o) => {
      const avgProgress = o.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) / o.kpis.length;
      return {
        id: o.id,
        title: o.title,
        progress: Math.round(avgProgress),
        status: o.status,
        owner: o.owner,
        notes: '',
        lastUpdated: new Date().toISOString().split('T')[0],
      };
    })
  );

  // Revenue tracking
  const [actualRevenue, setActualRevenue] = useState(785);
  const targetRevenue = strategyData.ambition.revenueTarget;

  // Priorities
  const [priorities, setPriorities] = useState<EditablePriority[]>(
    strategyData.priorities.slice(0, 10).map((p) => ({
      id: p.id,
      action: p.action,
      progress: p.status === 'completed' ? 100 : p.status === 'in-progress' ? 50 : 0,
      status: p.status,
    }))
  );

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load data from local files on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/data?type=all');
        if (response.ok) {
          const data = await response.json();

          if (data.outcomes?.outcomes) {
            setOutcomes(data.outcomes.outcomes.map((o: any) => ({
              id: o.id,
              title: o.name,
              progress: o.progress_percentage,
              status: o.status,
              owner: o.owner || '',
              notes: o.notes || '',
              lastUpdated: o.last_updated?.split('T')[0] || new Date().toISOString().split('T')[0],
            })));
          }

          if (data.revenue?.targets?.[0]) {
            setActualRevenue(data.revenue.targets[0].actual_amount);
          }

          if (data.priorities?.priorities) {
            setPriorities(data.priorities.priorities.map((p: any) => ({
              id: p.id,
              action: p.name,
              progress: p.completion_percentage,
              status: p.status === 'completed' ? 'completed' : p.status === 'in-progress' ? 'in-progress' : 'pending',
            })));
          }

          if (data.history?.history) {
            setHistory(data.history.history);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleOutcomeChange = (id: string, field: keyof EditableOutcome, value: any) => {
    setOutcomes((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, [field]: value, lastUpdated: new Date().toISOString().split('T')[0] }
          : o
      )
    );
  };

  const handlePriorityChange = (id: string, field: keyof EditablePriority, value: any) => {
    setPriorities((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Save outcomes
      const outcomesData = {
        outcomes: outcomes.map((o) => ({
          id: o.id,
          name: o.title,
          progress_percentage: o.progress,
          status: o.status,
          owner: o.owner,
          last_updated: new Date().toISOString(),
          notes: o.notes,
        })),
      };

      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'outcomes', data: outcomesData }),
      });

      // Save revenue
      const revenueData = {
        targets: [{
          id: '2030-target',
          target_year: 2030,
          target_amount: targetRevenue,
          actual_amount: actualRevenue,
          progress_percentage: (actualRevenue / targetRevenue) * 100,
          last_updated: new Date().toISOString(),
        }],
      };

      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'revenue', data: revenueData }),
      });

      // Save priorities
      const prioritiesData = {
        priorities: priorities.map((p) => ({
          id: p.id,
          name: p.action,
          completion_percentage: p.progress,
          status: p.status,
          due_date: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        })),
      };

      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'priorities', data: prioritiesData }),
      });

      setSaveMessage('All changes saved successfully to local storage!');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveMessage('Failed to save changes. Please try again.');
    }

    setIsSaving(false);
  };

  const statusOptions = [
    { value: 'on-track', label: 'On Track', color: 'bg-green-100 text-green-700' },
    { value: 'at-risk', label: 'At Risk', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'delayed', label: 'Delayed', color: 'bg-red-100 text-red-700' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-700' },
  ];

  const priorityStatusOptions = [
    { value: 'pending', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-slb-black">Edit Progress</h1>
          <p className="text-sm font-light text-gray-500 mt-1">
            Update strategic outcomes, KPIs, and priority progress
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-light text-green-700">{saveMessage}</span>
        </div>
      )}

      {/* Revenue Target Section */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="w-5 h-5 text-slb-blue" />
          <h2 className="text-lg font-light text-slb-black">2030 Revenue Target</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-light text-gray-500 mb-2">
              Actual Revenue ($M)
            </label>
            <input
              type="number"
              value={actualRevenue}
              onChange={(e) => setActualRevenue(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-gray-500 mb-2">
              Target Revenue ($M)
            </label>
            <input
              type="number"
              value={targetRevenue}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-light bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-gray-500 mb-2">
              Progress
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slb-blue rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((actualRevenue / targetRevenue) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-light text-gray-700 w-12">
                {((actualRevenue / targetRevenue) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Outcomes Section */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-5 h-5 text-slb-blue" />
          <h2 className="text-lg font-light text-slb-black">Strategic Outcomes</h2>
        </div>

        <div className="space-y-4">
          {outcomes.map((outcome) => (
            <div key={outcome.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Title */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-light text-gray-500 mb-2">
                    Outcome
                  </label>
                  <p className="text-sm font-medium text-gray-900">{outcome.title}</p>
                </div>

                {/* Progress */}
                <div>
                  <label className="block text-sm font-light text-gray-500 mb-2">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={outcome.progress}
                    onChange={(e) =>
                      handleOutcomeChange(outcome.id, 'progress', Math.min(100, Math.max(0, Number(e.target.value))))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-light text-gray-500 mb-2">
                    Status
                  </label>
                  <select
                    value={outcome.status}
                    onChange={(e) =>
                      handleOutcomeChange(outcome.id, 'status', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Owner */}
              <div className="mt-3">
                <label className="block text-sm font-light text-gray-500 mb-2">
                  Owner
                </label>
                <input
                  type="text"
                  value={outcome.owner}
                  onChange={(e) =>
                    handleOutcomeChange(outcome.id, 'owner', e.target.value)
                  }
                  placeholder="Enter owner name..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue"
                />
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      outcome.status === 'on-track' ? 'bg-slb-blue' :
                      outcome.status === 'at-risk' ? 'bg-yellow-500' :
                      outcome.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${outcome.progress}%` }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mt-3">
                <textarea
                  placeholder="Add notes..."
                  value={outcome.notes}
                  onChange={(e) =>
                    handleOutcomeChange(outcome.id, 'notes', e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue resize-none"
                />
              </div>

              <p className="text-xs font-light text-gray-400 mt-2">
                Last updated: {outcome.lastUpdated}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2026 Priorities Section */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-5 h-5 text-slb-blue" />
          <h2 className="text-lg font-light text-slb-black">2026 Priorities</h2>
        </div>

        <div className="space-y-3">
          {priorities.map((priority) => (
            <div key={priority.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-center">
                {/* Action */}
                <div className="lg:col-span-2">
                  <p className="text-sm font-light text-gray-900 line-clamp-2">
                    {priority.action}
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={priority.progress}
                    onChange={(e) =>
                      handlePriorityChange(priority.id, 'progress', Math.min(100, Math.max(0, Number(e.target.value))))
                    }
                    className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue"
                    placeholder="Progress %"
                  />
                </div>

                {/* Status */}
                <div>
                  <select
                    value={priority.status}
                    onChange={(e) =>
                      handlePriorityChange(priority.id, 'status', e.target.value)
                    }
                    className="w-full px-3 py-1.5 border border-gray-200 rounded text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue"
                  >
                    {priorityStatusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    priority.status === 'completed' ? 'bg-green-500' :
                    priority.status === 'in-progress' ? 'bg-slb-blue' : 'bg-gray-300'
                  }`}
                  style={{ width: `${priority.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Performance Trends Section */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <LineChart className="w-5 h-5 text-slb-blue" />
          <h2 className="text-lg font-light text-slb-black">KPI Performance Trends</h2>
          <span className="text-xs font-light text-gray-500">(Last 3 months)</span>
        </div>

        {history.length > 0 ? (
          <div className="space-y-6">
            {/* Revenue Trend */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Revenue Progress</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={history.map(h => ({
                    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short' }),
                    revenue: h.revenue
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                    <Tooltip
                      formatter={(value: number) => [`$${value}M`, 'Revenue']}
                      labelStyle={{ fontWeight: 500 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0014DC"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#0014DC' }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Outcomes Trends */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Strategic Outcomes Progress</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={history.map(h => ({
                    date: new Date(h.date).toLocaleDateString('en-US', { month: 'short' }),
                    'Strategy in Action': h.outcomes['strategy-action'] || 0,
                    'Faster Innovation': h.outcomes['faster-innovation'] || 0,
                    'Simpler Workflows': h.outcomes['simpler-workflows'] || 0,
                    'Customer First': h.outcomes['customer-responsiveness'] || 0,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, '']}
                      labelStyle={{ fontWeight: 500 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="Strategy in Action" stroke="#0014DC" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Faster Innovation" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Simpler Workflows" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="Customer First" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-light text-slb-blue">
                  {history.length > 1
                    ? `+$${history[history.length - 1].revenue - history[0].revenue}M`
                    : '$0M'}
                </p>
                <p className="text-xs font-light text-gray-500">Revenue Change</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-green-600">
                  {history.length > 0
                    ? history.reduce((sum, h) => sum + h.priorities_completed, 0)
                    : 0}
                </p>
                <p className="text-xs font-light text-gray-500">Priorities Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-purple-600">
                  {history.length > 1
                    ? `+${Math.round(
                        ((Object.values(history[history.length - 1].outcomes).reduce((a, b) => a + b, 0) /
                          Object.keys(history[history.length - 1].outcomes).length) -
                         (Object.values(history[0].outcomes).reduce((a, b) => a + b, 0) /
                          Object.keys(history[0].outcomes).length))
                      )}%`
                    : '0%'}
                </p>
                <p className="text-xs font-light text-gray-500">Avg. Outcome Improvement</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <LineChart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-light text-gray-500">
              No historical data available
            </p>
            <p className="text-xs font-light text-gray-400 mt-1">
              Trend data will appear here as you update progress
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
