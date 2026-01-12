'use client';

import { useState } from 'react';
import { Droplets, Factory, Layers, FlaskConical, Beaker, ChevronRight, X } from 'lucide-react';
import { digitalIntegrationData } from '@/data/digital-integration';

interface SegmentIntegrationHubProps {
  data: typeof digitalIntegrationData;
  selectedSegment: string | null;
  onSelectSegment: (segment: string | null) => void;
}

const segmentIcons = {
  offshore: Droplets,
  onshore: Factory,
  midstream: Layers,
  recovery: FlaskConical,
  integratedSolutions: Beaker,
};

const segmentColors = {
  offshore: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
    progress: 'bg-blue-600',
  },
  onshore: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: 'text-green-600',
    iconBg: 'bg-green-100',
    progress: 'bg-green-600',
  },
  midstream: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: 'text-purple-600',
    iconBg: 'bg-purple-100',
    progress: 'bg-purple-600',
  },
  recovery: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: 'text-orange-600',
    iconBg: 'bg-orange-100',
    progress: 'bg-orange-600',
  },
  integratedSolutions: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    icon: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
    progress: 'bg-indigo-600',
  },
};

export function SegmentIntegrationHub({
  data,
  selectedSegment,
  onSelectSegment,
}: SegmentIntegrationHubProps) {
  const segments = Object.entries(data.segments);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-slb-black mb-2">Segment Integration Hub</h2>
        <p className="text-sm font-light text-gray-600">
          Digital transformation status across all market segments
        </p>
      </div>

      {/* Segment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map(([key, segment]) => {
          const Icon = segmentIcons[key as keyof typeof segmentIcons];
          const colors = segmentColors[key as keyof typeof segmentColors];
          const activeInitiatives = segment.initiatives.filter(i => i.status === 'active').length;

          return (
            <div
              key={key}
              className={`card ${colors.border} border-2 hover:shadow-xl transition-all cursor-pointer group`}
              onClick={() => onSelectSegment(key)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-slb-blue transition-colors" />
              </div>

              <h3 className="text-xl font-light text-slb-black mb-2">{segment.name}</h3>

              {/* Digital Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-light text-gray-600">Digital Score</span>
                  <span className={`text-lg font-light ${colors.text}`}>{segment.digitalScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${colors.progress} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${segment.digitalScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Initiative */}
              <div className={`${colors.bg} rounded-lg p-3 mb-3`}>
                <p className="text-xs font-light text-gray-600 mb-1">Key Initiative</p>
                <p className={`text-sm font-light ${colors.text}`}>
                  {segment.initiatives[0]?.name || 'No active initiatives'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-light text-slb-black">{activeInitiatives}</p>
                  <p className="text-xs font-light text-gray-500">Active</p>
                </div>
                <div>
                  <p className="text-lg font-light text-slb-black">{segment.roi}%</p>
                  <p className="text-xs font-light text-gray-500">ROI</p>
                </div>
                <div>
                  <p className="text-lg font-light text-slb-black">{segment.technologies.filter(t => t.status === 'full').length}</p>
                  <p className="text-xs font-light text-gray-500">Tech</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Core Visualization */}
      <div className="card">
        <h3 className="text-lg font-light text-slb-black mb-6">Digital Integration Network</h3>
        <div className="relative py-12">
          {/* Center Digital Core */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-32 h-32 bg-gradient-to-br from-slb-blue to-primary-400 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <div className="text-center">
                <div className="text-white text-sm font-light mb-1">DIGITAL</div>
                <div className="text-white text-xs font-light opacity-80">CORE</div>
              </div>
            </div>
          </div>

          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {segments.map(([key], index) => {
              const angle = (index * 360) / segments.length - 90;
              const radius = 140;
              const x1 = '50%';
              const y1 = '50%';
              const x2 = `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`;
              const y2 = `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`;

              return (
                <line
                  key={key}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              );
            })}
          </svg>

          {/* Segment Nodes positioned in circle */}
          <div className="relative h-96">
            {segments.map(([key, segment], index) => {
              const Icon = segmentIcons[key as keyof typeof segmentIcons];
              const colors = segmentColors[key as keyof typeof segmentColors];
              const angle = (index * 360) / segments.length - 90;
              const radius = 140;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

              return (
                <div
                  key={key}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <div
                    className={`${colors.iconBg} ${colors.border} border-2 w-20 h-20 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                    onClick={() => onSelectSegment(key)}
                  >
                    <Icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs font-light text-gray-700">{segment.name}</p>
                    <p className={`text-xs font-light ${colors.text}`}>{segment.digitalScore}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Segment Detail Modal */}
      {selectedSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-light text-slb-black">
                {data.segments[selectedSegment as keyof typeof data.segments].name} - Digital Strategy
              </h2>
              <button
                onClick={() => onSelectSegment(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Initiatives */}
              <div>
                <h3 className="text-lg font-light text-slb-black mb-4">Digital Initiatives</h3>
                <div className="space-y-3">
                  {data.segments[selectedSegment as keyof typeof data.segments].initiatives.map((initiative) => (
                    <div key={initiative.id} className="card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-base font-light text-slb-black mb-1">{initiative.name}</h4>
                          <p className="text-sm font-light text-gray-600">{initiative.description}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-light ${
                            initiative.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : initiative.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {initiative.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-light text-gray-600">Progress</span>
                          <span className="text-sm font-light text-slb-black">{initiative.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-slb-blue h-2 rounded-full transition-all duration-500"
                            style={{ width: `${initiative.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 font-light mb-1">Efficiency Gain</p>
                          <p className="text-slb-black font-light">+{initiative.impact.efficiency}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-light mb-1">Cost Savings</p>
                          <p className="text-slb-black font-light">${initiative.impact.costSavings}M</p>
                        </div>
                        <div>
                          <p className="text-gray-600 font-light mb-1">Safety Improvement</p>
                          <p className="text-slb-black font-light">+{initiative.impact.safety}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
