'use client';

import type { RiskAssessment, FilterState } from '@/types/digital-integration-strategy';

interface RiskMitigationMatrixProps {
  riskAssessments: RiskAssessment[];
  filterState: FilterState;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-400 text-gray-900';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-300 text-gray-900';
  }
};

export default function RiskMitigationMatrix({ riskAssessments, filterState }: RiskMitigationMatrixProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Risk Mitigation Matrix</h2>
        <p className="text-lg font-light text-gray-600">
          Risk assessment and digital mitigation strategies across key risk categories
        </p>
      </div>

      {/* Risk Matrix Grid */}
      <div className="card p-6">
        <h3 className="text-lg font-light text-gray-900 mb-4">Probability vs. Impact Matrix</h3>
        <div className="relative" style={{ height: '400px' }}>
          {/* Grid Background */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1">
            {Array.from({ length: 25 }).map((_, i) => {
              const row = Math.floor(i / 5);
              const col = i % 5;
              const intensity = (row + col) / 8;
              return (
                <div
                  key={i}
                  className={`border border-gray-200 ${
                    intensity > 0.75 ? 'bg-red-100' :
                    intensity > 0.5 ? 'bg-orange-100' :
                    intensity > 0.25 ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}
                />
              );
            })}
          </div>

          {/* Axis Labels */}
          <div className="absolute -left-16 top-0 bottom-0 flex flex-col justify-around text-xs font-light text-gray-600">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          <div className="absolute left-0 right-0 -bottom-8 flex justify-around text-xs font-light text-gray-600">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>

          {/* Risk Bubbles */}
          {riskAssessments.map((risk, idx) => {
            const x = (risk.impact / 100) * 100;
            const y = 100 - (risk.probability / 100) * 100;
            return (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-light cursor-pointer hover:scale-110 transition-transform ${getRiskColor(risk.riskLevel)}`}
                  title={risk.category}
                >
                  {risk.category.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="text-sm font-light text-gray-600 text-center">
            <span className="font-light text-gray-900">X-Axis:</span> Impact •{' '}
            <span className="font-light text-gray-900">Y-Axis:</span> Probability
          </div>
        </div>
      </div>

      {/* Risk Details */}
      <div className="space-y-4">
        {riskAssessments.map((risk) => (
          <div key={risk.category} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-light text-gray-900">{risk.category}</h3>
                <div className="flex items-center space-x-3 mt-2 text-sm font-light text-gray-600">
                  <span>Probability: {risk.probability}%</span>
                  <span>•</span>
                  <span>Impact: {risk.impact}%</span>
                </div>
              </div>
              <span className={`text-xs font-light px-3 py-1 rounded-full ${getRiskColor(risk.riskLevel)}`}>
                {risk.riskLevel.toUpperCase()}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-light text-gray-700 mb-2">Mitigation Strategy</h4>
                <p className="text-sm font-light text-gray-600">{risk.mitigationStrategy}</p>
              </div>
              <div>
                <h4 className="text-sm font-light text-gray-700 mb-2">Digital Mitigation Role</h4>
                <p className="text-sm font-light text-gray-600">{risk.digitalMitigationRole}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className={`text-xs font-light px-2 py-1 rounded ${
                risk.status === 'mitigated' ? 'bg-green-100 text-green-700' :
                risk.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                Status: {risk.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
