/**
 * CompetitorIntelligenceCard.tsx
 *
 * UI component for displaying competitor intelligence with threat levels and details.
 */

'use client';

import React from 'react';
import {
  Building2,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Globe,
  Target,
  Rocket,
  Handshake,
  FileText,
  DollarSign,
  Zap,
  Package,
} from 'lucide-react';
import { getCompetitorDetails } from '@/lib/CompetitorConfiguration';

interface CompetitorIntelligenceCardProps {
  intelligence: {
    id: string;
    competitor: string;
    competitor_category: string;
    competitor_focus_area?: string | null;
    competitive_intelligence_type: string;
    threat_level: 'HIGH' | 'MEDIUM' | 'LOW';
    relevance_score: number;
    title: string;
    summary: string;
    source: {
      name: string;
      url: string;
      publication_date: string;
      credibility_score: number;
    };
    original_publication_date: string;
    tags: string[];
    market_segments?: string[];
  };
}

export default function CompetitorIntelligenceCard({ intelligence }: CompetitorIntelligenceCardProps) {
  const competitor = getCompetitorDetails(intelligence.competitor);

  const getThreatLevelColor = (level: 'HIGH' | 'MEDIUM' | 'LOW') => {
    const colors = {
      HIGH: 'bg-red-100 text-red-700 border-red-300',
      MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      LOW: 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[level] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getThreatIcon = (level: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (level === 'HIGH') return <AlertTriangle className="w-4 h-4" />;
    if (level === 'MEDIUM') return <TrendingUp className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      product_launch: <Rocket className="w-4 h-4" />,
      business_development: <Handshake className="w-4 h-4" />,
      contracts: <FileText className="w-4 h-4" />,
      financial: <DollarSign className="w-4 h-4" />,
      technology: <Zap className="w-4 h-4" />,
      specific_product: <Package className="w-4 h-4" />,
      focus_area: <Target className="w-4 h-4" />,
      general: <Globe className="w-4 h-4" />,
    };
    return icons[category] || <Globe className="w-4 h-4" />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="card border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-red-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-gray-900">{intelligence.competitor}</h3>
            {competitor && (
              <p className="text-xs text-gray-500 mt-0.5">
                {competitor.market_position} • {competitor.estimated_share} market share
              </p>
            )}
          </div>
        </div>

        <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${getThreatLevelColor(intelligence.threat_level)}`}>
          {getThreatIcon(intelligence.threat_level)}
          {intelligence.threat_level} THREAT
        </div>
      </div>

      {/* Intelligence Type */}
      <div className="flex items-center gap-2 mb-3">
        <div className="text-slb-blue">{getCategoryIcon(intelligence.competitor_category)}</div>
        <span className="text-xs font-medium text-gray-700">{intelligence.competitive_intelligence_type}</span>
        {intelligence.competitor_focus_area && (
          <span className="text-xs text-gray-500">• {intelligence.competitor_focus_area}</span>
        )}
      </div>

      {/* Title and Summary */}
      <h4 className="text-sm font-medium text-gray-900 mb-2">{intelligence.title}</h4>
      <p className="text-sm font-light text-gray-600 mb-4">{intelligence.summary}</p>

      {/* Source Information */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Source:</span>
          <span className="font-medium text-gray-700">{intelligence.source.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Published:</span>
          <span className="text-gray-700 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(intelligence.source.publication_date)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Credibility:</span>
          <span className="text-gray-700">{intelligence.source.credibility_score.toFixed(1)}/10</span>
        </div>
        <a
          href={intelligence.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-slb-blue hover:underline"
        >
          View Original Article
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Market Segments */}
      {intelligence.market_segments && intelligence.market_segments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {intelligence.market_segments.map((segment) => (
            <span key={segment} className="px-2 py-1 text-xs font-light bg-slb-blue/10 text-slb-blue rounded">
              {segment}
            </span>
          ))}
        </div>
      )}

      {/* Relevance Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Strategic Relevance</span>
          <span className="font-medium text-gray-700">{intelligence.relevance_score.toFixed(1)}/10</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slb-blue rounded-full transition-all"
            style={{ width: `${(intelligence.relevance_score / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Competitor Website Link */}
      {competitor && (
        <a
          href={competitor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-slb-blue transition-colors"
        >
          <Globe className="w-3 h-3" />
          Visit {intelligence.competitor} Website
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
        {intelligence.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="px-2 py-0.5 text-xs font-light bg-gray-100 text-gray-600 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
