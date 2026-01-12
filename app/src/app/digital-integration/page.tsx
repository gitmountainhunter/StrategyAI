'use client';

import { useState } from 'react';
import { digitalIntegrationStrategyData } from '@/data/digital-integration-strategy';
import HeroSection from '@/components/digital-integration-strategy/HeroSection';
import DigitalFrameworkHub from '@/components/digital-integration-strategy/DigitalFrameworkHub';
import MaturityAssessmentMatrix from '@/components/digital-integration-strategy/MaturityAssessmentMatrix';
import ImplementationRoadmap from '@/components/digital-integration-strategy/ImplementationRoadmap';
import CrossSegmentSynergies from '@/components/digital-integration-strategy/CrossSegmentSynergies';
import CompetitivePositioning from '@/components/digital-integration-strategy/CompetitivePositioning';
import KPODashboard from '@/components/digital-integration-strategy/KPODashboard';
import ValueCreationWaterfall from '@/components/digital-integration-strategy/ValueCreationWaterfall';
import RiskMitigationMatrix from '@/components/digital-integration-strategy/RiskMitigationMatrix';
import InvestmentReturnScatter from '@/components/digital-integration-strategy/InvestmentReturnScatter';
import type { SegmentId, FilterState } from '@/types/digital-integration-strategy';

export default function DigitalIntegrationStrategyPage() {
  // Filter state for cross-component filtering
  const [filterState, setFilterState] = useState<FilterState>({
    selectedSegments: [],
    timeRange: {
      start: '2024-01-01',
      end: '2025-12-31',
    },
    showProjections: true,
    comparisonMode: false,
  });

  // Handle segment selection
  const toggleSegment = (segmentId: SegmentId) => {
    setFilterState((prev) => {
      const isSelected = prev.selectedSegments.includes(segmentId);
      return {
        ...prev,
        selectedSegments: isSelected
          ? prev.selectedSegments.filter((id) => id !== segmentId)
          : [...prev.selectedSegments, segmentId],
      };
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilterState({
      selectedSegments: [],
      timeRange: {
        start: '2024-01-01',
        end: '2025-12-31',
      },
      showProjections: true,
      comparisonMode: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section id="hero" className="mb-12">
        <HeroSection
          data={digitalIntegrationStrategyData}
          filterState={filterState}
        />
      </section>

      {/* Navigation Tabs (Sticky) */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            <a href="#framework" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              Digital Framework
            </a>
            <a href="#maturity" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              Maturity Assessment
            </a>
            <a href="#roadmap" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              Roadmap
            </a>
            <a href="#synergies" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              Cross-Segment Synergies
            </a>
            <a href="#competitive" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              Competitive Positioning
            </a>
            <a href="#kpo" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              KPO Dashboard
            </a>
            <a href="#value" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              Value Creation
            </a>
            <a href="#risk" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              Risk Mitigation
            </a>
            <a href="#investment" className="whitespace-nowrap text-sm font-light text-gray-600 hover:text-slb-blue transition-colors">
              Investment ROI
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16">
        {/* Digital Framework Hub */}
        <section id="framework" className="scroll-mt-24">
          <DigitalFrameworkHub
            segments={digitalIntegrationStrategyData.segments}
            filterState={filterState}
            onSegmentToggle={toggleSegment}
          />
        </section>

        {/* Maturity Assessment Matrix */}
        <section id="maturity" className="scroll-mt-24">
          <MaturityAssessmentMatrix
            assessments={digitalIntegrationStrategyData.maturityAssessments}
            segments={digitalIntegrationStrategyData.segments}
            filterState={filterState}
          />
        </section>

        {/* Implementation Roadmap */}
        <section id="roadmap" className="scroll-mt-24">
          <ImplementationRoadmap
            roadmap={digitalIntegrationStrategyData.roadmap}
            filterState={filterState}
          />
        </section>

        {/* Cross-Segment Synergies */}
        <section id="synergies" className="scroll-mt-24">
          <CrossSegmentSynergies
            synergies={digitalIntegrationStrategyData.synergies}
            segments={digitalIntegrationStrategyData.segments}
            filterState={filterState}
          />
        </section>

        {/* Competitive Positioning */}
        <section id="competitive" className="scroll-mt-24">
          <CompetitivePositioning
            competitors={digitalIntegrationStrategyData.competitors}
            segments={digitalIntegrationStrategyData.segments}
            filterState={filterState}
          />
        </section>

        {/* KPO Dashboard */}
        <section id="kpo" className="scroll-mt-24">
          <KPODashboard
            kpos={digitalIntegrationStrategyData.kpos}
            overallScore={digitalIntegrationStrategyData.overview.overallHealthScore}
            filterState={filterState}
          />
        </section>

        {/* Value Creation Waterfall */}
        <section id="value" className="scroll-mt-24">
          <ValueCreationWaterfall
            valueBreakdown={digitalIntegrationStrategyData.valueBreakdown}
            segments={digitalIntegrationStrategyData.segments}
            filterState={filterState}
          />
        </section>

        {/* Risk Mitigation Matrix */}
        <section id="risk" className="scroll-mt-24">
          <RiskMitigationMatrix
            riskAssessments={digitalIntegrationStrategyData.riskAssessments}
            filterState={filterState}
          />
        </section>

        {/* Investment Return Scatter */}
        <section id="investment" className="scroll-mt-24">
          <InvestmentReturnScatter
            investments={digitalIntegrationStrategyData.investments}
            segments={digitalIntegrationStrategyData.segments}
            filterState={filterState}
          />
        </section>
      </div>

      {/* Filter Controls (Floating Action Button) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={resetFilters}
          className="bg-slb-blue text-white rounded-full px-6 py-3 shadow-lg hover:bg-slb-blue-600 transition-colors font-light text-sm"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
