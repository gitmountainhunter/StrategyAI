'use client';

import { useState } from 'react';
import { ChevronRight, Droplets, Factory, Layers, FlaskConical, Beaker, Network } from 'lucide-react';
import type { DigitalSegment, FilterState, SegmentId } from '@/types/digital-integration-strategy';

interface DigitalFrameworkHubProps {
  segments: DigitalSegment[];
  filterState: FilterState;
  onSegmentToggle: (segmentId: SegmentId) => void;
}

// Segment icon mapping
const segmentIcons: Record<SegmentId, any> = {
  'onshore-unconventional': Droplets,
  'onshore-conventional': Factory,
  'offshore': Layers,
  'recovery': FlaskConical,
  'midstream': Beaker,
  'integrated-solutions': Network,
};

// Segment colors
const segmentColors: Record<SegmentId, { bg: string; border: string; text: string; light: string }> = {
  'onshore-unconventional': {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-600',
    light: 'bg-blue-50',
  },
  'onshore-conventional': {
    bg: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-green-600',
    light: 'bg-green-50',
  },
  'offshore': {
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    text: 'text-purple-600',
    light: 'bg-purple-50',
  },
  'recovery': {
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    text: 'text-orange-600',
    light: 'bg-orange-50',
  },
  'midstream': {
    bg: 'bg-yellow-500',
    border: 'border-yellow-500',
    text: 'text-yellow-600',
    light: 'bg-yellow-50',
  },
  'integrated-solutions': {
    bg: 'bg-slb-blue',
    border: 'border-slb-blue',
    text: 'text-slb-blue',
    light: 'bg-blue-50',
  },
};

