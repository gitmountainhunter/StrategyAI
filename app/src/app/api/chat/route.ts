import { NextRequest, NextResponse } from 'next/server';
import { strategyData, productDomains, marketChemistryTypes } from '@/data/strategy';
import { analyzeQuery, getFollowUpSuggestions } from '@/lib/queryAnalyzer';
import { generateChartData, ChartData } from '@/lib/chartDataGenerator';

// Helper function to search strategy data
function searchStrategy(query: string): string {
  const lowerQuery = query.toLowerCase();
  let response = '';
  const suggestions: string[] = [];

  // Check for ambition/target queries
  if (lowerQuery.includes('ambition') || lowerQuery.includes('target') || lowerQuery.includes('2030') || lowerQuery.includes('goal')) {
    response = `**PCT 2030 Ambition:**

- **Revenue Target:** $${strategyData.ambition.revenueTarget}M
- **Revenue Growth:** ${strategyData.ambition.revenueGrowth}
- **IBT Target:** ${strategyData.ambition.ibtTarget}

**Key Focus Areas:**
${strategyData.ambition.focusAreas.map(area => `• ${area}`).join('\n')}

The strategy aims to position PCT as the leading production chemistry provider through integrated solutions and chemistry-enabled recovery.`;
    suggestions.push('What are the key constraints?', 'How are the strategic outcomes progressing?');
  }

  // Check for segment queries
  else if (lowerQuery.includes('segment') || lowerQuery.includes('market')) {
    const segmentMatches = strategyData.segments.filter(s =>
      lowerQuery.includes(s.name.toLowerCase()) || lowerQuery.includes(s.id)
    );

    if (segmentMatches.length > 0) {
      const segment = segmentMatches[0];
      response = `**${segment.name} Segment:**

${segment.description}

**Market Size:** $${segment.marketSize}M
**Growth Rate:** ${segment.growthRate}% CAGR

**Key Products:**
${segment.products.map(p => `• ${p}`).join('\n')}

${segment.competitors && segment.competitors.length > 0 ? `
**Key Competitors:**
${segment.competitors.map(c => `• ${c.name} (${c.marketShare}% market share)`).join('\n')}
` : ''}`;
      suggestions.push(`What are the competitors in ${segment.name}?`, 'What are the growth opportunities?');
    } else {
      response = `**Market Segments Overview:**

${strategyData.segments.map(s => `**${s.name}:** $${s.marketSize}M (${s.growthRate}% CAGR)
${s.description}`).join('\n\n')}

Would you like me to dive deeper into a specific segment?`;
      suggestions.push('Tell me about the Offshore segment', 'What about Recovery?');
    }
  }

  // Check for constraint/challenge queries
  else if (lowerQuery.includes('constraint') || lowerQuery.includes('challenge') || lowerQuery.includes('problem') || lowerQuery.includes('weakness')) {
    response = `**Key Constraints & Challenges:**

${strategyData.constraints.map((c, i) => `${i + 1}. ${c}`).join('\n\n')}

These constraints have been categorized as either root causes (RC) or symptoms (S) to prioritize improvement efforts.`;
    suggestions.push('What are we doing well?', 'How are we addressing these?');
  }

  // Check for foundation/strength queries
  else if (lowerQuery.includes('foundation') || lowerQuery.includes('strength') || lowerQuery.includes('doing well') || lowerQuery.includes('protect')) {
    response = `**Our Foundation & Strengths:**

${strategyData.foundation.map((f, i) => `${i + 1}. ${f}`).join('\n\n')}

These are the capabilities we must protect and amplify as we execute our strategy.`;
    suggestions.push('What are the constraints?', 'What are the 2026 priorities?');
  }

  // Check for outcome/progress queries
  else if (lowerQuery.includes('outcome') || lowerQuery.includes('progress') || lowerQuery.includes('kpi') || lowerQuery.includes('status')) {
    const onTrack = strategyData.strategicOutcomes.filter(o => o.status === 'on-track').length;
    const atRisk = strategyData.strategicOutcomes.filter(o => o.status === 'at-risk').length;

    response = `**Strategic Outcomes Status:**

**Summary:** ${onTrack} on track, ${atRisk} at risk

${strategyData.strategicOutcomes.map(outcome => {
  const avgProgress = outcome.kpis.reduce((sum, kpi) => sum + (kpi.current / kpi.target) * 100, 0) / outcome.kpis.length;
  return `**${outcome.title}** - ${outcome.status.toUpperCase()}
Owner: ${outcome.owner}
Progress: ${avgProgress.toFixed(0)}%
${outcome.kpis.map(kpi => `• ${kpi.name}: ${kpi.current}/${kpi.target} ${kpi.unit}`).join('\n')}`;
}).join('\n\n')}`;
    suggestions.push('What are the 2026 priorities?', 'Which outcomes are at risk?');
  }

  // Check for priority/action queries
  else if (lowerQuery.includes('priority') || lowerQuery.includes('action') || lowerQuery.includes('2026') || lowerQuery.includes('plan')) {
    const completed = strategyData.priorities.filter(p => p.status === 'completed').length;
    const inProgress = strategyData.priorities.filter(p => p.status === 'in-progress').length;

    response = `**2026 Priorities:**

**Status:** ${completed} completed, ${inProgress} in progress, ${strategyData.priorities.length - completed - inProgress} pending

**By Quarter:**

${['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => {
  const quarterPriorities = strategyData.priorities.filter(p => p.quarter.includes(quarter));
  if (quarterPriorities.length === 0) return '';
  return `**${quarter}:**
${quarterPriorities.map(p => `• ${p.action} [${p.status}]`).join('\n')}`;
}).filter(Boolean).join('\n\n')}`;
    suggestions.push('What are the strategic outcomes?', 'How is digital transformation progressing?');
  }

  // Check for digital/technology queries
  else if (lowerQuery.includes('digital') || lowerQuery.includes('technology') || lowerQuery.includes('data') || lowerQuery.includes('ai')) {
    const digitalOutcome = strategyData.strategicOutcomes.find(o => o.id === 'digital-core');

    response = `**Digital Transformation Status:**

${digitalOutcome ? `
**${digitalOutcome.title}**
Status: ${digitalOutcome.status.toUpperCase()}
Owner: ${digitalOutcome.owner}

**Key Metrics:**
${digitalOutcome.kpis.map(kpi => `• ${kpi.name}: ${kpi.current}/${kpi.target} ${kpi.unit} (${((kpi.current / kpi.target) * 100).toFixed(0)}%)`).join('\n')}

**Current Initiatives:**
• PROact DigiTEAMS monitoring and surveillance expansion
• Fit-for-Purpose Control Tower development
• Increase involvement in IPO
• Clarifying R&R with Digital & NAL Digital
` : 'Digital transformation data not available.'}

**Key Constraint:** Digital enablement is patchy - stronger in North America Land, weak in Rest of World.`;
    suggestions.push('What about customer responsiveness?', 'How are we addressing constraints?');
  }

  // Check for competitor queries
  else if (lowerQuery.includes('competitor') || lowerQuery.includes('competition') || lowerQuery.includes('baker') || lowerQuery.includes('halliburton')) {
    const allCompetitors = strategyData.segments.flatMap(s => s.competitors || []);
    const uniqueCompetitors = Array.from(new Map(allCompetitors.map(c => [c.id, c])).values());

    response = `**Competitive Landscape:**

${uniqueCompetitors.map(comp => `
**${comp.name}**
Market Share: ${comp.marketShare}%

*Strengths:*
${comp.strengths.map(s => `• ${s}`).join('\n')}

*Weaknesses:*
${comp.weaknesses.map(w => `• ${w}`).join('\n')}

*Recent Activities:*
${comp.recentActivities.map(a => `• ${a}`).join('\n')}
`).join('\n')}`;
    suggestions.push('What are our strengths?', 'What segment has most competition?');
  }

  // Check for product/chemistry queries
  else if (lowerQuery.includes('product') || lowerQuery.includes('chemistry') || lowerQuery.includes('chemical')) {
    response = `**Product Domains:**

${productDomains.map(d => `**${d.name}:** ${d.description}`).join('\n\n')}

**Chemistry Types:**

${Object.values(marketChemistryTypes).map(type => `
**${type.name}:**
${type.products.map(p => `• ${p}`).join('\n')}
`).join('\n')}`;
    suggestions.push('Tell me about production chemistry', 'What about water treatment?');
  }

  // Default response
  else {
    response = `I can help you with information about the PCT Strategy, including:

• **2030 Ambition** - Revenue targets and growth goals
• **Market Segments** - Onshore, Offshore, Midstream, Recovery, Integrated Solutions
• **Strategic Outcomes** - 7 key outcomes and their progress
• **2026 Priorities** - Quarterly action items and status
• **Constraints & Challenges** - Key blockers and root causes
• **Foundation & Strengths** - What we do well
• **Competitors** - Baker Hughes, Halliburton analysis
• **Digital Transformation** - Technology initiatives

What would you like to know more about?`;
    suggestions.push('Summarize the 2030 ambition', 'What are the key constraints?', 'Show strategic outcomes progress');
  }

  return JSON.stringify({ response, suggestions });
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // Analyze query for visualization intent
    const vizIntent = analyzeQuery(message);

    // Process the message and generate text response
    const result = JSON.parse(searchStrategy(message));

    let charts: ChartData[] = [];
    let enhancedSuggestions = result.suggestions;

    // Generate chart data if visualization is needed
    if (vizIntent.shouldVisualize) {
      try {
        const chartData = await generateChartData(
          vizIntent.dataSource,
          vizIntent.chartType,
          vizIntent.title,
          vizIntent.filters
        );
        charts = [chartData];

        // Add chart-specific follow-up suggestions
        const chartSuggestions = getFollowUpSuggestions(vizIntent.dataSource);
        enhancedSuggestions = [
          ...chartSuggestions.slice(0, 2),
          ...result.suggestions.slice(0, 1),
        ];

        // Enhance response with chart context
        if (chartData.insights && chartData.insights.length > 0) {
          result.response = `${result.response}\n\n**Data Visualization:** I've generated a ${vizIntent.chartType} chart showing ${vizIntent.title.toLowerCase()}. The chart includes ${chartData.data?.length || 0} data points with key insights highlighted below.`;
        }
      } catch (chartError) {
        console.error('Chart generation error:', chartError);
        // Continue with text-only response if chart fails
      }
    }

    return NextResponse.json({
      response: result.response,
      metadata: {
        suggestions: enhancedSuggestions,
        charts: charts.length > 0 ? charts : undefined,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
