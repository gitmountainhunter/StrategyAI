import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import pptxgen from 'pptxgenjs';

const DATA_DIR = path.join(process.cwd(), 'data');

// Read JSON file
async function readJsonFile(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// SLB Brand Colors
const SLB_BLUE = '0014DC';
const SLB_DARK_BLUE = '001178';
const WHITE = 'FFFFFF';
const GRAY_LIGHT = 'F3F4F6';
const GRAY_MEDIUM = '9CA3AF';
const GRAY_DARK = '4B5563';
const GREEN = '10B981';
const YELLOW = 'F59E0B';
const RED = 'EF4444';

export async function GET(request: NextRequest) {
  try {
    // Load data
    const outcomes = await readJsonFile('strategic-outcomes.json');
    const priorities = await readJsonFile('priorities.json');
    const revenue = await readJsonFile('revenue-targets.json');

    // Market segment data (static)
    const segments = [
      { name: 'Onshore', marketSize: 2800, growthRate: 3.5, description: 'Land-based production chemistry' },
      { name: 'Offshore', marketSize: 3200, growthRate: 4.2, description: 'Deep/shallow water solutions' },
      { name: 'Midstream', marketSize: 1800, growthRate: 5.1, description: 'Pipeline & processing chemistry' },
      { name: 'Recovery', marketSize: 2100, growthRate: 6.8, description: 'Enhanced oil recovery' },
      { name: 'Integrated Solutions', marketSize: 1500, growthRate: 8.5, description: 'End-to-end packages' },
    ];

    // Create presentation
    const ppt = new pptxgen();

    // Set presentation properties
    ppt.author = 'SLB Strategy AI';
    ppt.company = 'SLB Production Chemistry Technology';
    ppt.subject = 'PCT Strategy Presentation';
    ppt.title = 'SLB PCT 2030 Strategy';

    // Define master layout
    ppt.defineLayout({ name: 'SLB_LAYOUT', width: 10, height: 5.625 });
    ppt.layout = 'SLB_LAYOUT';

    // ==================== SLIDE 1: Title Slide ====================
    const titleSlide = ppt.addSlide();

    // Background
    titleSlide.background = { color: SLB_BLUE };

    // Title
    titleSlide.addText('SLB Production Chemistry Technology', {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 0.8,
      fontSize: 44,
      bold: true,
      color: WHITE,
      align: 'center',
    });

    // Subtitle
    titleSlide.addText('2030 Strategic Vision', {
      x: 0.5,
      y: 2.4,
      w: 9,
      h: 0.5,
      fontSize: 28,
      color: WHITE,
      align: 'center',
    });

    // Date
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    titleSlide.addText(currentDate, {
      x: 0.5,
      y: 4.5,
      w: 9,
      h: 0.4,
      fontSize: 16,
      color: WHITE,
      align: 'center',
    });

    // ==================== SLIDE 2: Executive Summary ====================
    const execSlide = ppt.addSlide();

    // Header
    execSlide.addText('Executive Summary', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 32,
      bold: true,
      color: SLB_BLUE,
    });

    // 2030 Ambition Box
    execSlide.addShape(ppt.ShapeType.rect, {
      x: 0.5,
      y: 1.0,
      w: 4.2,
      h: 1.8,
      fill: { color: GRAY_LIGHT },
    });

    execSlide.addText('2030 Ambition', {
      x: 0.7,
      y: 1.2,
      w: 3.8,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: SLB_DARK_BLUE,
    });

    const revenueTarget = revenue?.targets?.[0] || { target_amount: 1055, actual_amount: 785 };
    execSlide.addText([
      { text: 'Revenue Target: ', options: { fontSize: 16, color: GRAY_DARK } },
      { text: `$${revenueTarget.target_amount}M`, options: { fontSize: 16, bold: true, color: SLB_BLUE } },
      { text: '\nCurrent: ', options: { fontSize: 14, color: GRAY_MEDIUM } },
      { text: `$${revenueTarget.actual_amount}M`, options: { fontSize: 14, bold: true, color: GRAY_DARK } },
      { text: '\nGrowth Target: ', options: { fontSize: 14, color: GRAY_MEDIUM } },
      { text: '+25%', options: { fontSize: 14, bold: true, color: GREEN } },
    ], {
      x: 0.7,
      y: 1.7,
      w: 3.8,
      h: 1.0,
    });

    // Progress Box
    execSlide.addShape(ppt.ShapeType.rect, {
      x: 5.3,
      y: 1.0,
      w: 4.2,
      h: 1.8,
      fill: { color: GRAY_LIGHT },
    });

    execSlide.addText('Overall Progress', {
      x: 5.5,
      y: 1.2,
      w: 3.8,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: SLB_DARK_BLUE,
    });

    const totalOutcomes = outcomes?.outcomes?.length || 7;
    const onTrack = outcomes?.outcomes?.filter((o: any) => o.status === 'on-track').length || 0;
    const atRisk = outcomes?.outcomes?.filter((o: any) => o.status === 'at-risk').length || 0;

    execSlide.addText([
      { text: 'Strategic Outcomes: ', options: { fontSize: 14, color: GRAY_DARK } },
      { text: `${totalOutcomes}\n`, options: { fontSize: 14, bold: true, color: SLB_BLUE } },
      { text: 'On Track: ', options: { fontSize: 14, color: GRAY_MEDIUM } },
      { text: `${onTrack} `, options: { fontSize: 14, bold: true, color: GREEN } },
      { text: '• At Risk: ', options: { fontSize: 14, color: GRAY_MEDIUM } },
      { text: `${atRisk}`, options: { fontSize: 14, bold: true, color: YELLOW } },
    ], {
      x: 5.5,
      y: 1.7,
      w: 3.8,
      h: 1.0,
    });

    // Key Focus Areas
    execSlide.addText('Key Focus Areas', {
      x: 0.5,
      y: 3.0,
      w: 9,
      h: 0.4,
      fontSize: 18,
      bold: true,
      color: SLB_DARK_BLUE,
    });

    const focusAreas = [
      '• Protect & Expand Offshore',
      '• Grow & Transform Midstream',
      '• Lead on Land - UCR & Conventional',
      '• Integrated Solutions - Chemistry as Core Differentiator',
      '• Leading Production & Recovery',
    ];

    execSlide.addText(focusAreas.join('\n'), {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 1.5,
      fontSize: 14,
      color: GRAY_DARK,
      bullet: true,
    });

    // ==================== SLIDE 3: Market Overview ====================
    const marketSlide = ppt.addSlide();

    marketSlide.addText('Market Overview - Five Segments', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 32,
      bold: true,
      color: SLB_BLUE,
    });

    // Total market size
    const totalMarket = segments.reduce((sum, seg) => sum + seg.marketSize, 0);
    marketSlide.addText(`Total Addressable Market: $${totalMarket}M`, {
      x: 0.5,
      y: 0.9,
      w: 9,
      h: 0.3,
      fontSize: 16,
      italic: true,
      color: GRAY_DARK,
    });

    // Create segment cards
    const cardWidth = 1.7;
    const cardHeight = 2.8;
    const startX = 0.5;
    const startY = 1.4;
    const gap = 0.15;

    segments.forEach((segment, index) => {
      const x = startX + (index * (cardWidth + gap));

      // Card background
      marketSlide.addShape(ppt.ShapeType.rect, {
        x,
        y: startY,
        w: cardWidth,
        h: cardHeight,
        fill: { color: index === 1 ? SLB_BLUE : GRAY_LIGHT },
      });

      // Segment name
      marketSlide.addText(segment.name, {
        x,
        y: startY + 0.2,
        w: cardWidth,
        h: 0.5,
        fontSize: 14,
        bold: true,
        color: index === 1 ? WHITE : SLB_DARK_BLUE,
        align: 'center',
      });

      // Market size
      marketSlide.addText(`$${segment.marketSize}M`, {
        x,
        y: startY + 0.8,
        w: cardWidth,
        h: 0.4,
        fontSize: 18,
        bold: true,
        color: index === 1 ? WHITE : SLB_BLUE,
        align: 'center',
      });

      // Growth rate
      marketSlide.addText(`${segment.growthRate}% CAGR`, {
        x,
        y: startY + 1.3,
        w: cardWidth,
        h: 0.3,
        fontSize: 12,
        color: index === 1 ? GRAY_LIGHT : GREEN,
        align: 'center',
      });

      // Description
      marketSlide.addText(segment.description, {
        x,
        y: startY + 1.8,
        w: cardWidth,
        h: 0.8,
        fontSize: 10,
        color: index === 1 ? WHITE : GRAY_DARK,
        align: 'center',
        valign: 'top',
      });
    });

    // Footer note
    marketSlide.addText('* Offshore represents our largest and most established market', {
      x: 0.5,
      y: 4.8,
      w: 9,
      h: 0.3,
      fontSize: 10,
      italic: true,
      color: GRAY_MEDIUM,
    });

    // ==================== SLIDE 4: Strategic Outcomes Overview ====================
    const outcomesOverviewSlide = ppt.addSlide();

    outcomesOverviewSlide.addText('Seven Strategic Outcomes', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 32,
      bold: true,
      color: SLB_BLUE,
    });

    outcomesOverviewSlide.addText('Driving Our 2030 Ambition', {
      x: 0.5,
      y: 0.85,
      w: 9,
      h: 0.3,
      fontSize: 16,
      italic: true,
      color: GRAY_DARK,
    });

    // Create outcome rows
    const outcomesData = outcomes?.outcomes || [];
    const rowHeight = 0.5;
    const rowY = 1.4;

    outcomesData.forEach((outcome: any, index: number) => {
      const y = rowY + (index * rowHeight);
      const statusColor = outcome.status === 'on-track' ? GREEN : outcome.status === 'at-risk' ? YELLOW : RED;

      // Outcome number
      outcomesOverviewSlide.addShape(ppt.ShapeType.rect, {
        x: 0.5,
        y: y,
        w: 0.5,
        h: 0.4,
        fill: { color: SLB_BLUE },
      });

      outcomesOverviewSlide.addText((index + 1).toString(), {
        x: 0.5,
        y: y,
        w: 0.5,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: WHITE,
        align: 'center',
        valign: 'middle',
      });

      // Outcome name
      outcomesOverviewSlide.addText(outcome.name, {
        x: 1.1,
        y: y,
        w: 5.5,
        h: 0.4,
        fontSize: 12,
        color: GRAY_DARK,
        valign: 'middle',
      });

      // Progress bar background
      outcomesOverviewSlide.addShape(ppt.ShapeType.rect, {
        x: 6.8,
        y: y + 0.05,
        w: 2.0,
        h: 0.3,
        fill: { color: GRAY_LIGHT },
      });

      // Progress bar fill
      const progressWidth = (outcome.progress_percentage / 100) * 2.0;
      outcomesOverviewSlide.addShape(ppt.ShapeType.rect, {
        x: 6.8,
        y: y + 0.05,
        w: progressWidth,
        h: 0.3,
        fill: { color: statusColor },
      });

      // Progress percentage
      outcomesOverviewSlide.addText(`${outcome.progress_percentage}%`, {
        x: 9.0,
        y: y,
        w: 0.5,
        h: 0.4,
        fontSize: 11,
        bold: true,
        color: GRAY_DARK,
        align: 'right',
        valign: 'middle',
      });
    });

    // ==================== SLIDE 5-11: Individual Outcome Details ====================
    outcomesData.forEach((outcome: any, index: number) => {
      const outcomeSlide = ppt.addSlide();

      // Header with outcome number
      outcomeSlide.addShape(ppt.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 0.8,
        fill: { color: SLB_BLUE },
      });

      outcomeSlide.addText(`Outcome ${index + 1}: ${outcome.name}`, {
        x: 0.5,
        y: 0.15,
        w: 9,
        h: 0.5,
        fontSize: 24,
        bold: true,
        color: WHITE,
      });

      // Owner
      outcomeSlide.addText(`Owner: ${outcome.owner}`, {
        x: 0.5,
        y: 1.0,
        w: 9,
        h: 0.3,
        fontSize: 14,
        italic: true,
        color: GRAY_DARK,
      });

      // Progress section
      outcomeSlide.addText('Progress', {
        x: 0.5,
        y: 1.5,
        w: 4,
        h: 0.4,
        fontSize: 18,
        bold: true,
        color: SLB_DARK_BLUE,
      });

      const statusColor = outcome.status === 'on-track' ? GREEN : outcome.status === 'at-risk' ? YELLOW : RED;
      const statusText = outcome.status === 'on-track' ? 'On Track' : outcome.status === 'at-risk' ? 'At Risk' : 'Behind';

      // Large progress circle
      outcomeSlide.addShape(ppt.ShapeType.ellipse, {
        x: 1.5,
        y: 2.0,
        w: 1.5,
        h: 1.5,
        fill: { color: statusColor },
      });

      outcomeSlide.addText([
        { text: `${outcome.progress_percentage}%\n`, options: { fontSize: 32, bold: true, color: WHITE } },
        { text: statusText, options: { fontSize: 12, color: WHITE } },
      ], {
        x: 1.5,
        y: 2.0,
        w: 1.5,
        h: 1.5,
        align: 'center',
        valign: 'middle',
      });

      // Status details
      outcomeSlide.addShape(ppt.ShapeType.rect, {
        x: 5.0,
        y: 1.5,
        w: 4.5,
        h: 2.5,
        fill: { color: GRAY_LIGHT },
      });

      outcomeSlide.addText('Key Metrics', {
        x: 5.2,
        y: 1.7,
        w: 4.1,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: SLB_DARK_BLUE,
      });

      outcomeSlide.addText([
        { text: 'Status: ', options: { fontSize: 12, color: GRAY_DARK } },
        { text: `${statusText}\n`, options: { fontSize: 12, bold: true, color: statusColor } },
        { text: 'Last Updated: ', options: { fontSize: 11, color: GRAY_MEDIUM } },
        { text: `${new Date(outcome.last_updated).toLocaleDateString()}\n`, options: { fontSize: 11, color: GRAY_DARK } },
        { text: 'Notes: ', options: { fontSize: 11, color: GRAY_MEDIUM } },
        { text: outcome.notes || 'No additional notes', options: { fontSize: 11, color: GRAY_DARK, italic: !outcome.notes } },
      ], {
        x: 5.2,
        y: 2.2,
        w: 4.1,
        h: 1.6,
      });

      // Next steps / actions
      outcomeSlide.addText('Related 2026 Priorities', {
        x: 0.5,
        y: 4.0,
        w: 9,
        h: 0.4,
        fontSize: 16,
        bold: true,
        color: SLB_DARK_BLUE,
      });

      // Find related priorities
      const relatedPriorities = priorities?.priorities?.filter((p: any) => {
        // Match priorities based on outcome name keywords
        const outcomeKeywords = outcome.name.toLowerCase().split(' ');
        const priorityName = p.name.toLowerCase();
        return outcomeKeywords.some((keyword: string) => keyword.length > 4 && priorityName.includes(keyword));
      }).slice(0, 3) || [];

      if (relatedPriorities.length > 0) {
        const priorityText = relatedPriorities.map((p: any) => `• ${p.name} (${p.completion_percentage}% complete)`).join('\n');
        outcomeSlide.addText(priorityText, {
          x: 0.5,
          y: 4.5,
          w: 9,
          h: 0.8,
          fontSize: 11,
          color: GRAY_DARK,
        });
      } else {
        outcomeSlide.addText('See 2026 Priorities slide for related initiatives', {
          x: 0.5,
          y: 4.5,
          w: 9,
          h: 0.3,
          fontSize: 11,
          italic: true,
          color: GRAY_MEDIUM,
        });
      }
    });

    // ==================== SLIDE 12: 2026 Priorities Overview ====================
    const prioritiesSlide = ppt.addSlide();

    prioritiesSlide.addText('2026 Key Priorities', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 32,
      bold: true,
      color: SLB_BLUE,
    });

    const prioritiesData = priorities?.priorities || [];
    const completed = prioritiesData.filter((p: any) => p.status === 'completed').length;
    const inProgress = prioritiesData.filter((p: any) => p.status === 'in-progress').length;

    prioritiesSlide.addText(`Total: ${prioritiesData.length} | Completed: ${completed} | In Progress: ${inProgress}`, {
      x: 0.5,
      y: 0.85,
      w: 9,
      h: 0.3,
      fontSize: 14,
      italic: true,
      color: GRAY_DARK,
    });

    // Priority list (show top 10)
    const displayPriorities = prioritiesData.slice(0, 10);
    const prioRowHeight = 0.38;
    const prioStartY = 1.3;

    displayPriorities.forEach((priority: any, index: number) => {
      const y = prioStartY + (index * prioRowHeight);
      const statusColor = priority.status === 'completed' ? GREEN : priority.status === 'in-progress' ? YELLOW : GRAY_MEDIUM;

      // Status indicator
      prioritiesSlide.addShape(ppt.ShapeType.ellipse, {
        x: 0.5,
        y: y + 0.05,
        w: 0.2,
        h: 0.2,
        fill: { color: statusColor },
      });

      // Priority name
      prioritiesSlide.addText(priority.name, {
        x: 0.8,
        y: y,
        w: 6.5,
        h: 0.3,
        fontSize: 10,
        color: GRAY_DARK,
        valign: 'middle',
      });

      // Progress bar background
      prioritiesSlide.addShape(ppt.ShapeType.rect, {
        x: 7.5,
        y: y + 0.05,
        w: 1.5,
        h: 0.2,
        fill: { color: GRAY_LIGHT },
      });

      // Progress bar fill
      const progressWidth = (priority.completion_percentage / 100) * 1.5;
      prioritiesSlide.addShape(ppt.ShapeType.rect, {
        x: 7.5,
        y: y + 0.05,
        w: progressWidth,
        h: 0.2,
        fill: { color: statusColor },
      });

      // Percentage
      prioritiesSlide.addText(`${priority.completion_percentage}%`, {
        x: 9.1,
        y: y,
        w: 0.4,
        h: 0.3,
        fontSize: 9,
        color: GRAY_DARK,
        align: 'right',
        valign: 'middle',
      });
    });

    // ==================== SLIDE 13: Timeline/Roadmap ====================
    const roadmapSlide = ppt.addSlide();

    roadmapSlide.addText('2026 Execution Timeline', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 32,
      bold: true,
      color: SLB_BLUE,
    });

    // Quarter headers
    const quarters = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];
    const qWidth = 2.0;
    const qStartX = 0.8;
    const qY = 1.2;

    quarters.forEach((q, index) => {
      const x = qStartX + (index * qWidth);
      roadmapSlide.addShape(ppt.ShapeType.rect, {
        x,
        y: qY,
        w: qWidth - 0.1,
        h: 0.4,
        fill: { color: SLB_BLUE },
      });

      roadmapSlide.addText(q, {
        x,
        y: qY,
        w: qWidth - 0.1,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: WHITE,
        align: 'center',
        valign: 'middle',
      });
    });

    // Show milestones (sample data)
    const milestones = [
      { quarter: 0, text: 'GTM Playbook Deployment', y: 1.8 },
      { quarter: 0, text: 'Product Mgmt Redesign', y: 2.2 },
      { quarter: 1, text: 'NPD Alignment Complete', y: 1.8 },
      { quarter: 1, text: 'Lab Footprint Realignment', y: 2.2 },
      { quarter: 2, text: 'DigiTEAMS Expansion', y: 1.8 },
      { quarter: 2, text: 'Portfolio Review', y: 2.2 },
      { quarter: 3, text: 'Control Tower Launch', y: 1.8 },
      { quarter: 3, text: 'Key Technology Launches', y: 2.2 },
    ];

    milestones.forEach(milestone => {
      const x = qStartX + (milestone.quarter * qWidth);
      roadmapSlide.addShape(ppt.ShapeType.rect, {
        x,
        y: milestone.y,
        w: qWidth - 0.1,
        h: 0.35,
        fill: { color: GRAY_LIGHT },
      });

      roadmapSlide.addText(milestone.text, {
        x: x + 0.1,
        y: milestone.y + 0.05,
        w: qWidth - 0.3,
        h: 0.25,
        fontSize: 9,
        color: GRAY_DARK,
        valign: 'middle',
      });
    });

    // ==================== SLIDE 14: Summary/Next Steps ====================
    const summarySlide = ppt.addSlide();

    summarySlide.addText('Summary & Next Steps', {
      x: 0.5,
      y: 0.3,
      w: 9,
      h: 0.5,
      fontSize: 32,
      bold: true,
      color: SLB_BLUE,
    });

    // Key takeaways
    summarySlide.addText('Key Takeaways', {
      x: 0.5,
      y: 1.0,
      w: 9,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: SLB_DARK_BLUE,
    });

    const takeaways = [
      'Strong progress toward 2030 revenue target of $1,055M (+25% growth)',
      `${onTrack} of ${totalOutcomes} strategic outcomes on track`,
      `$${totalMarket}M total addressable market across 5 key segments`,
      'Offshore remains our largest market; Integrated Solutions showing highest growth',
      `${inProgress} priorities in active execution for 2026`,
    ];

    summarySlide.addText(takeaways.join('\n'), {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1.5,
      fontSize: 13,
      color: GRAY_DARK,
      bullet: true,
      lineSpacing: 20,
    });

    // Next steps
    summarySlide.addText('Immediate Next Steps', {
      x: 0.5,
      y: 3.2,
      w: 9,
      h: 0.4,
      fontSize: 20,
      bold: true,
      color: SLB_DARK_BLUE,
    });

    const nextSteps = [
      'Address at-risk outcomes with targeted interventions',
      'Accelerate digital adoption across all regions',
      'Execute 2026 priority milestones on schedule',
      'Monitor market dynamics and adjust strategy as needed',
    ];

    summarySlide.addText(nextSteps.join('\n'), {
      x: 0.5,
      y: 3.7,
      w: 9,
      h: 1.2,
      fontSize: 13,
      color: GRAY_DARK,
      bullet: true,
      lineSpacing: 18,
    });

    // Footer
    summarySlide.addText('Generated by SLB Strategy AI', {
      x: 0.5,
      y: 5.1,
      w: 9,
      h: 0.3,
      fontSize: 10,
      italic: true,
      color: GRAY_MEDIUM,
      align: 'center',
    });

    // Generate the PowerPoint file
    const pptxBuffer = await ppt.write({ outputType: 'nodebuffer' });

    // Return the file as a download
    return new NextResponse(pptxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="SLB-PCT-Strategy-${new Date().toISOString().split('T')[0]}.pptx"`,
      },
    });

  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    return NextResponse.json({
      error: 'Failed to generate PowerPoint presentation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