export default function DigitalFrameworkHub({ segments, filterState, onSegmentToggle }: DigitalFrameworkHubProps) {
  const [expandedSegment, setExpandedSegment] = useState<SegmentId | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<SegmentId | null>(null);

  // Calculate positions for segments in a circular layout
  const centerX = 400;
  const centerY = 300;
  const radius = 200;
  const angleStep = (2 * Math.PI) / segments.length;

  const segmentPositions = segments.map((segment, index) => {
    const angle = angleStep * index - Math.PI / 2; // Start from top
    return {
      segment,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle,
    };
  });

  const handleSegmentClick = (segmentId: SegmentId) => {
    setExpandedSegment(expandedSegment === segmentId ? null : segmentId);
    onSegmentToggle(segmentId);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Digital Integration Framework</h2>
        <p className="text-lg font-light text-gray-600">
          Interactive hub-and-spoke model showing how digital technologies enable competitive advantage across all market segments
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Hub-and-Spoke Diagram */}
        <div className="card p-6">
          <h3 className="text-xl font-light text-gray-900 mb-4">Digital Core Platform</h3>

          <svg
            viewBox="0 0 800 600"
            className="w-full h-auto"
            style={{ maxHeight: '500px' }}
          >
            {/* Connection lines */}
            {segmentPositions.map(({ segment, x, y }) => (
              <line
                key={`line-${segment.id}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={hoveredSegment === segment.id ? '#0014DC' : '#E5E7EB'}
                strokeWidth={hoveredSegment === segment.id ? 3 : 2}
                className="transition-all duration-300"
              />
            ))}

            {/* Central hub */}
            <g>
              <circle
                cx={centerX}
                cy={centerY}
                r={60}
                fill="#0014DC"
                className="drop-shadow-lg"
              />
              <text
                x={centerX}
                y={centerY - 10}
                textAnchor="middle"
                fill="white"
                className="text-sm font-light"
              >
                Digital Core
              </text>
              <text
                x={centerX}
                y={centerY + 10}
                textAnchor="middle"
                fill="white"
                className="text-xs font-light"
              >
                Platform
              </text>
            </g>

            {/* Segment nodes */}
            {segmentPositions.map(({ segment, x, y, angle }) => {
              const Icon = segmentIcons[segment.id];
              const colors = segmentColors[segment.id];
              const isSelected = filterState.selectedSegments.includes(segment.id);
              const isHovered = hoveredSegment === segment.id;

              return (
                <g
                  key={segment.id}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onClick={() => handleSegmentClick(segment.id)}
                  className="cursor-pointer"
                >
                  {/* Outer glow when selected */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={55}
                      fill="#0014DC"
                      opacity="0.1"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={45}
                    fill="white"
                    stroke={isHovered || isSelected ? '#0014DC' : '#E5E7EB'}
                    strokeWidth={isHovered || isSelected ? 3 : 2}
                    className="transition-all duration-300 drop-shadow-md"
                  />

                  {/* Score indicator */}
                  <circle
                    cx={x}
                    cy={y}
                    r={35}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={35}
                    fill="none"
                    stroke="#0014DC"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 35 * (segment.maturityScore / 100)} ${2 * Math.PI * 35}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${x} ${y})`}
                    className="transition-all duration-500"
                  />

                  {/* Maturity score text */}
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill="#0014DC"
                    className="text-lg font-light"
                  >
                    {segment.maturityScore}
                  </text>

                  {/* Segment label */}
                  <text
                    x={x}
                    y={y + 70}
                    textAnchor="middle"
                    fill="#374151"
                    className="text-xs font-light"
                    style={{ maxWidth: '100px' }}
                  >
                    {segment.name.split(' - ')[0]}
                  </text>
                  {segment.name.includes(' - ') && (
                    <text
                      x={x}
                      y={y + 85}
                      textAnchor="middle"
                      fill="#6B7280"
                      className="text-xs font-light"
                    >
                      {segment.name.split(' - ')[1]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-light text-gray-700 mb-3">Digital Core Capabilities</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-light text-gray-600">
              <div>• Real-time Market Intelligence</div>
              <div>• Predictive Analytics Engine</div>
              <div>• Competitive Monitoring System</div>
              <div>• Customer Insights Aggregation</div>
            </div>
          </div>
        </div>

        {/* Right: Segment Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-light text-gray-900 mb-4">Segment Details</h3>

          {segments.map((segment) => {
            const Icon = segmentIcons[segment.id];
            const colors = segmentColors[segment.id];
            const isExpanded = expandedSegment === segment.id;
            const isSelected = filterState.selectedSegments.includes(segment.id);

            return (
              <div
                key={segment.id}
                className={`card transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-slb-blue' : ''
                }`}
              >
                {/* Segment Header */}
                <button
                  onClick={() => handleSegmentClick(segment.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${colors.light} p-2 rounded-lg`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-light text-gray-900">{segment.name}</div>
                      <div className="text-sm font-light text-gray-500">
                        ${(segment.marketSize / 1000).toFixed(1)}B Market
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-light text-gray-600">
                        Maturity: {segment.maturityScore}/100
                      </div>
                      <div className="text-xs font-light text-gray-500">
                        {segment.digitalEnablers.filter(e => e.implementationStatus === 'deployed' || e.implementationStatus === 'optimized').length}/
                        {segment.digitalEnablers.length} deployed
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 animate-slide-down">
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-light text-gray-700 mb-2">Digital Enablers</h4>
                      <div className="space-y-2">
                        {segment.digitalEnablers.map((enabler) => (
                          <div
                            key={enabler.id}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <div
                              className={`mt-1 w-2 h-2 rounded-full ${
                                enabler.implementationStatus === 'optimized'
                                  ? 'bg-green-500'
                                  : enabler.implementationStatus === 'deployed'
                                  ? 'bg-blue-500'
                                  : enabler.implementationStatus === 'in-progress'
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                            <div className="flex-1">
                              <div className="font-light text-gray-900">{enabler.name}</div>
                              <div className="text-xs font-light text-gray-500">
                                {enabler.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-light text-gray-700 mb-2">Key Applications</h4>
                      <div className="flex flex-wrap gap-2">
                        {segment.keyApplications.map((app) => (
                          <span
                            key={app}
                            className="text-xs font-light px-2 py-1 bg-gray-100 text-gray-700 rounded"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
