'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  TrendingUp,
  AlertTriangle,
  Newspaper,
  Building2,
  FileText,
  Filter,
  RefreshCw,
  ExternalLink,
  Clock,
  Tag,
  Star,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar,
  Trash2,
  Sparkles,
} from 'lucide-react';
import CompetitorIntelligenceCard from '@/components/CompetitorIntelligenceCard';
import { getAllCompetitorNames } from '@/lib/CompetitorConfiguration';
import { CompetitorActivityHeatmap } from '@/components/intelligence/CompetitorActivityHeatmap';
import { TechnologyTrendWordCloud } from '@/components/intelligence/TechnologyTrendWordCloud';
import { IntelligenceTimeline } from '@/components/intelligence/IntelligenceTimeline';
import type { IntelligenceItem as NewIntelligenceItem } from '@/types/intelligence';

interface IntelligenceSource {
  name: string;
  type?: string;
  url: string;
  author?: string;
  publication_date: string;
  access_date?: string;
  credibility_score: number;
  subscription_required?: boolean;
  paywall?: boolean;
  relevance?: string;
}

interface DataPoint {
  claim: string;
  value: string;
  metric: string;
  source_excerpt: string;
  source_url: string;
  source_name: string;
  verification_status: string;
  confidence: string;
  citation_id: string;
}

interface Citation {
  id: string;
  reference_number: string;
  full_citation: string;
  short_citation: string;
}

interface IntelligenceItem {
  id: string;
  timestamp: string;
  primary_source: IntelligenceSource;
  supporting_sources: IntelligenceSource[];
  title: string;
  summary: string;
  full_content?: string;
  category: string;
  sentiment: string;
  relevance_score: number;
  market_segments: string[];
  key_companies: string[];
  key_topics: string[];
  key_data_points: DataPoint[];
  strategic_implications: string;
  action_items: string[];
  related_outcomes: string[];
  tags: string[];
  is_flagged: boolean;
  flag_reason?: string;
  citations_list: Citation[];
  last_updated: string;
}

interface Trend {
  id: string;
  trend_name: string;
  description: string;
  strength: string;
  direction: string;
  confidence_level: string;
  affected_segments: string[];
  mention_increase: string;
  supporting_evidence: any[];
  all_citations: any[];
}

