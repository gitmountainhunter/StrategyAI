'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Radio, Search, ChevronDown, ExternalLink } from 'lucide-react';
import { formatIntelligenceDate, getTimeSinceUpdate } from '@/lib/dateUtils';
import { INTELLIGENCE_CATEGORIES, SEGMENT_LABELS } from '@/types/intelligence';
import type { IntelligenceItem, IntelligenceSegment, IntelligenceCategory } from '@/types/intelligence';

interface LiveIntelligenceFeedProps {
  initialIntelligence?: IntelligenceItem[];
}

export function LiveIntelligenceFeed({ initialIntelligence = [] }: LiveIntelligenceFeedProps) {
  const [intelligence, setIntelligence] = useState<IntelligenceItem[]>(initialIntelligence);
  const [filteredIntelligence, setFilteredIntelligence] = useState<IntelligenceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDays, setSelectedDays] = useState<number>(30);

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Load intelligence on mount
  useEffect(() => {
    fetchIntelligence();
    fetchStats();
  }, [selectedSegment, selectedCategory, selectedDays]);

  // Apply search filter
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredIntelligence(
        intelligence.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.summary.toLowerCase().includes(query) ||
            item.tags.some((tag) => tag.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredIntelligence(intelligence);
    }
  }, [searchQuery, intelligence]);

  const fetchIntelligence = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        action: 'fetch',
        segment: selectedSegment,
        category: selectedCategory,
        days: selectedDays.toString()
      });

      const response = await fetch(`/api/market-intelligence?${params}`);
      const result = await response.json();

      if (result.success) {
        setIntelligence(result.data.intelligence);
        setLastUpdate(result.data.lastScraped);
      }
    } catch (error) {
      console.error('Failed to fetch intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/market-intelligence?action=stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/market-intelligence?action=refresh');
      const result = await response.json();

      if (result.success) {
        await fetchIntelligence();
        await fetchStats();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Failed to refresh:', error);
      alert('Failed to refresh intelligence. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center">
              <Radio className="w-5 h-5 text-slb-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-slb-black">Live Market Intelligence</h2>
              {lastUpdate && (
                <p className="text-xs font-light text-gray-500">
                  Last updated: {getTimeSinceUpdate(lastUpdate)}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm font-light text-gray-600">
            Real-time digital transformation intelligence from industry sources
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`flex items-center space-x-2 px-4 py-2 bg-slb-blue text-white rounded-lg hover:bg-primary-600 transition-colors ${
            refreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm font-light">Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search intelligence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Segment Filter */}
          <div>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue focus:border-transparent"
            >
              <option value="all">All Segments</option>
              {Object.entries(SEGMENT_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {Object.entries(INTELLIGENCE_CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm font-light text-gray-600">Show:</span>
          {[7, 30, 90, 180, 365].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className={`px-3 py-1 rounded-lg text-xs font-light transition-colors ${
                selectedDays === days
                  ? 'bg-slb-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-2xl font-light text-slb-black">{stats.total}</p>
            <p className="text-xs font-light text-gray-600 mt-1">Current Items</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-light text-slb-black">{stats.last30Days}</p>
            <p className="text-xs font-light text-gray-600 mt-1">Last 30 Days</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-light text-slb-black">{stats.archived}</p>
            <p className="text-xs font-light text-gray-600 mt-1">Archived</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-light text-slb-black">
              {Object.keys(stats.byCategory || {}).length}
            </p>
            <p className="text-xs font-light text-gray-600 mt-1">Categories</p>
          </div>
        </div>
      )}

      {/* Intelligence Feed */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-light text-slb-black">
            Current Intelligence ({filteredIntelligence.length} items)
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-slb-blue animate-spin" />
          </div>
        ) : filteredIntelligence.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-light">
            No intelligence items found for the selected filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIntelligence.map((item) => (
              <IntelligenceCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Archive Section */}
      {stats && stats.archived > 0 && (
        <div className="card">
          <button
            onClick={() => setShowArchive(!showArchive)}
            className="w-full flex items-center justify-between py-2 hover:bg-gray-50 transition-colors rounded"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg font-light text-slb-black">
                📁 Archived Intelligence ({stats.archived} items)
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform ${showArchive ? 'rotate-180' : ''}`}
            />
          </button>

          {showArchive && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-light text-gray-600">
                Archived items are older than 365 days and maintained for historical reference.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// Intelligence Card Component
function IntelligenceCard({ item }: { item: IntelligenceItem }) {
  const category = INTELLIGENCE_CATEGORIES[item.category];
  const segment = SEGMENT_LABELS[item.segment];

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <span
            className="px-2 py-1 rounded text-xs font-light text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.icon} {category.label}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-light">
            {segment}
          </span>
        </div>
        <span className="text-xs font-light text-gray-500">
          {formatIntelligenceDate(item.publishedDate)}
        </span>
      </div>

      {/* Content */}
      <h4 className="text-base font-light text-slb-black mb-2">{item.title}</h4>
      <p className="text-sm font-light text-gray-700 mb-3">{item.summary}</p>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-light">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Citation */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-light text-gray-600">Source: {item.source.name}</span>
          {item.citation.linkVerified && (
            <span className="text-xs text-green-600" title="Link verified">
              ✓
            </span>
          )}
        </div>
        <a
          href={item.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-xs font-light text-slb-blue hover:underline"
        >
          <span>Read Original</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
