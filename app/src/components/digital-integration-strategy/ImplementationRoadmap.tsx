'use client';

import type { RoadmapPhase, FilterState } from '@/types/digital-integration-strategy';

interface ImplementationRoadmapProps {
  roadmap: RoadmapPhase[];
  filterState: FilterState;
}

export default function ImplementationRoadmap({ roadmap, filterState }: ImplementationRoadmapProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Implementation Roadmap</h2>
        <p className="text-lg font-light text-gray-600">
          Four-phase digital transformation journey across 2024-2025
        </p>
      </div>

      <div className="space-y-4">
        {roadmap.map((phase, index) => (
          <div key={phase.id} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-light text-gray-900">{phase.name}</h3>
                <p className="text-sm font-light text-gray-600">{phase.quarter}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-light text-slb-blue">{phase.progress}%</div>
                <div className={`text-xs font-light px-2 py-1 rounded ${
                  phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                  phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {phase.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-slb-blue h-2 rounded-full transition-all duration-500"
                style={{ width: `${phase.progress}%` }}
              />
            </div>

            {/* Objectives */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-light text-gray-700 mb-2">Objectives</h4>
                <ul className="text-sm font-light text-gray-600 space-y-1">
                  {phase.objectives.map((obj, i) => (
                    <li key={i}>• {obj}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-light text-gray-700 mb-2">Deliverables</h4>
                <ul className="text-sm font-light text-gray-600 space-y-1">
                  {phase.deliverables.map((del, i) => (
                    <li key={i}>• {del}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Milestones */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-light text-gray-700 mb-3">Key Milestones</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {phase.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-start space-x-2">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      milestone.status === 'completed' ? 'bg-green-500' :
                      milestone.status === 'in-progress' ? 'bg-blue-500' :
                      milestone.status === 'at-risk' ? 'bg-red-500' :
                      'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-light text-gray-900">{milestone.name}</div>
                      <div className="text-xs font-light text-gray-500">{milestone.targetDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
