'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Target, Zap, Globe } from 'lucide-react';
import type { DigitalIntegrationStrategyData, FilterState } from '@/types/digital-integration-strategy';

interface HeroSectionProps {
  data: DigitalIntegrationStrategyData;
  filterState: FilterState;
}

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      setCount(Math.floor(target * easeOutQuad(progress)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

export default function HeroSection({ data, filterState }: HeroSectionProps) {
  const marketSize = useAnimatedCounter(data.overview.totalMarketSize, 2000);
  const adoptionRate = useAnimatedCounter(data.overview.digitalAdoptionRate, 2000);
  const efficiencyGains = useAnimatedCounter(data.overview.efficiencyGains, 2000);
  const healthScore = useAnimatedCounter(data.overview.overallHealthScore, 2000);

  const stats = [
    {
      id: 'market-size',
      label: 'Total Addressable Market',
      value: `$${marketSize.toLocaleString()}M`,
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 'adoption',
      label: 'Digital Adoption Rate',
      value: `${adoptionRate}%`,
      icon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 'efficiency',
      label: 'Efficiency Gains',
      value: `${efficiencyGains}%`,
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      id: 'health',
      label: 'Overall Health Score',
      value: `${healthScore}/100`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background with SLB Blue Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slb-blue via-slb-blue-600 to-slb-blue-700">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Main Headline */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 animate-fade-in">
            Digital as the{' '}
            <span className="font-normal bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Competitive Enabler
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-blue-100 max-w-4xl mx-auto animate-fade-in-delay">
            Transforming Market Intelligence into Strategic Advantage Across All Segments
          </p>
        </div>

        {/* Key Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} rounded-lg p-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="text-3xl font-light text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm font-light text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <div className="text-4xl font-light mb-2">6</div>
              <div className="text-sm font-light text-blue-100">Market Segments</div>
              <div className="text-xs text-blue-200 mt-1">Onshore, Offshore, Recovery, Midstream, Integrated</div>
            </div>
            <div className="text-center border-l border-r border-white/20">
              <div className="text-4xl font-light mb-2">$1.16B</div>
              <div className="text-sm font-light text-blue-100">Total Value Creation</div>
              <div className="text-xs text-blue-200 mt-1">Cost Savings + Revenue Growth + Risk Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light mb-2">18</div>
              <div className="text-sm font-light text-blue-100">Competitors Tracked</div>
              <div className="text-xs text-blue-200 mt-1">Real-time digital maturity monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
}