const categoryConfig: { [key: string]: { icon: any; color: string } } = {
  'Competitive Intelligence': { icon: Building2, color: 'bg-red-100 text-red-600' },
  'Market Trend': { icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  'Regulatory Update': { icon: FileText, color: 'bg-yellow-100 text-yellow-600' },
  'Market Analysis': { icon: Globe, color: 'bg-purple-100 text-purple-600' },
  'Technology': { icon: Globe, color: 'bg-blue-100 text-blue-600' },
};

const sentimentConfig: { [key: string]: string } = {
  Positive: 'bg-green-100 text-green-700',
  Negative: 'bg-red-100 text-red-700',
  Neutral: 'bg-gray-100 text-gray-700',
};

export default function IntelligencePage() {
  const [intelligence, setIntelligence] = useState<IntelligenceItem[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [competitorFilter, setCompetitorFilter] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'intelligence' | 'trends'>('intelligence');
  const [dateRange, setDateRange] = useState<string>('');
  const [stats, setStats] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [marketIntelligence, setMarketIntelligence] = useState<NewIntelligenceItem[]>([]);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);

  useEffect(() => {
    loadData();
    loadCompetitorStats();
    loadMarketIntelligence();
  }, []);

  const loadMarketIntelligence = async () => {
    setIsLoadingMarketData(true);
    try {
      // First, initialize (triggers scraping if needed)
      const initResponse = await fetch('/api/market-intelligence?action=initialize');
      if (initResponse.ok) {
        const initData = await initResponse.json();
        console.log('Intelligence initialization:', initData.message);
      }

      // Then fetch the data
      const response = await fetch('/api/market-intelligence?action=fetch&segment=all&category=all&days=365');
      if (response.ok) {
        const data = await response.json();
        setMarketIntelligence(data.data.intelligence || []);
      }
    } catch (error) {
      console.error('Error loading market intelligence:', error);
    }
    setIsLoadingMarketData(false);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/intelligence?type=all');
      if (response.ok) {
        const data = await response.json();
        setIntelligence(data.intelligence?.intelligence_items || []);
        setTrends(data.trends?.trends || []);
      }
    } catch (error) {
      console.error('Error loading intelligence:', error);
    }
    setIsLoading(false);
  };

  const loadCompetitorStats = async () => {
    try {
      const response = await fetch('/api/competitor-scraping?action=date-window');
      if (response.ok) {
        const data = await response.json();
        setDateRange(data.display_range);
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading competitor stats:', error);
    }
  };

  const generateMockData = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/competitor-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-all-mock', count: 2 }),
      });

      if (response.ok) {
        await loadData();
        alert('Mock competitor intelligence generated successfully!');
      }
    } catch (error) {
      console.error('Error generating mock data:', error);
      alert('Failed to generate mock data');
    }
    setIsGenerating(false);
  };

  const cleanupExpiredData = async () => {
    if (!confirm('This will remove all intelligence items older than 365 days. Continue?')) {
      return;
    }

    setIsCleaning(true);
    try {
      const response = await fetch('/api/competitor-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup' }),
      });

      if (response.ok) {
        const result = await response.json();
        await loadData();
        alert(`Cleanup complete! Removed ${result.removed} expired items.`);
      }
    } catch (error) {
      console.error('Error cleaning up data:', error);
      alert('Failed to cleanup data');
    }
    setIsCleaning(false);
  };

  const filteredIntelligence = intelligence.filter((item) => {
    if (filter !== 'all' && item.category !== filter) return false;
    if (segmentFilter !== 'all' && !item.market_segments.map(s => s.toLowerCase()).includes(segmentFilter.toLowerCase())) return false;
    if (competitorFilter !== 'all' && (item as any).competitor !== competitorFilter) return false;
    return true;
  });

  const competitorIntelligence = filteredIntelligence.filter((item) => (item as any).competitor);
  const regularIntelligence = filteredIntelligence.filter((item) => !(item as any).competitor);
  const allCompetitors = getAllCompetitorNames();

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderCredibilityStars = (score: number) => {
    const fullStars = Math.floor(score / 2);
    const halfStar = score % 2 >= 1;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < fullStars
                ? 'text-yellow-400 fill-yellow-400'
                : i === fullStars && halfStar
                ? 'text-yellow-400 fill-yellow-200'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-500">{score}/10</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-slb-black">Market Intelligence Hub</h1>
          <p className="text-sm font-light text-gray-500 mt-1">
            Real-time intelligence across all 5 market segments • {marketIntelligence.length} intelligence items
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              setIsLoadingMarketData(true);
              try {
                const response = await fetch('/api/market-intelligence?action=refresh');
                const result = await response.json();
                if (result.success) {
                  await loadMarketIntelligence();
                  alert(`✅ Scraped ${result.data.newItemsScraped} new items from ${result.data.sourcesScraped.join(', ')}`);
                } else {
                  alert(result.message);
                }
              } catch (error) {
                console.error('Refresh failed:', error);
                alert('Failed to refresh intelligence');
              }
              setIsLoadingMarketData(false);
            }}
            disabled={isLoadingMarketData}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            title="Trigger real-time web scraping"
          >
            {isLoadingMarketData ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>Refresh Intelligence</span>
          </button>
        </div>
      </div>

      {/* Date Range Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-medium text-blue-900">Real-Time Market Intelligence</h3>
        </div>
        <p className="text-sm text-blue-700">
          <strong>Coverage:</strong> All 5 market segments (Offshore, Onshore, Midstream, Recovery, Integrated Solutions)
        </p>
        <p className="text-xs text-blue-600 mt-1">
          🌐 Automated web scraping from 6 sources: Baker Hughes, Halliburton, Oil & Gas Journal, Offshore Technology, World Oil, Pipeline & Gas Journal
        </p>
        <div className="flex gap-4 mt-3 text-xs text-blue-700">
          <span>Sources: 6 active</span>
          <span>•</span>
          <span>Items: {marketIntelligence.length}</span>
          <span>•</span>
          <span>Rolling Window: 365 days</span>
          <span>•</span>
          <span>Auto-archiving: Enabled</span>
        </div>
      </div>

      {/* Real-Time Market Intelligence Visualizations */}
      {marketIntelligence.length > 0 ? (
        <div className="space-y-8">
          {/* Intelligence Timeline - MOVED TO TOP */}
          <IntelligenceTimeline intelligence={marketIntelligence} />

          {/* Competitor Activity Heatmap */}
          <CompetitorActivityHeatmap intelligence={marketIntelligence} />

          {/* Technology Trend Word Cloud */}
          <TechnologyTrendWordCloud intelligence={marketIntelligence} />
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Loader2 className="w-8 h-8 text-slb-blue animate-spin mx-auto mb-4" />
          <p className="text-sm font-light text-gray-600 mb-4">
            Loading real-time market intelligence...
          </p>
          <p className="text-xs font-light text-gray-500">
            First load may take a moment as we gather intelligence across all segments
          </p>
        </div>
      )}

      {/* Legacy Competitor Intelligence Section (Optional) */}
      <div className="mt-16 pt-8 border-t-2 border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-light text-slb-black">Legacy Intelligence Archive</h2>
            <p className="text-sm font-light text-gray-500 mt-1">
              Historical competitor intelligence data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generateMockData}
              disabled={isGenerating}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 text-xs"
            >
              {isGenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span>Generate Test Data</span>
            </button>
            <button
              onClick={cleanupExpiredData}
              disabled={isCleaning}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 text-xs"
            >
              {isCleaning ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
              <span>Cleanup</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`px-4 py-2 text-sm font-light border-b-2 -mb-px ${
              activeTab === 'intelligence'
                ? 'border-slb-blue text-slb-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Newspaper className="w-4 h-4 inline mr-2" />
            Legacy Intel ({intelligence.length})
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 text-sm font-light border-b-2 -mb-px ${
              activeTab === 'trends'
                ? 'border-slb-blue text-slb-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Trends ({trends.length})
          </button>
        </div>
      </div>

      {activeTab === 'intelligence' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-light text-gray-500">Category:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm font-light border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slb-blue"
              >
                <option value="all">All Categories</option>
                <option value="Competitive Intelligence">Competitive Intelligence</option>
                <option value="Market Trend">Market Trends</option>
                <option value="Regulatory Update">Regulatory Updates</option>
                <option value="Market Analysis">Market Analysis</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-light text-gray-500">Segment:</span>
              <select
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="text-sm font-light border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slb-blue"
              >
                <option value="all">All Segments</option>
                <option value="onshore">Onshore</option>
                <option value="offshore">Offshore</option>
                <option value="midstream">Midstream</option>
                <option value="recovery">Recovery</option>
                <option value="production chemistry">Production Chemistry</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-light text-gray-500">Competitor:</span>
              <select
                value={competitorFilter}
                onChange={(e) => setCompetitorFilter(e.target.value)}
                className="text-sm font-light border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slb-blue"
              >
                <option value="all">All Competitors ({allCompetitors.length} tracked)</option>
                {allCompetitors.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Competitor Quick Filters */}
          {allCompetitors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-light text-gray-500">Quick filters:</span>
              <button
                onClick={() => setCompetitorFilter('all')}
                className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
              >
                All
              </button>
              <button
                onClick={() => setCompetitorFilter('Baker Hughes')}
                className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
              >
                Baker Hughes
              </button>
              <button
                onClick={() => setCompetitorFilter('Halliburton')}
                className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
              >
                Halliburton
              </button>
              <button
                onClick={() => setCompetitorFilter('Weatherford')}
                className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50"
              >
                Weatherford
              </button>
              <span className="text-xs text-gray-400">
                • {competitorIntelligence.length} competitor intelligence items
              </span>
            </div>
          )}

          {/* Flagged Alerts */}
          {filteredIntelligence.filter(i => i.is_flagged).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-medium text-red-800">
                  Strategic Alerts ({filteredIntelligence.filter(i => i.is_flagged).length})
                </h3>
              </div>
              {filteredIntelligence.filter(i => i.is_flagged).map(item => (
                <div key={item.id} className="text-sm text-red-700 mb-2 last:mb-0">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-red-500 ml-2">- {item.flag_reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Competitor Intelligence Section */}
          {competitorIntelligence.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-medium text-gray-900">
                  Competitor Intelligence ({competitorIntelligence.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {competitorIntelligence.map((item) => (
                  <CompetitorIntelligenceCard key={item.id} intelligence={item as any} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Intelligence Cards */}
          {regularIntelligence.length > 0 && competitorIntelligence.length > 0 && (
            <div className="flex items-center gap-2 pt-4">
              <Newspaper className="w-5 h-5 text-slb-blue" />
              <h2 className="text-lg font-medium text-gray-900">
                Market Intelligence ({regularIntelligence.length})
              </h2>
            </div>
          )}

          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-slb-blue animate-spin mx-auto mb-4" />
                <p className="text-sm font-light text-gray-500">Loading intelligence...</p>
              </div>
            ) : (
              regularIntelligence.map((item) => {
                const config = categoryConfig[item.category] || { icon: Globe, color: 'bg-gray-100 text-gray-600' };
                const CategoryIcon = config.icon;
                const isExpanded = expandedItems.has(item.id);

                return (
                  <div key={item.id} className={`card hover:shadow-md transition-shadow ${item.is_flagged ? 'border-l-4 border-l-red-500' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                            <p className="text-sm font-light text-gray-600 mt-1">{item.summary}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-xs font-light rounded-full flex-shrink-0 ${sentimentConfig[item.sentiment] || 'bg-gray-100 text-gray-700'}`}>
                            {item.sentiment}
                          </span>
                        </div>

                        {/* Primary Source with Citation */}
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <BookOpen className="w-4 h-4 text-slb-blue" />
                            <span className="text-xs font-medium text-gray-700">Primary Source</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">{item.primary_source.name}</span>
                              {item.primary_source.author && ` by ${item.primary_source.author}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              Published: {formatDate(item.primary_source.publication_date)}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Credibility:</span>
                              {renderCredibilityStars(item.primary_source.credibility_score)}
                            </div>
                            <a
                              href={item.primary_source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs text-slb-blue hover:underline"
                            >
                              Read Original Article
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        </div>

                        {/* Supporting Sources */}
                        {item.supporting_sources.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3 inline mr-1 text-green-500" />
                            Verified by {item.supporting_sources.length} additional source{item.supporting_sources.length > 1 ? 's' : ''}
                          </div>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <span className="text-xs font-light text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(item.timestamp)}
                          </span>
                          {item.market_segments.map(segment => (
                            <span key={segment} className="px-2 py-0.5 text-xs font-light bg-slb-blue/10 text-slb-blue rounded">
                              {segment}
                            </span>
                          ))}
                          <span className="text-xs font-light text-gray-500">
                            Relevance: {(item.relevance_score * 10).toFixed(0)}%
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex items-center gap-2 mt-3">
                          {item.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 text-xs font-light bg-gray-100 text-gray-600 rounded"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="flex items-center text-xs text-slb-blue hover:underline mt-3"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              View Details & Citations
                            </>
                          )}
                        </button>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                            {/* Key Data Points */}
                            {item.key_data_points.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-700 mb-2">Key Data Points (Cited)</h4>
                                <div className="space-y-2">
                                  {item.key_data_points.map((point, idx) => (
                                    <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                                      <p className="font-medium text-gray-800">
                                        {point.claim}
                                        <span className="text-slb-blue ml-1">[{idx + 1}]</span>
                                      </p>
                                      <p className="text-gray-500 mt-1 italic">&ldquo;{point.source_excerpt}&rdquo;</p>
                                      <p className="text-gray-400 mt-1">
                                        Source: {point.source_name} • Status: {point.verification_status}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Strategic Implications */}
                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-2">Strategic Implications</h4>
                              <p className="text-xs text-gray-600">{item.strategic_implications}</p>
                            </div>

                            {/* Action Items */}
                            {item.action_items.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-700 mb-2">Recommended Actions</h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {item.action_items.map((action, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-slb-blue mr-2">•</span>
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Full References */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                                <BookOpen className="w-3 h-3 mr-1" />
                                Complete References
                              </h4>
                              <div className="space-y-2">
                                {item.citations_list.map((citation) => (
                                  <div key={citation.id} className="text-xs text-gray-600">
                                    <span className="font-medium text-slb-blue">{citation.reference_number}</span>{' '}
                                    {citation.full_citation}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Supporting Sources Detail */}
                            {item.supporting_sources.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-gray-700 mb-2">Supporting Sources</h4>
                                <div className="space-y-2">
                                  {item.supporting_sources.map((source, idx) => (
                                    <div key={idx} className="text-xs flex items-center justify-between">
                                      <span className="text-gray-600">{source.name}</span>
                                      <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slb-blue hover:underline flex items-center"
                                      >
                                        View <ExternalLink className="w-3 h-3 ml-1" />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!isLoading && filteredIntelligence.length === 0 && (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-light text-gray-500">
                No intelligence found for the selected filters
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === 'trends' && (
        <div className="space-y-4">
          {trends.map((trend) => (
            <div key={trend.id} className="card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{trend.trend_name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-light rounded-full ${
                      trend.strength === 'Strong' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {trend.strength}
                    </span>
                  </div>
                  <p className="text-sm font-light text-gray-600 mt-1">{trend.description}</p>

                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>Direction: {trend.direction}</span>
                    <span>Confidence: {trend.confidence_level}</span>
                    <span className="text-green-600 font-medium">+{trend.mention_increase} mentions</span>
                  </div>

                  {/* Supporting Evidence */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-xs font-medium text-gray-700 mb-2">
                      Supporting Evidence ({trend.supporting_evidence.length} sources)
                    </h4>
                    <div className="space-y-2">
                      {trend.supporting_evidence.slice(0, 3).map((evidence, idx) => (
                        <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                          <p className="font-medium text-gray-800">{evidence.title}</p>
                          <p className="text-gray-500 mt-1">
                            {evidence.source.name} • {formatDate(evidence.date)}
                          </p>
                          <a
                            href={evidence.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slb-blue hover:underline flex items-center mt-1"
                          >
                            View Source <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Affected Segments */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trend.affected_segments.map(segment => (
                      <span key={segment} className="px-2 py-0.5 text-xs font-light bg-slb-blue/10 text-slb-blue rounded">
                        {segment}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center py-4">
        <p className="text-xs font-light text-gray-400">
          💡 Every insight, claim, and statistic on this page is backed by verified sources with direct links
        </p>
      </div>
    </div>
  );
}
