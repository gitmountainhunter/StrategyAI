'use client';

import { Cloud, Cpu, Database, Network, Radio } from 'lucide-react';
import { digitalIntegrationData } from '@/data/digital-integration';

interface TechnologyStackOverviewProps {
  data: typeof digitalIntegrationData;
}

const layerIcons = {
  presentation: Cloud,
  intelligence: Cpu,
  integration: Network,
  data: Database,
  edge: Radio,
};

const techStatusLabels = {
  full: { label: 'Full Deployment', color: 'bg-green-600' },
  partial: { label: 'Partial Deployment', color: 'bg-yellow-600' },
  planned: { label: 'Planned', color: 'bg-blue-600' },
  none: { label: 'Not Planned', color: 'bg-gray-400' },
};

export function TechnologyStackOverview({ data }: TechnologyStackOverviewProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-slb-black mb-2">Technology Stack Overview</h2>
        <p className="text-sm font-light text-gray-600">
          Architecture and technology adoption across digital layers
        </p>
      </div>

      {/* Technology Ecosystem Map */}
      <div className="card">
        <h3 className="text-lg font-light text-slb-black mb-6">Technology Ecosystem Architecture</h3>

        <div className="space-y-3">
          {Object.entries(data.technologyStack.layers).reverse().map(([key, layer], index) => {
            const Icon = layerIcons[key as keyof typeof layerIcons];

            return (
              <div key={key} className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-slb-blue transition-colors">
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-slb-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-light text-slb-black">{layer.name}</h4>
                      <p className="text-xs font-light text-gray-600">{layer.technologies.length} technologies</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-light ${
                      layer.status === 'deployed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {layer.status}
                  </span>
                </div>

                <div className="px-4 py-3 bg-white">
                  <div className="flex flex-wrap gap-2">
                    {layer.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-light hover:bg-blue-100 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Adoption Matrix */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-light text-slb-black mb-6">Technology Adoption Matrix</h3>

        <div className="min-w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-light text-gray-600">Technology</th>
                {Object.values(data.segments).map((segment) => (
                  <th key={segment.id} className="text-center py-3 px-2 text-xs font-light text-gray-600">
                    {segment.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                'IoT Sensors',
                'Cloud Analytics',
                'Digital Twin',
                'AI/ML Models',
                'Mobile Apps',
                'Automation',
                'AR/VR',
                'Blockchain',
              ].map((techName) => (
                <tr key={techName} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-light text-slb-black">{techName}</td>
                  {Object.values(data.segments).map((segment) => {
                    const tech = segment.technologies.find((t) => t.name === techName);
                    const status = tech?.status || 'none';
                    const statusInfo = techStatusLabels[status as keyof typeof techStatusLabels];

                    return (
                      <td key={segment.id} className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center">
                          <div
                            className={`w-20 h-8 ${statusInfo.color} rounded flex items-center justify-center cursor-pointer group relative`}
                            title={statusInfo.label}
                          >
                            <span className="text-xs font-light text-white">
                              {status === 'full'
                                ? '✓ Full'
                                : status === 'partial'
                                ? '⏳ Partial'
                                : status === 'planned'
                                ? '📋 Planned'
                                : '✗ None'}
                            </span>

                            {/* Tooltip with adoption date */}
                            {tech?.adoptionDate && (
                              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs font-light px-2 py-1 rounded whitespace-nowrap">
                                Adopted: {new Date(tech.adoptionDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs font-light text-gray-600 mb-3">Adoption Status:</p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(techStatusLabels).map(([key, { label, color }]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`w-4 h-4 ${color} rounded`}></div>
                <span className="text-xs font-light text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
