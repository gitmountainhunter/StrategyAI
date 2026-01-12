'use client';

import { useMemo } from 'react';
import type { IntelligenceItem } from '@/types/intelligence';
import { Sparkles } from 'lucide-react';

interface TechnologyTrendWordCloudProps {
  intelligence: IntelligenceItem[];
}

interface WordData {
  word: string;
  count: number;
  size: number; // 1-5 (relative size)
  color: string;
}

export function TechnologyTrendWordCloud({ intelligence }: TechnologyTrendWordCloudProps) {
  const wordData = useMemo(() => {
    // Extract all tags and count frequency
    const tagFrequency = new Map<string, number>();

    intelligence.forEach(item => {
      item.tags.forEach(tag => {
        tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
      });
    });

    // Extract keywords from titles and summaries
    const keywordPatterns = [
      { word: 'AI', pattern: /\bai\b|\bartificial intelligence\b/gi },
      { word: 'Machine Learning', pattern: /\bmachine learning\b|\bml\b/gi },
      { word: 'Digital Twin', pattern: /\bdigital twin\b/gi },
      { word: 'IoT', pattern: /\biot\b|\binternet of things\b/gi },
      { word: 'Cloud', pattern: /\bcloud\b/gi },
      { word: 'Automation', pattern: /\bautomation\b|\bautonomous\b/gi },
      { word: 'Analytics', pattern: /\banalytics\b/gi },
      { word: 'Optimization', pattern: /\boptimization\b|\boptimize\b/gi },
      { word: 'Real-time', pattern: /\breal-time\b|\breal time\b/gi },
      { word: 'Predictive', pattern: /\bpredictive\b|\bprediction\b/gi },
      { word: 'Robotics', pattern: /\brobot\b|\brobotics\b/gi },
      { word: 'Blockchain', pattern: /\bblockchain\b/gi },
      { word: 'Cybersecurity', pattern: /\bcybersecurity\b|\bsecurity\b/gi },
      { word: '5G', pattern: /\b5g\b/gi },
      { word: 'Edge Computing', pattern: /\bedge computing\b|\bedge\b/gi },
    ];

    intelligence.forEach(item => {
      const content = `${item.title} ${item.summary}`.toLowerCase();
      keywordPatterns.forEach(({ word, pattern }) => {
        const matches = content.match(pattern);
        if (matches) {
          tagFrequency.set(word, (tagFrequency.get(word) || 0) + matches.length);
        }
      });
    });

    // Convert to array and sort by frequency
    const sortedWords = Array.from(tagFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40); // Top 40 words

    if (sortedWords.length === 0) return [];

    // Calculate max frequency for normalization
    const maxFreq = sortedWords[0][1];

    // Assign sizes (1-5) based on frequency
    const words: WordData[] = sortedWords.map(([word, count]) => {
      const normalizedFreq = count / maxFreq;
      let size: number;
      if (normalizedFreq >= 0.8) size = 5;
      else if (normalizedFreq >= 0.6) size = 4;
      else if (normalizedFreq >= 0.4) size = 3;
      else if (normalizedFreq >= 0.2) size = 2;
      else size = 1;

      // Assign colors based on size
      const colors = [
        'text-blue-400',
        'text-blue-500',
        'text-slb-blue',
        'text-primary-600',
        'text-primary-700'
      ];

      return {
        word,
        count,
        size,
        color: colors[size - 1]
      };
    });

    return words;
  }, [intelligence]);

  const getSizeClass = (size: number): string => {
    switch (size) {
      case 5:
        return 'text-4xl';
      case 4:
        return 'text-3xl';
      case 3:
        return 'text-2xl';
      case 2:
        return 'text-xl';
      case 1:
      default:
        return 'text-base';
    }
  };

  if (wordData.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slb-blue" />
          </div>
          <div>
            <h3 className="text-xl font-light text-slb-black">Technology Trends</h3>
            <p className="text-sm font-light text-gray-600">
              No trend data available yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-slb-blue/10 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-slb-blue" />
        </div>
        <div>
          <h3 className="text-xl font-light text-slb-black">Technology Trends</h3>
          <p className="text-sm font-light text-gray-600">
            Most mentioned technologies and concepts across {intelligence.length} intelligence items
          </p>
        </div>
      </div>

      {/* Word Cloud */}
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-8 min-h-[400px]">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {wordData.map((item, index) => (
            <div
              key={`${item.word}-${index}`}
              className={`
                ${getSizeClass(item.size)}
                ${item.color}
                font-light
                hover:scale-110
                transition-transform
                cursor-pointer
                px-2 py-1
                hover:bg-blue-100
                rounded
              `}
              title={`${item.word}: ${item.count} mentions`}
              style={{
                animation: `fadeIn 0.5s ease-in ${index * 0.05}s both`
              }}
            >
              {item.word}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-light text-slb-black">{wordData.length}</div>
            <div className="text-xs font-light text-gray-600">Unique Terms</div>
          </div>
          <div>
            <div className="text-2xl font-light text-slb-black">{wordData[0]?.word || '-'}</div>
            <div className="text-xs font-light text-gray-600">Top Trend</div>
          </div>
          <div>
            <div className="text-2xl font-light text-slb-black">{wordData[0]?.count || 0}</div>
            <div className="text-xs font-light text-gray-600">Mentions</div>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
