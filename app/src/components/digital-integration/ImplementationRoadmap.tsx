'use client';

import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { digitalIntegrationData } from '@/data/digital-integration';

interface ImplementationRoadmapProps {
  data: typeof digitalIntegrationData;
}

const phaseColors = {
  'foundation': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'acceleration': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  'optimization': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
};

export function ImplementationRoadmap({ data }: ImplementationRoadmapProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'on-track':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'planned':
        return <Calendar className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-slb-black mb-2">Implementation Roadmap</h2>
        <p className="text-sm font-light text-gray-600">
          Timeline and milestones for digital transformation phases
        </p>
      </div>

      {/* Timeline Visualization */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-light text-slb-black mb-6">Transformation Timeline</h3>

        <div className="relative">
          {/* Timeline Bar */}
          <div className="absolute left-0 top-8 w-full h-1 bg-gray-200"></div>

          {/* Phases */}
          <div className="relative flex justify-between">
            {data.roadmap.phases.map((phase, index) => {
              const colors = phaseColors[phase.name.toLowerCase() as keyof typeof phaseColors] || phaseColors.foundation;
              const startYear = new Date(phase.startDate).getFullYear();
              const endYear = new Date(phase.endDate).getFullYear();

              return (
                <div key={phase.name} className="flex-1 px-2 first:pl-0 last:pr-0">
                  <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 mb-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-base font-light ${colors.text}`}>{phase.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-light ${colors.bg} ${colors.text}`}>
                        {phase.status}
                      </span>
                    </div>

                    <p className="text-xs font-light text-gray-600 mb-3">
                      {startYear} - {endYear}
                    </p>

                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-light text-gray-600">Progress</span>
                        <span className="text-xs font-light text-gray-700">{phase.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`${colors.bg.replace('100', '600')} h-1.5 rounded-full transition-all duration-500`}
                          style={{ width: `${phase.completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {phase.focus.slice(0, 3).map((item, i) => (
                        <p key={i} className="text-xs font-light text-gray-700">• {item}</p>
                      ))}
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="flex justify-center">
                    <div className={`w-4 h-4 ${colors.bg.replace('100', '600')} rounded-full border-4 border-white shadow-md`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="card">
        <h3 className="text-lg font-light text-slb-black mb-6">Key Milestones</h3>
        <div className="space-y-3">
          {data.roadmap.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0">
                  {getStatusIcon(milestone.status)}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-light text-slb-black mb-1">{milestone.name}</h4>
                  <p className="text-xs font-light text-gray-600">
                    {data.segments[milestone.segment as keyof typeof data.segments]?.name || 'All Segments'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-light ${
                    milestone.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : milestone.status === 'on-track'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {milestone.status}
                </span>
                <span className="text-sm font-light text-gray-600">
                  {new Date(milestone.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swim Lane Diagram */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-light text-slb-black mb-6">Initiative Swim Lanes</h3>

        <div className="min-w-[800px]">
          {Object.entries(data.segments).map(([key, segment]) => {
            const activeInitiatives = segment.initiatives.filter(i => i.status !== 'completed');

            return (
              <div key={key} className="mb-6 last:mb-0">
                <h4 className="text-sm font-light text-slb-black mb-3">{segment.name}</h4>
                <div className="relative h-20 bg-gray-50 rounded-lg p-3">
                  {activeInitiatives.length > 0 ? (
                    <div className="flex space-x-2 h-full overflow-x-auto">
                      {activeInitiatives.map((initiative) => {
                        const startDate = new Date(initiative.startDate);
                        const endDate = new Date(initiative.endDate);
                        const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                        const elapsed = (new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                        const progress = Math.min(100, Math.max(0, (elapsed / totalDays) * 100));

                        return (
                          <div
                            key={initiative.id}
                            className="flex-shrink-0 bg-slb-blue/80 rounded px-3 py-2 text-white hover:bg-slb-blue transition-colors cursor-pointer group relative"
                            style={{ width: `${Math.max(120, totalDays / 5)}px` }}
                          >
                            <p className="text-xs font-light truncate">{initiative.name}</p>
                            <div className="mt-1 w-full bg-white/20 rounded-full h-1">
                              <div
                                className="bg-white h-1 rounded-full"
                                style={{ width: `${initiative.progress}%` }}
                              ></div>
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-0 hidden group-hover:block bg-gray-900 text-white text-xs font-light px-3 py-2 rounded shadow-lg z-10 whitespace-nowrap">
                              <p className="mb-1">{initiative.name}</p>
                              <p className="text-gray-300">Progress: {initiative.progress}%</p>
                              <p className="text-gray-300">
                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm font-light text-gray-400">
                      No active initiatives
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
