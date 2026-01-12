'use client';

import { useState } from 'react';
import type { MaturityAssessment, DigitalSegment, FilterState } from '@/types/digital-integration-strategy';

interface MaturityAssessmentMatrixProps {
  assessments: MaturityAssessment[];
  segments: DigitalSegment[];
  filterState: FilterState;
}

// Heat map color generator
const getHeatMapColor = (score: number): string => {
  if (score >= 4.5) return 'bg-green-500 text-white';
  if (score >= 3.5) return 'bg-green-400 text-white';
  if (score >= 2.5) return 'bg-yellow-400 text-gray-900';
  if (score >= 1.5) return 'bg-orange-400 text-white';
  return 'bg-red-400 text-white';
};

const getMaturityLevel = (score: number): string => {
  if (score >= 4) return 'Advanced';
  if (score >= 3) return 'Mature';
  if (score >= 2) return 'Developing';
  return 'Emerging';
};

export default function MaturityAssessmentMatrix({
  assessments,
  segments,
  filterState,
}: MaturityAssessmentMatrixProps) {
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);

  // Get all unique capabilities
  const allCapabilities = Array.from(
    new Set(assessments.flatMap((a) => a.capabilities.map((c) => c.capability)))
  );

  // Filter assessments based on selected segments
  const filteredAssessments =
    filterState.selectedSegments.length > 0
      ? assessments.filter((a) => filterState.selectedSegments.includes(a.segmentId))
      : assessments;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Digital Maturity Assessment</h2>
        <p className="text-lg font-light text-gray-600">
          Capability scores across all segments with improvement plans and priorities
        </p>
      </div>

      {/* Maturity Legend */}
      <div className="card p-6">
        <h3 className="text-lg font-light text-gray-900 mb-4">Maturity Levels</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded"></div>
            <div>
              <div className="text-sm font-light text-gray-900">Advanced</div>
              <div className="text-xs font-light text-gray-500">Score 4-5</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded"></div>
            <div>
              <div className="text-sm font-light text-gray-900">Mature</div>
              <div className="text-xs font-light text-gray-500">Score 3-4</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-400 rounded"></div>
            <div>
              <div className="text-sm font-light text-gray-900">Developing</div>
              <div className="text-xs font-light text-gray-500">Score 2-3</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-400 rounded"></div>
            <div>
              <div className="text-sm font-light text-gray-900">Emerging</div>
              <div className="text-xs font-light text-gray-500">Score 1-2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Heat Map Matrix */}
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-light text-gray-700 sticky left-0 bg-white z-10">
                Capability
              </th>
              {filteredAssessments.map((assessment) => {
                const segment = segments.find((s) => s.id === assessment.segmentId);
                return (
                  <th
                    key={assessment.segmentId}
                    className="text-center p-4 font-light text-gray-700 min-w-[120px]"
                  >
                    <div className="text-sm">{segment?.name.split(' - ')[0]}</div>
                    {segment?.name.includes(' - ') && (
                      <div className="text-xs text-gray-500">{segment?.name.split(' - ')[1]}</div>
                    )}
                    <div className="text-xs text-slb-blue font-normal mt-1">
                      {assessment.overallScore}/100
                    </div>
                  </th>
                );
              })}
              <th className="text-center p-4 font-light text-gray-700 min-w-[100px]">Average</th>
            </tr>
          </thead>
          <tbody>
            {allCapabilities.map((capability) => {
              // Calculate average score for this capability
              const scores = filteredAssessments
                .map((a) => a.capabilities.find((c) => c.capability === capability)?.score || 0)
                .filter((s) => s > 0);
              const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

              return (
                <tr
                  key={capability}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    selectedCapability === capability ? 'bg-blue-50' : ''
                  }`}
                  onClick={() =>
                    setSelectedCapability(selectedCapability === capability ? null : capability)
                  }
                >
                  <td className="p-4 font-light text-gray-900 sticky left-0 bg-white z-10 cursor-pointer">
                    {capability}
                  </td>
                  {filteredAssessments.map((assessment) => {
                    const capabilityData = assessment.capabilities.find(
                      (c) => c.capability === capability
                    );
                    return (
                      <td key={`${assessment.segmentId}-${capability}`} className="p-2">
                        <div
                          className={`${getHeatMapColor(
                            capabilityData?.score || 0
                          )} rounded p-2 text-center font-light cursor-pointer hover:scale-105 transition-transform`}
                          title={capabilityData?.evidence || 'No data'}
                        >
                          {capabilityData?.score || '-'}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-2">
                    <div className="text-center font-light text-gray-700">
                      {avgScore.toFixed(1)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Capability Details */}
      {selectedCapability && (
        <div className="card p-6 animate-slide-down">
          <h3 className="text-xl font-light text-gray-900 mb-4">
            {selectedCapability} - Detailed Assessment
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredAssessments.map((assessment) => {
              const segment = segments.find((s) => s.id === assessment.segmentId);
              const capabilityData = assessment.capabilities.find(
                (c) => c.capability === selectedCapability
              );

              if (!capabilityData) return null;

              return (
                <div key={assessment.segmentId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-light text-gray-900">{segment?.name}</h4>
                    <span
                      className={`text-xs font-light px-2 py-1 rounded ${getHeatMapColor(
                        capabilityData.score
                      )}`}
                    >
                      {capabilityData.score}/5 - {getMaturityLevel(capabilityData.score)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm font-light">
                    <div>
                      <span className="text-gray-600">Evidence:</span>
                      <p className="text-gray-900 mt-1">{capabilityData.evidence}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Improvement Plan:</span>
                      <p className="text-gray-900 mt-1">{capabilityData.improvementPlan}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-gray-600">Priority:</span>
                      <span
                        className={`text-xs font-light px-2 py-1 rounded ${
                          capabilityData.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : capabilityData.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {capabilityData.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overall Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">Highest Maturity</div>
          <div className="text-2xl font-light text-gray-900 mb-1">
            {
              segments.find(
                (s) =>
                  s.id ===
                  filteredAssessments.reduce((prev, current) =>
                    prev.overallScore > current.overallScore ? prev : current
                  ).segmentId
              )?.name
            }
          </div>
          <div className="text-sm font-light text-green-600">
            {
              filteredAssessments.reduce((prev, current) =>
                prev.overallScore > current.overallScore ? prev : current
              ).overallScore
            }
            /100
          </div>
        </div>

        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">Average Maturity</div>
          <div className="text-2xl font-light text-gray-900 mb-1">
            {(
              filteredAssessments.reduce((sum, a) => sum + a.overallScore, 0) /
              filteredAssessments.length
            ).toFixed(0)}
            /100
          </div>
          <div className="text-sm font-light text-gray-500">Across all segments</div>
        </div>

        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">High Priority Items</div>
          <div className="text-2xl font-light text-gray-900 mb-1">
            {
              filteredAssessments.flatMap((a) => a.capabilities).filter((c) => c.priority === 'high')
                .length
            }
          </div>
          <div className="text-sm font-light text-red-600">Require immediate attention</div>
        </div>
      </div>
    </div>
  );
}
