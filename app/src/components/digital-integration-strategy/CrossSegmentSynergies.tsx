'use client';

import type { SynergyConnection, DigitalSegment, FilterState } from '@/types/digital-integration-strategy';

interface CrossSegmentSynergiesProps {
  synergies: SynergyConnection[];
  segments: DigitalSegment[];
  filterState: FilterState;
}

export default function CrossSegmentSynergies({ synergies, segments, filterState }: CrossSegmentSynergiesProps) {
  const totalValue = synergies.reduce((sum, syn) => sum + syn.value, 0);
  const realizedValue = synergies.filter(s => s.status === 'realized').reduce((sum, syn) => sum + syn.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-gray-900 mb-2">Cross-Segment Synergies</h2>
        <p className="text-lg font-light text-gray-600">
          Value flow and technology transfer opportunities between market segments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">Total Synergy Value</div>
          <div className="text-3xl font-light text-gray-900">${totalValue.toFixed(1)}M</div>
        </div>
        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">Realized Value</div>
          <div className="text-3xl font-light text-green-600">${realizedValue.toFixed(1)}M</div>
        </div>
        <div className="card p-6">
          <div className="text-sm font-light text-gray-600 mb-2">Synergy Connections</div>
          <div className="text-3xl font-light text-slb-blue">{synergies.length}</div>
        </div>
      </div>

      {/* Synergy List */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-light text-gray-900">Synergy Details</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {synergies.map((synergy) => {
            const sourceSegment = segments.find(s => s.id === synergy.sourceSegment);
            const targetSegment = segments.find(s => s.id === synergy.targetSegment);

            return (
              <div key={synergy.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-light text-gray-900">{sourceSegment?.name}</span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm font-light text-gray-900">{targetSegment?.name}</span>
                    </div>
                    <p className="text-sm font-light text-gray-600">{synergy.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-light text-slb-blue">${synergy.value.toFixed(1)}M</div>
                    <span className={`text-xs font-light px-2 py-1 rounded ${
                      synergy.status === 'realized' ? 'bg-green-100 text-green-700' :
                      synergy.status === 'validated' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {synergy.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs font-light text-gray-500">
                  <span>Type: {synergy.synergyType}</span>
                  {synergy.realizationDate && <span>Realized: {synergy.realizationDate}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
