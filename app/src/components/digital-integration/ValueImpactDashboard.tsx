'use client';

import { TrendingUp, TrendingDown, DollarSign, Users, Shield, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { digitalIntegrationData } from '@/data/digital-integration';

interface ValueImpactDashboardProps {
  data: typeof digitalIntegrationData;
}

export function ValueImpactDashboard({ data }: ValueImpactDashboardProps) {
  // Prepare ROI comparison data
  const roiData = Object.entries(data.segments)
    .map(([key, segment]) => ({
      name: segment.name,
      roi: segment.roi,
    }))
    .sort((a, b) => b.roi - a.roi);

  // Impact metrics cards data
  const impactCards = [
    {
      title: 'Efficiency Improvement',
      value: `↑ ${data.impactMetrics.totalEfficiencyImprovement}%`,
      target: '30%',
      icon: Activity,
      color: 'blue',
      trend: 'increase',
    },
    {
      title: 'Downtime Reduction',
      value: `↓ ${data.impactMetrics.totalDowntimeReduction}%`,
      target: '40%',
      icon: TrendingDown,
      color: 'green',
      trend: 'decrease',
    },
    {
      title: 'Safety Incidents',
      value: `↓ ${data.impactMetrics.safetyIncidentReduction}%`,
      target: '50%',
      icon: Shield,
      color: 'red',
      trend: 'decrease',
    },
    {
      title: 'Customer Satisfaction',
      value: `↑ ${data.impactMetrics.customerSatisfactionIncrease}%`,
      target: '25%',
      icon: Users,
      color: 'purple',
      trend: 'increase',
    },
  ];

  const colorMap = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      progress: 'bg-blue-600',
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      progress: 'bg-green-600',
    },
    red: {
      bg: 'bg-red-100',
      icon: 'text-red-600',
      progress: 'bg-red-600',
    },
    purple: {
      bg: 'bg-purple-100',
      icon: 'text-purple-600',
      progress: 'bg-purple-600',
    },
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-slb-black mb-2">Value & Impact Dashboard</h2>
        <p className="text-sm font-light text-gray-600">
          Quantified business value and operational impact
        </p>
      </div>

      {/* Impact Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactCards.map((card) => {
          const Icon = card.icon;
          const colors = colorMap[card.color as keyof typeof colorMap];
          const currentValue = parseInt(card.value.replace(/[^0-9]/g, ''));
          const targetValue = parseInt(card.target.replace(/[^0-9]/g, ''));
          const progress = Math.min(100, (currentValue / targetValue) * 100);
          const exceedsTarget = currentValue > targetValue;

          return (
            <div key={card.title} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div
                  className={`text-xs font-light px-2 py-1 rounded-full ${
                    exceedsTarget ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  vs. {card.target} target
                </div>
              </div>

              <h3 className="text-sm font-light text-gray-600 mb-2">{card.title}</h3>
              <p className="text-3xl font-light text-slb-black mb-4">{card.value}</p>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${colors.progress} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Value Tree Breakdown */}
      <div className="card">
        <h3 className="text-lg font-light text-slb-black mb-6">Business Value Breakdown</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cost Savings */}
          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-light text-gray-600">Cost Savings</p>
                <p className="text-2xl font-light text-green-700">${data.valueBreakdown.costSavings.total}M/yr</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Automation</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.costSavings.automation}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Predictive Maint.</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.costSavings.predictiveMaint}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Process Optimization</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.costSavings.processOptimization}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Resource Efficiency</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.costSavings.resourceEfficiency}M</span>
              </div>
            </div>
          </div>

          {/* Revenue Growth */}
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-light text-gray-600">Revenue Growth</p>
                <p className="text-2xl font-light text-blue-700">${data.valueBreakdown.revenueGrowth.total}M/yr</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">New Services</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.revenueGrowth.newServices}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Market Share</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.revenueGrowth.marketShare}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Uptime</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.revenueGrowth.uptime}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Customer Retention</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.revenueGrowth.customerRetention}M</span>
              </div>
            </div>
          </div>

          {/* Risk Reduction */}
          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-light text-gray-600">Risk Reduction</p>
                <p className="text-2xl font-light text-purple-700">${data.valueBreakdown.riskReduction.total}M/yr</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Safety</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.riskReduction.safety}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Compliance</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.riskReduction.compliance}M</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-light text-gray-700">Environmental</span>
                <span className="font-light text-gray-900">${data.valueBreakdown.riskReduction.environmental}M</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Comparison Chart */}
      <div className="card">
        <h3 className="text-lg font-light text-slb-black mb-6">ROI Comparison by Segment</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roiData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#6b7280', fontSize: 12 }} width={150} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value}%`, 'ROI']}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="roi" fill="#0014DC" name="Return on Investment (%)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
