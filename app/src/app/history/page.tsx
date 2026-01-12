'use client';

import { useState } from 'react';
import {
  History,
  GitBranch,
  GitCommit,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Tag,
} from 'lucide-react';
import { StrategyVersion, StrategyChange } from '@/types';

// Sample version history data
const versionHistory: StrategyVersion[] = [
  {
    id: 'v3',
    version: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    author: 'Strategic Marketing',
    changeType: 'minor',
    changeSummary: 'Updated 2026 priorities based on Q1 review',
    changes: [
      {
        field: 'priorities.p3.status',
        oldValue: 'pending',
        newValue: 'in-progress',
        reason: 'P&R Summit planning commenced',
      },
      {
        field: 'outcomes.faster-innovation.kpis.kpi-5.current',
        oldValue: 0,
        newValue: 1,
        reason: 'First key technology launched successfully',
      },
    ],
  },
  {
    id: 'v2',
    version: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    author: 'Product Management',
    changeType: 'major',
    changeSummary: 'Revised ambition targets based on market analysis',
    changes: [
      {
        field: 'ambition.revenueTarget',
        oldValue: 1000,
        newValue: 1055,
        reason: 'Adjusted based on Q4 market performance and new opportunities',
      },
      {
        field: 'segments.integrated-solutions.growthRate',
        oldValue: 7.5,
        newValue: 8.5,
        reason: 'Higher growth projected due to digital acceleration',
      },
      {
        field: 'outcomes.digital-core.status',
        oldValue: 'on-track',
        newValue: 'at-risk',
        reason: 'Digital adoption slower than expected in ROW',
      },
    ],
  },
  {
    id: 'v1',
    version: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    author: 'M&T Leadership',
    changeType: 'major',
    changeSummary: 'Initial strategy document created',
    changes: [
      {
        field: 'document',
        oldValue: null,
        newValue: 'Created',
        reason: 'Initial M&T Strategy and Execution Plan established',
      },
    ],
  },
];

const changeTypeConfig = {
  major: { color: 'bg-red-100 text-red-700', label: 'Major' },
  minor: { color: 'bg-yellow-100 text-yellow-700', label: 'Minor' },
  patch: { color: 'bg-green-100 text-green-700', label: 'Patch' },
};

export default function HistoryPage() {
  const [expandedVersion, setExpandedVersion] = useState<string | null>('v3');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-slb-black">Strategy History</h1>
          <p className="text-sm font-light text-gray-500 mt-1">
            Track changes and evolution of your PCT strategy
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-light text-gray-500">
          <GitBranch className="w-4 h-4" />
          <span>Current Version: {versionHistory[0].version}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Version entries */}
        <div className="space-y-6">
          {versionHistory.map((version, index) => (
            <div key={version.id} className="relative pl-16">
              {/* Timeline dot */}
              <div
                className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                  index === 0
                    ? 'bg-slb-blue border-slb-blue'
                    : 'bg-white border-gray-300'
                }`}
              >
                <GitCommit
                  className={`w-3 h-3 absolute top-0.5 left-0.5 ${
                    index === 0 ? 'text-white' : 'text-gray-400'
                  }`}
                />
              </div>

              {/* Version card */}
              <div className="card">
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedVersion(
                      expandedVersion === version.id ? null : version.id
                    )
                  }
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        Version {version.version}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-light rounded-full ${
                          changeTypeConfig[version.changeType].color
                        }`}
                      >
                        {changeTypeConfig[version.changeType].label}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 text-xs font-light bg-slb-blue text-white rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-light text-gray-600 mt-1">
                      {version.changeSummary}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs font-light text-gray-500">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {version.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(version.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        {version.changes.length} changes
                      </span>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    {expandedVersion === version.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Expanded changes */}
                {expandedVersion === version.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-light text-gray-500 mb-3">
                      Changes
                    </h4>
                    <div className="space-y-3">
                      {version.changes.map((change, changeIndex) => (
                        <div
                          key={changeIndex}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <p className="text-xs font-mono text-gray-600">
                            {change.field}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-sm font-light text-red-600 bg-red-50 px-2 py-0.5 rounded">
                              {change.oldValue === null
                                ? 'null'
                                : String(change.oldValue)}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-light text-green-600 bg-green-50 px-2 py-0.5 rounded">
                              {String(change.newValue)}
                            </span>
                          </div>
                          <p className="text-xs font-light text-gray-500 mt-2">
                            Reason: {change.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
