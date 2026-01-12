'use client';

import { useMemo, useState } from 'react';
import type { IntelligenceItem, IntelligenceCategory } from '@/types/intelligence';
import { Calendar, ExternalLink } from 'lucide-react';
import { INTELLIGENCE_CATEGORIES } from '@/types/intelligence';

interface IntelligenceTimelineProps {
  intelligence: IntelligenceItem[];
}

interface TimelineGroup {
  month: string;
  items: IntelligenceItem[];
}

export function IntelligenceTimeline({ intelligence }: IntelligenceTimelineProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { timelineData, totalItems } = useMemo(() => {
    // Filter by category
    let filtered = intelligence;
    if (selectedCategory !== 'all') {
      filtered = intelligence.filter(item => item.category === selectedCategory);
    }

    // Sort by published date (most recent first)
    const sorted = [...filtered].sort((a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );

    // Group by month
    const groups = new Map<string, IntelligenceItem[]>();

    sorted.forEach(item => {
      const date = new Date(item.publishedDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });

      if (!groups.has(monthKey)) {
        groups.set(monthKey, []);
      }
      groups.get(monthKey)!.push(item);
    });

    // Convert to array
    const timelineData: TimelineGroup[] = Array.from(groups.entries())
      .map(([monthKey, items]) => ({
        month: new Date(monthKey + '-01').toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        }),
        items
      }));

    return { timelineData, totalItems: filtered.length };
  }, [intelligence, selectedCategory]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-slb-blue" />
          </div>
          <div>
            <h3 className="text-xl font-light text-slb-black">Intelligence Timeline</h3>
            <p className="text-sm font-light text-gray-600">
              Chronological view of {totalItems} intelligence items
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-light focus:outline-none focus:ring-2 focus:ring-slb-blue focus:border-transparent"
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

      {/* Timeline */}
      {timelineData.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-light">
          No intelligence items found for the selected filter.
        </div>
      ) : (
        <div className="space-y-8">
          {timelineData.map((group, groupIndex) => (
            <div key={group.month} className="relative">
              {/* Month Header */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-32">
                  <div className="text-lg font-light text-slb-black">{group.month}</div>
                  <div className="text-xs font-light text-gray-500">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
                <div className="flex-grow h-px bg-gray-300"></div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 ml-8">
                {group.items.map((item, itemIndex) => {
                  const category = INTELLIGENCE_CATEGORIES[item.category];
                  return (
                    <div
                      key={item.id}
                      className="relative pl-8 pb-4 border-l-2 border-gray-300 hover:border-slb-blue transition-colors"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute -left-[9px] top-0">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: category.color }}
                        ></div>
                      </div>

                      {/* Content */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2 flex-wrap gap-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-light text-white"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.icon} {category.label}
                            </span>
                            <span className="text-xs font-light text-gray-500">
                              {formatDate(item.publishedDate)}
                            </span>
                          </div>
                          <span className="text-xs font-light text-gray-500">
                            {item.source.name}
                          </span>
                        </div>

                        {/* Title & Summary */}
                        <h4 className="text-base font-light text-slb-black mb-2">
                          {item.title}
                        </h4>
                        <p className="text-sm font-light text-gray-700 mb-3">
                          {item.summary}
                        </p>

                        {/* Tags */}
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-light"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-light text-gray-600">
                              Relevance: {item.relevanceScore}%
                            </span>
                            {item.citation.linkVerified && (
                              <span className="text-xs text-green-600" title="Link verified">
                                ✓ Verified
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-light text-slb-black">{timelineData.length}</div>
            <div className="text-xs font-light text-gray-600">Months</div>
          </div>
          <div>
            <div className="text-2xl font-light text-slb-black">{totalItems}</div>
            <div className="text-xs font-light text-gray-600">Total Items</div>
          </div>
          <div>
            <div className="text-2xl font-light text-slb-black">
              {timelineData[0]?.items.length || 0}
            </div>
            <div className="text-xs font-light text-gray-600">This Month</div>
          </div>
          <div>
            <div className="text-2xl font-light text-slb-black">
              {Math.round(totalItems / Math.max(timelineData.length, 1))}
            </div>
            <div className="text-xs font-light text-gray-600">Avg per Month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
