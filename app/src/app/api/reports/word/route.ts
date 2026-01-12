import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableCell,
  TableRow,
  WidthType,
  VerticalAlign,
  ShadingType,
} from 'docx';

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

// SLB Brand Colors (in hex for docx)
const SLB_BLUE = '0014DC';
const GRAY_DARK = '4B5563';
const GREEN = '10B981';
const YELLOW = 'F59E0B';

export async function GET(request: NextRequest) {
  try {
    // Load data
    const outcomes = await readJsonFile('strategic-outcomes.json');
    const priorities = await readJsonFile('priorities.json');
    const revenue = await readJsonFile('revenue-targets.json');

    // Market segment data
    const segments = [
      {
        name: 'Onshore',
        marketSize: 2800,
        growthRate: 3.5,
        description: 'Land-based production chemistry including unconventional reserves (UCR) and conventional operations',
        details: 'The onshore segment represents our traditional strength in land-based oil and gas production. This includes both conventional vertical wells and unconventional horizontal drilling operations. Our product portfolio covers scale inhibitors, corrosion inhibitors, demulsifiers, paraffin control, and H2S scavengers. The segment is characterized by high volume, cost-sensitive operations where operational efficiency and rapid response capabilities are critical success factors.'
      },
      {
        name: 'Offshore',
        marketSize: 3200,
        growthRate: 4.2,
        description: 'Deep water and shallow water production chemistry solutions',
        details: 'Our offshore segment is our largest and most established market, encompassing both deepwater and shallow water operations. This segment requires specialized chemistry solutions for flow assurance, hydrate inhibition, asphaltene dispersion, and wax control. The offshore environment presents unique challenges including extreme pressures, temperatures, and the critical need for reliability given the high cost of interventions. Our strong track record and integrated service delivery model position us well to protect and expand this market leadership.'
      },
      {
        name: 'Midstream',
        marketSize: 1800,
        growthRate: 5.1,
        description: 'Pipeline and processing facility chemistry',
        details: 'The midstream segment focuses on pipeline transportation and processing facility operations. This growing market includes pipeline corrosion inhibitors, drag reducers, processing aids, and glycol solutions. As production becomes more complex and infrastructure ages, the demand for effective midstream chemistry solutions continues to grow. This segment offers opportunities for long-term contracts and integrated solutions that optimize the entire value chain from wellhead to refinery.'
      },
      {
        name: 'Recovery',
        marketSize: 2100,
        growthRate: 6.8,
        description: 'Enhanced oil recovery and stimulation chemistry',
        details: 'Enhanced oil recovery (EOR) represents one of our highest growth opportunities, driven by the industry\'s need to maximize recovery from existing fields. Our portfolio includes EOR polymers, surfactants, alkaline agents, and stimulation fluids. This segment requires deep technical expertise and close collaboration with reservoir engineering teams. As conventional reserves decline, chemical-enabled recovery technologies become increasingly critical to maintaining production levels and extending field life.'
      },
      {
        name: 'Integrated Solutions',
        marketSize: 1500,
        growthRate: 8.5,
        description: 'End-to-end chemistry solutions combining multiple product lines',
        details: 'Integrated Solutions represents the future of our business model, combining multiple product lines with digital monitoring and performance contracts. Rather than selling individual products, we provide complete field solutions that optimize the entire production system. This approach differentiates us through chemistry expertise, reduces total cost of ownership for customers, and creates stickier, higher-margin business relationships. Digital enablement and data analytics are core to delivering measurable value in this segment.'
      },
    ];

    // Current status
    const revenueData = revenue?.targets?.[0] || { target_amount: 1055, actual_amount: 785, progress_percentage: 74.4 };
    const outcomesData = outcomes?.outcomes || [];
    const prioritiesData = priorities?.priorities || [];
    const onTrack = outcomesData.filter((o: any) => o.status === 'on-track').length;
    const atRisk = outcomesData.filter((o: any) => o.status === 'at-risk').length;
    const totalMarket = segments.reduce((sum, seg) => sum + seg.marketSize, 0);

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // ==================== TITLE PAGE ====================
          new Paragraph({
            text: 'SLB Production Chemistry Technology',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: '2030 Strategic Vision & Execution Plan',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: '2030 Strategic Vision & Execution Plan',
                size: 32,
                color: SLB_BLUE,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            text: `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
          }),
          new Paragraph({
            text: '',
            spacing: { after: 400 },
          }),

          // ==================== EXECUTIVE SUMMARY ====================
          new Paragraph({
            text: 'Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: 'This document articulates the strategic vision and execution plan for SLB\'s Production Chemistry Technology (PCT) division through 2030. It outlines our ambition to achieve $1,055M in revenue with sustained profitability, while transforming how we operate, innovate, and serve our customers.',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Strategic Imperative',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: 'The oil and gas production chemistry market is at an inflection point. Traditional product-focused business models are giving way to integrated, digitally-enabled solutions. Customer expectations are evolving toward outcome-based contracts and total cost of ownership optimization. Meanwhile, the industry faces increasing pressure to improve operational efficiency, reduce environmental impact, and maximize recovery from existing assets.',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Our strategy responds to these dynamics by transforming PCT from a chemistry product supplier into a solutions provider that leverages our deep technical expertise, global scale, and digital capabilities. We are focusing on high-growth segments (Integrated Solutions at ${segments[4].growthRate}% CAGR, Recovery at ${segments[3].growthRate}% CAGR) while protecting our strong position in established markets like Offshore ($${segments[1].marketSize}M market size).`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Current State',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: `As of today, we have achieved $${revenueData.actual_amount}M in revenue, representing ${revenueData.progress_percentage.toFixed(1)}% progress toward our $${revenueData.target_amount}M target. Of our seven strategic outcomes, ${onTrack} are on track while ${atRisk} require focused attention and intervention. We have ${prioritiesData.filter((p: any) => p.status === 'completed').length} completed priorities and ${prioritiesData.filter((p: any) => p.status === 'in-progress').length} initiatives currently in active execution.`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'The Path Forward',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: 'Success requires disciplined execution across seven strategic outcomes, supported by 20 specific priorities for 2026. This document details how we will achieve our ambition through market-led growth, faster innovation, digital transformation, and operational excellence. Each section provides clear articulation of what we will do, why it matters, and how we will measure success.',
            spacing: { after: 400 },
          }),

          // ==================== 2030 VISION & AMBITION ====================
          new Paragraph({
            text: '2030 Vision & Ambition',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: 'Our 2030 Ambition',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: `By 2030, we will achieve $${revenueData.target_amount}M in revenue, representing +25% growth from current baseline, with Income Before Tax (IBT) exceeding 5.0%. This ambition is both aspirational and achievable, grounded in clear market opportunities and our demonstrated capabilities.`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Strategic Focus Areas',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: 'Our path to achieving this ambition centers on six strategic focus areas:',
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'Protect & Expand Offshore',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Protect & Expand Offshore', bold: true }),
              new TextRun({ text: ' - Leverage our market leadership in offshore production chemistry ($3.2B market) to defend existing positions and capture growth in emerging deepwater basins. Our integrated approach combining chemistry expertise with digital monitoring provides differentiated value that justifies premium positioning.' }),
            ],
          }),
          new Paragraph({
            text: 'Grow & Transform Midstream',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Grow & Transform Midstream', bold: true }),
              new TextRun({ text: ' - Accelerate growth in the midstream segment (5.1% CAGR) by developing comprehensive pipeline and processing solutions. This requires technical innovation in drag reduction and corrosion inhibition, coupled with long-term partnership models that align our success with customer outcomes.' }),
            ],
          }),
          new Paragraph({
            text: 'Lead on Land',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Lead on Land - UCR & Conventional', bold: true }),
              new TextRun({ text: ' - Strengthen our position in onshore production ($2.8B market) through rapid response capabilities, cost-competitive products, and digital enablement. Success in this segment requires operational excellence and the ability to scale solutions across diverse basin requirements.' }),
            ],
          }),
          new Paragraph({
            text: 'Integrated Solutions',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Integrated Solutions - Chemistry as Core Differentiator', bold: true }),
              new TextRun({ text: ' - Transform our business model by selling integrated solutions rather than individual products. This highest-growth segment (8.5% CAGR) allows us to differentiate through chemistry expertise, capture more value, and build stickier customer relationships through performance contracts and digital monitoring.' }),
            ],
          }),
          new Paragraph({
            text: 'Leading Production & Recovery',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Leading Production & Recovery', bold: true }),
              new TextRun({ text: ' - Maintain our leadership position in production optimization while expanding capabilities in enhanced recovery. As conventional reserves decline, chemical-enabled recovery technologies become increasingly critical to sustaining production levels.' }),
            ],
          }),
          new Paragraph({
            text: 'Chemistry Enabled Recovery',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Grow Chemistry Enabled Recovery', bold: true }),
              new TextRun({ text: ' - Capitalize on the highest organic growth opportunity (6.8% CAGR) by developing advanced EOR polymers, surfactants, and alkaline agents. This requires deep reservoir engineering partnerships and the ability to demonstrate measurable recovery improvements.' }),
            ],
          }),

          // ==================== MARKET LANDSCAPE ====================
          new Paragraph({
            text: 'Market Landscape & Opportunities',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: `The global production chemistry market represents a $${totalMarket}M opportunity across five distinct segments. Each segment has unique characteristics, growth drivers, competitive dynamics, and requirements for success.`,
            spacing: { after: 300 },
          }),

          // Market segments detailed sections
          ...segments.flatMap(segment => [
            new Paragraph({
              text: `${segment.name} Segment`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Market Size: ', bold: true }),
                new TextRun({ text: `$${segment.marketSize}M | ` }),
                new TextRun({ text: 'Growth Rate: ', bold: true }),
                new TextRun({ text: `${segment.growthRate}% CAGR` }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: segment.description,
              spacing: { after: 100 },
              italics: true,
            }),
            new Paragraph({
              text: segment.details,
              spacing: { after: 200 },
            }),
          ]),

          // ==================== STRATEGIC OUTCOMES ====================
          new Paragraph({
            text: 'Seven Strategic Outcomes',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: 'Our strategy is organized around seven interconnected outcomes that define what success looks like. Each outcome has clear ownership, measurable KPIs, and specific initiatives to drive progress. Together, these outcomes transform how we operate, innovate, and serve customers.',
            spacing: { after: 300 },
          }),

          // Outcome details
          ...outcomesData.flatMap((outcome: any, index: number) => {
            const descriptions: Record<string, string> = {
              'strategy-action': 'Moving from strategy development to strategy execution is our foundational imperative. Too often, well-crafted strategies remain "on paper" without translating into changed behaviors and business results. This outcome ensures everyone in PCT understands our strategy, how their work contributes, and what success looks like. We are operationalizing our strategy through the OGSM (Objectives, Goals, Strategies, Measures) framework and developing go-to-market playbooks that translate strategic intent into actionable sales and marketing plans for each segment.',
              'faster-innovation': 'The pace of innovation—from conception to market to revenue generation—is critical to competitive advantage. Our current innovation cycle is too slow, with unclear handoffs between NPD, Product Management, and commercial teams. This outcome redesigns our product management function, implements proven SLB product management processes, and creates clear accountability for moving innovations through the pipeline. Success means launching key new technologies on predictable timelines and seeing faster revenue uptake from innovation.',
              'simpler-workflows': 'Our manufacturing and technology workflows are unnecessarily complex, creating delays, quality inconsistencies, and frustration for both employees and customers. This outcome simplifies and digitizes core M&T processes, particularly product setup and formulation workflows. By reducing complexity and manual touchpoints, we accelerate response times, improve quality consistency, and free up technical resources to focus on innovation rather than administrative tasks.',
              'customer-responsiveness': 'In production chemistry, responsiveness is a competitive differentiator. When production issues arise, customers need solutions measured in hours, not days. This outcome realigns our global lab footprint with business needs, ensures Fit-for-Basin rapid response capabilities, and creates seamless coordination between technology, sales, and supply chain. Customer-first responsiveness means organizing around customer needs rather than internal convenience.',
              'sharper-portfolio': 'Our product portfolio has grown organically over decades, resulting in unnecessary complexity, redundant SKUs, and suboptimal cost structure. A sharper, leaner portfolio focuses on products that deliver differentiated value while eliminating offerings that create complexity without compensating revenue or strategic benefit. Fit-for-Basin pantry definitions ensure we have the right products for each region, while COGS synergies with Pit Crew operations improve margins.',
              'digital-core': 'Digital technology should be central to how we operate, not an add-on or afterthought. This outcome clarifies roles and responsibilities with Digital and NAL Digital teams, expands PROact DigiTEAMS monitoring capabilities, and develops a fit-for-purpose Control Tower for visibility and decision support. Digital at the core means data-driven decisions, proactive rather than reactive problem-solving, and seamless information flow across the organization.',
              'market-growth': 'Sustainable growth requires both defending existing markets and creating new growth vectors. This outcome defines our approach to step-out opportunities and adjacencies, develops integrated solutions selling capabilities, and creates the mindset, skills, and tools needed to sell value rather than products. Market-led growth means understanding customer needs before developing solutions and organizing our innovation efforts around market opportunities rather than internal capabilities.',
            };

            const statusText = outcome.status === 'on-track' ? 'On Track' : outcome.status === 'at-risk' ? 'At Risk' : 'Behind';

            return [
              new Paragraph({
                text: `Outcome ${index + 1}: ${outcome.name}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Owner: ', bold: true }),
                  new TextRun({ text: `${outcome.owner} | ` }),
                  new TextRun({ text: 'Progress: ', bold: true }),
                  new TextRun({ text: `${outcome.progress_percentage}% | ` }),
                  new TextRun({ text: 'Status: ', bold: true }),
                  new TextRun({
                    text: statusText,
                    color: outcome.status === 'on-track' ? GREEN : outcome.status === 'at-risk' ? YELLOW : 'EF4444',
                    bold: true,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                text: descriptions[outcome.id] || 'This strategic outcome drives critical capabilities for achieving our 2030 ambition.',
                spacing: { after: 200 },
              }),
            ];
          }),

          // ==================== 2026 PRIORITIES ====================
          new Paragraph({
            text: '2026 Execution Priorities',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: 'Strategy execution requires translating strategic outcomes into specific, time-bound initiatives. Our 2026 priorities represent the critical path to achieving our strategic outcomes. Each priority has clear deliverables, timelines, and accountability.',
            spacing: { after: 300 },
          }),

          // Priorities by quarter
          new Paragraph({
            text: 'Current Priority Status',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Total Priorities: ', bold: true }),
              new TextRun({ text: `${prioritiesData.length} | ` }),
              new TextRun({ text: 'Completed: ', bold: true }),
              new TextRun({ text: `${prioritiesData.filter((p: any) => p.status === 'completed').length} | `, color: GREEN }),
              new TextRun({ text: 'In Progress: ', bold: true }),
              new TextRun({ text: `${prioritiesData.filter((p: any) => p.status === 'in-progress').length}`, color: YELLOW }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Key Initiatives',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          // List all priorities
          ...prioritiesData.map((priority: any) => {
            const statusSymbol = priority.status === 'completed' ? '✓' : priority.status === 'in-progress' ? '◷' : '○';
            return new Paragraph({
              text: `${statusSymbol} ${priority.name}`,
              bullet: { level: 0 },
              spacing: { after: 50 },
              children: [
                new TextRun({ text: `${statusSymbol} `, color: priority.status === 'completed' ? GREEN : priority.status === 'in-progress' ? YELLOW : GRAY_DARK }),
                new TextRun({ text: priority.name }),
                new TextRun({ text: ` (${priority.completion_percentage}% complete)`, italics: true, color: GRAY_DARK }),
              ],
            });
          }),

          // ==================== CONSTRAINTS & CHALLENGES ====================
          new Paragraph({
            text: 'Constraints & Challenges',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: 'Honest assessment of constraints is essential to developing realistic execution plans. The following challenges must be addressed to achieve our strategic ambition:',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Speed & Agility',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Speed & Agility: ', bold: true }),
              new TextRun({ text: 'We are slow in developing, formulating, and commercializing products. Complex approval processes, unclear decision rights, and risk-averse culture create delays that allow competitors to reach market first.' }),
            ],
          }),
          new Paragraph({
            text: 'Customer Alignment',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Customer Alignment: ', bold: true }),
              new TextRun({ text: 'Our focus is sometimes misaligned with customers\' optimization and cost realities. We need to better understand total cost of ownership and demonstrate value beyond product specifications.' }),
            ],
          }),
          new Paragraph({
            text: 'Digital Maturity',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Digital Maturity: ', bold: true }),
              new TextRun({ text: 'Digital enablement is patchy—stronger in North America Land, weak in Rest of World. Inconsistent digital capabilities limit our ability to deliver integrated solutions and data-driven insights.' }),
            ],
          }),
          new Paragraph({
            text: 'Integrated Solutions Capability',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Integrated Solutions Capability: ', bold: true }),
              new TextRun({ text: 'We have had limited success selling integrated solutions. Sales teams are trained to sell products, not outcomes. Compensation structures and customer engagement models need to evolve.' }),
            ],
          }),
          new Paragraph({
            text: 'Innovation Pipeline',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Innovation Pipeline: ', bold: true }),
              new TextRun({ text: 'We struggle with innovation from inception through development, launch, and selling. Unclear ownership, inadequate resourcing, and weak commercial translation limit innovation impact.' }),
            ],
          }),
          new Paragraph({
            text: 'Marketing Effectiveness',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Marketing Effectiveness: ', bold: true }),
              new TextRun({ text: 'Marketing is not perceived as a growth driver. Stronger market intelligence, competitive positioning, and go-to-market execution are needed to achieve growth ambition.' }),
            ],
          }),
          new Paragraph({
            text: 'Portfolio Management',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Portfolio Management: ', bold: true }),
              new TextRun({ text: 'No clear stewardship of strategic product line needs or portfolio accountability. Product decisions are reactive rather than strategic, resulting in portfolio complexity.' }),
            ],
          }),
          new Paragraph({
            text: 'RD&E Responsiveness',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'RD&E Responsiveness: ', bold: true }),
              new TextRun({ text: 'RD&E responsiveness is inconsistent and collaboration can be difficult. Clearer service level agreements and better integration with business needs would improve outcomes.' }),
            ],
          }),
          new Paragraph({
            text: 'Cross-functional Alignment',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Cross-functional Alignment: ', bold: true }),
              new TextRun({ text: 'Sales and supply chain alignment is weak in some areas. Better coordination would improve customer experience and operational efficiency.' }),
            ],
          }),
          new Paragraph({
            text: 'Recovery Capabilities',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Recovery Capabilities: ', bold: true }),
              new TextRun({ text: 'We are weak on Recovery (P&R) capabilities and support despite this being a high-growth opportunity. Targeted capability building is needed.' }),
            ],
          }),
          new Paragraph({
            text: 'Data-Driven Decision Making',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Data-Driven Decision Making: ', bold: true }),
              new TextRun({ text: 'Data-driven decision-making is underutilized; AI/ML potential untapped. Better data infrastructure and analytics capabilities could significantly improve performance.' }),
            ],
          }),
          new Paragraph({
            text: 'Adjacent Markets',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Adjacent Markets: ', bold: true }),
              new TextRun({ text: 'Adjacent market growth is inhibited by unclear strategy and inadequate focus. Systematic approach to adjacencies would unlock growth opportunities.' }),
            ],
          }),

          // ==================== FOUNDATION & STRENGTHS ====================
          new Paragraph({
            text: 'Foundation & Organizational Strengths',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: 'While we face real constraints, we also possess significant strengths to build upon:',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Deep Customer Centricity',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Deep Customer Centricity: ', bold: true }),
              new TextRun({ text: 'We are deeply customer-centric, grounded in field and application insight. Our technical teams work closely with customers to solve real-world production challenges, building trust and relationships that competitors struggle to replicate.' }),
            ],
          }),
          new Paragraph({
            text: 'Chemistry Expertise',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Chemistry Expertise: ', bold: true }),
              new TextRun({ text: 'Our chemistry expertise is world-class, covering the full spectrum of production chemistry applications. This deep technical knowledge is difficult to replicate and provides sustainable competitive advantage.' }),
            ],
          }),
          new Paragraph({
            text: 'Business Health',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Strong Business Health: ', bold: true }),
              new TextRun({ text: 'We have built strong business health through productivity improvements, continuous improvement culture, and consistent product performance. This operational foundation supports growth investment.' }),
            ],
          }),
          new Paragraph({
            text: 'Global Scale',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Global Scale & Footprint: ', bold: true }),
              new TextRun({ text: 'Our global presence provides access to all major oil and gas basins, supply chain efficiencies, and the ability to support multinational customers across their portfolio.' }),
            ],
          }),
          new Paragraph({
            text: 'Robust Processes',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Robust Processes: ', bold: true }),
              new TextRun({ text: 'Established processes like Product Lifecycle Management (PLCM) and Global Technology and Research System (GTRS) provide structure for managing complexity, though they need to be applied more consistently.' }),
            ],
          }),
          new Paragraph({
            text: 'Innovation Capability',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Innovation Capability: ', bold: true }),
              new TextRun({ text: 'We are capable of iterative innovation and maintain market leadership in Production (P&R). This demonstrates our ability to continuously improve and adapt offerings to market needs.' }),
            ],
          }),
          new Paragraph({
            text: 'Collaborative Culture',
            bullet: { level: 0 },
            spacing: { after: 100 },
            children: [
              new TextRun({ text: 'Collaborative Culture: ', bold: true }),
              new TextRun({ text: 'Our culture is anchored by collaboration and positive intent. Strong alignment between regions and global Resource Teams enables coordinated execution.' }),
            ],
          }),
          new Paragraph({
            text: 'Data Foundation',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Strong Data Foundation: ', bold: true }),
              new TextRun({ text: 'We have a strong data foundation that can enable smarter, faster decisions. Building analytics and AI/ML capabilities on this foundation represents significant opportunity.' }),
            ],
          }),

          // ==================== EXECUTION ROADMAP ====================
          new Paragraph({
            text: 'Execution Roadmap',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: 'Success requires disciplined execution over multiple years. Our roadmap translates strategic intent into actionable steps with clear accountability and milestones.',
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: '2026: Foundation Year',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: '2026 focuses on building organizational capabilities and establishing execution rhythms. Key priorities include operationalizing strategy through OGSM, redesigning product management, digitizing M&T workflows, and realigning global lab footprint. Success in 2026 creates the foundation for accelerated growth in subsequent years.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: '2027-2028: Scale & Momentum',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: 'The middle years focus on scaling what works and building momentum. This includes launching key new technologies, expanding integrated solutions across more accounts, achieving consistency in digital enablement, and systematically reducing portfolio complexity. Revenue growth accelerates as capabilities mature and market traction builds.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: '2029-2030: Full Potential',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: `The final phase realizes the full potential of our transformed operating model. Integrated solutions become our primary growth engine, digital capabilities are embedded across operations, and innovation cycles are significantly compressed. We achieve $${revenueData.target_amount}M revenue with >5% IBT through a combination of market share gains, margin expansion, and new growth vectors.`,
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: 'Critical Success Factors',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: 'Several factors are critical to successful execution:',
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'Leadership alignment and commitment to strategy through inevitable challenges',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Disciplined resource allocation focused on strategic priorities rather than spreading resources thin',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Consistent measurement and course correction through quarterly strategy reviews',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Building capabilities systematically rather than expecting immediate transformation',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Maintaining focus on outcomes rather than activities, measuring what matters',
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          // ==================== DIGITAL INTEGRATION STRATEGY ====================
          new Paragraph({
            text: 'Digital Integration Strategy',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: 'Digital transformation is not just an enabler of our strategy—it IS our strategy. Every segment goal, every strategic outcome, and every 2026 priority depends on our ability to leverage digital technologies to create differentiated value for customers and competitive advantage in the market.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'The Digital Imperative',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          new Paragraph({
            text: 'The production chemistry industry stands at a digital inflection point. Traditional product-centric models are giving way to data-driven, outcome-based solutions. Customers increasingly demand real-time visibility, predictive insights, and demonstrable value. Competitors are investing heavily in digital capabilities. The window for digital leadership is closing—we must act with urgency.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Our digital integration strategy spans six market segments with tailored approaches recognizing each segment\'s unique characteristics, customer needs, and digital maturity. The strategy is organized around three horizons:',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Horizon 1 (2024-2025): Foundation',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Horizon 1 (2024-2025): Foundation', bold: true }),
              new TextRun({ text: ' - Deploy core digital infrastructure, activate AI/ML models for high-value use cases, establish customer digital touchpoints' }),
            ],
          }),
          new Paragraph({
            text: 'Horizon 2 (2026-2027): Scale',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Horizon 2 (2026-2027): Scale', bold: true }),
              new TextRun({ text: ' - Expand digital capabilities across all segments, integrate cross-segment synergies, achieve measurable customer value' }),
            ],
          }),
          new Paragraph({
            text: 'Horizon 3 (2028-2030): Leadership',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Horizon 3 (2028-2030): Leadership', bold: true }),
              new TextRun({ text: ' - Establish industry-leading digital capabilities, autonomous optimization systems, integrated solutions as primary growth engine' }),
            ],
          }),

          // ========== SEGMENT-SPECIFIC DIGITAL STRATEGIES ==========
          new Paragraph({
            text: 'Segment-Specific Digital Strategies',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          // ONSHORE - Unconventional
          new Paragraph({
            text: 'Onshore - Unconventional ($2.8B Market, 8.5% CAGR)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Digital Maturity: 82/100 (Leading) | Key Challenge: Optimizing EUR while reducing chemical costs',
            spacing: { after: 100 },
            italics: true,
          }),

          new Paragraph({
            text: 'The unconventional segment represents our most digitally mature market. Operators demand real-time optimization, predictive analytics, and demonstrable production gains. Our digital strategy centers on AI-powered optimization that increases EUR by 15-18% while reducing chemical costs by 8-12%.',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Core Digital Enablers:',
            spacing: { after: 50 },
            bold: true,
          }),

          new Paragraph({
            text: 'Shale Production Optimization AI',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Shale Production Optimization AI', bold: true }),
              new TextRun({ text: ' - Machine learning models optimize frac fluid chemistry and pumping schedules. Status: Deployed. ROI: 245%. Business Value: Increase production by 12-18%, reduce chemical costs 8-12%. Integration: Real-time SCADA connectivity, cloud ML infrastructure, automated recommendations.' }),
            ],
          }),

          new Paragraph({
            text: 'Real-time Well Performance Monitoring',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Real-time Well Performance Monitoring', bold: true }),
              new TextRun({ text: ' - IoT sensors and edge computing for continuous performance tracking. Status: Optimized. ROI: 320%. Business Value: 40% faster response time, 25% reduction in unplanned downtime, early issue detection.' }),
            ],
          }),

          new Paragraph({
            text: 'Frac Chemistry Recommendation Engine',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Frac Chemistry Recommendation Engine', bold: true }),
              new TextRun({ text: ' - AI system analyzing geology, water chemistry, and production data. Status: Deployed. ROI: 180%. Business Value: Reduce testing time by 60%, accelerate time-to-production by 2-3 weeks.' }),
            ],
          }),

          new Paragraph({
            text: 'Predictive Maintenance',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Predictive Maintenance', bold: true }),
              new TextRun({ text: ' - Forecast treatment needs before production decline. Status: In Progress. ROI: 195%. Business Value: Prevent 80% of production losses from delayed treatments, optimize inventory.' }),
            ],
          }),

          // ONSHORE - Conventional
          new Paragraph({
            text: 'Onshore - Conventional ($2.8B Market, 3.2% CAGR)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Digital Maturity: 68/100 (Developing) | Key Challenge: Extending field life and improving margins in mature assets',
            spacing: { after: 100 },
            italics: true,
          }),

          new Paragraph({
            text: 'Mature conventional fields face declining production and rising costs. Digital technologies offer opportunities to extend field life by 3-5 years and increase recovery factors by 5-8% through mature field revitalization analytics and production chemistry optimization.',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Core Digital Enablers:',
            spacing: { after: 50 },
            bold: true,
          }),

          new Paragraph({
            text: 'Digital Twin for Production Chemistry',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Digital Twin for Production Chemistry', bold: true }),
              new TextRun({ text: ' - Simulate chemistry performance under various conditions. Status: Deployed. ROI: 140%. Business Value: Optimize dosing reducing costs 15-20%, improve separation efficiency 10%.' }),
            ],
          }),

          new Paragraph({
            text: 'Corrosion Prediction Models',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Corrosion Prediction Models', bold: true }),
              new TextRun({ text: ' - ML models predicting corrosion rates and optimizing inhibitor programs. Status: Deployed. ROI: 220%. Business Value: Reduce failures by 70%, extend equipment life by 40%.' }),
            ],
          }),

          new Paragraph({
            text: 'Mature Field Revitalization Analytics',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Mature Field Revitalization Analytics', bold: true }),
              new TextRun({ text: ' - Platform identifying optimization opportunities. Status: In Progress. ROI: 165%. Business Value: Extend field life 3-5 years, increase recovery factor 5-8%.' }),
            ],
          }),

          // OFFSHORE
          new Paragraph({
            text: 'Offshore ($3.2B Market, 4.2% CAGR)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Digital Maturity: 75/100 (Advanced) | Key Challenge: Preventing costly flow assurance failures ($50M+ per incident)',
            spacing: { after: 100 },
            italics: true,
          }),

          new Paragraph({
            text: 'Offshore operations present the highest stakes and greatest digital opportunities. With daily operating costs exceeding $500K and flow assurance failures costing $50M+, digital technologies that prevent shutdowns and enable remote operations deliver extraordinary value.',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Core Digital Enablers:',
            spacing: { after: 50 },
            bold: true,
          }),

          new Paragraph({
            text: 'Deepwater Flow Assurance Modeling',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Deepwater Flow Assurance Modeling', bold: true }),
              new TextRun({ text: ' - Advanced multiphase flow simulation with real-time chemical injection optimization. Status: Deployed. ROI: 420%. Business Value: Prevent $50M+ failures, optimize chemical usage 30%.' }),
            ],
          }),

          new Paragraph({
            text: 'Remote Monitoring and Diagnostics',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Remote Monitoring and Diagnostics', bold: true }),
              new TextRun({ text: ' - Satellite-enabled monitoring of subsea systems. Status: Optimized. ROI: 380%. Business Value: Reduce offshore visits 60%, enable predictive maintenance, improve safety.' }),
            ],
          }),

          new Paragraph({
            text: 'AI-Powered Subsea Chemical Injection',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'AI-Powered Subsea Chemical Injection', bold: true }),
              new TextRun({ text: ' - Dosing control based on real-time conditions. Status: Deployed. ROI: 290%. Business Value: Reduce chemical consumption 25-35%, prevent overdosing.' }),
            ],
          }),

          // RECOVERY (EOR/IOR)
          new Paragraph({
            text: 'Recovery - EOR/IOR ($2.1B Market, 6.8% CAGR)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Digital Maturity: 71/100 (Advanced) | Key Challenge: Reducing uncertainty in incremental recovery estimates',
            spacing: { after: 100 },
            italics: true,
          }),

          new Paragraph({
            text: 'Enhanced oil recovery projects require high upfront investment ($100M+) with long timelines (5-10 years). Digital technologies reduce uncertainty by 40%, accelerate formulation development by 70%, and optimize flood design to increase recovery by 8-12%.',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Core Digital Enablers:',
            spacing: { after: 50 },
            bold: true,
          }),

          new Paragraph({
            text: 'Reservoir Simulation Integration',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Reservoir Simulation Integration', bold: true }),
              new TextRun({ text: ' - Direct integration between chemical EOR planning and reservoir simulation. Status: In Progress. ROI: 340%. Business Value: Optimize flood design increasing recovery 8-12%, reduce chemical costs 15%.' }),
            ],
          }),

          new Paragraph({
            text: 'Polymer/Surfactant Optimization Algorithms',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Polymer/Surfactant Optimization Algorithms', bold: true }),
              new TextRun({ text: ' - AI algorithms optimizing formulations for reservoir conditions. Status: Deployed. ROI: 275%. Business Value: Accelerate development 70%, increase incremental recovery 10%.' }),
            ],
          }),

          new Paragraph({
            text: 'CO2 EOR Monitoring Systems',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'CO2 EOR Monitoring Systems', bold: true }),
              new TextRun({ text: ' - Comprehensive CO2 flooding monitoring with real-time optimization. Status: Deployed. ROI: 310%. Business Value: Improve CO2 utilization 20%, reduce losses, track sequestration.' }),
            ],
          }),

          // MIDSTREAM
          new Paragraph({
            text: 'Midstream ($1.8B Market, 5.1% CAGR)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Digital Maturity: 65/100 (Developing) | Key Challenge: Pipeline capacity constraints and integrity management',
            spacing: { after: 100 },
            italics: true,
          }),

          new Paragraph({
            text: 'Midstream operators face capacity constraints, aging infrastructure, and complex quality specifications. Digital technologies increase pipeline throughput by 8-12%, prevent integrity failures (reducing incidents by 75%), and optimize logistics costs by 25%.',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Core Digital Enablers:',
            spacing: { after: 50 },
            bold: true,
          }),

          new Paragraph({
            text: 'Pipeline Integrity Analytics',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Pipeline Integrity Analytics', bold: true }),
              new TextRun({ text: ' - AI-powered analytics predicting corrosion, wear, and treatment needs. Status: In Progress. ROI: 265%. Business Value: Prevent pipeline failures, reduce integrity incidents 75%.' }),
            ],
          }),

          new Paragraph({
            text: 'Custody Transfer Optimization',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Custody Transfer Optimization', bold: true }),
              new TextRun({ text: ' - Platform optimizing blend quality and throughput. Status: Deployed. ROI: 190%. Business Value: Increase throughput 8-12%, improve blend quality, reduce giveaway.' }),
            ],
          }),

          new Paragraph({
            text: 'Logistics and Supply Chain AI',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Logistics and Supply Chain AI', bold: true }),
              new TextRun({ text: ' - AI-powered logistics optimization for chemical delivery. Status: In Progress. ROI: 120%. Business Value: Reduce logistics costs 25%, minimize stockouts.' }),
            ],
          }),

          // INTEGRATED SOLUTIONS
          new Paragraph({
            text: 'Integrated Solutions ($1.5B Market, 8.5% CAGR - Highest Growth)',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Digital Maturity: 88/100 (Industry Leading) | Key Challenge: Orchestrating complex multi-segment solutions',
            spacing: { after: 100 },
            italics: true,
          }),

          new Paragraph({
            text: 'Integrated Solutions represents the convergence of our digital capabilities across all segments. This is where chemistry expertise meets digital technology to create differentiated, outcome-based customer relationships. Digital enables the cross-segment synergy identification that unlocks 15-20% additional value.',
            spacing: { after: 100 },
          }),

          new Paragraph({
            text: 'Core Digital Enablers:',
            spacing: { after: 50 },
            bold: true,
          }),

          new Paragraph({
            text: 'Cross-Segment Synergy Platform',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Cross-Segment Synergy Platform', bold: true }),
              new TextRun({ text: ' - AI platform identifying opportunities to combine solutions. Status: Optimized. ROI: 450%. Business Value: Unlock 15-20% additional value, improve retention.' }),
            ],
          }),

          new Paragraph({
            text: 'Performance-Based Contract Analytics',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Performance-Based Contract Analytics', bold: true }),
              new TextRun({ text: ' - Platform enabling outcome-based pricing with real-time monitoring. Status: Deployed. ROI: 385%. Business Value: Enable outcome contracts, differentiate from competitors, increase contract value 25%.' }),
            ],
          }),

          new Paragraph({
            text: 'Total Cost of Ownership Calculators',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Total Cost of Ownership Calculators', bold: true }),
              new TextRun({ text: ' - Interactive tools demonstrating TCO advantages. Status: Deployed. ROI: 320%. Business Value: Improve win rate 35%, justify premium pricing.' }),
            ],
          }),

          // ========== DIGITAL ROADMAP ==========
          new Paragraph({
            text: 'Digital Implementation Roadmap',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            pageBreakBefore: true,
          }),

          new Paragraph({
            text: 'Our digital transformation follows a phased approach balancing quick wins with foundational infrastructure investments. Each phase builds upon the previous, creating cumulative value while maintaining operational stability.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Phase 1: Foundation (Q1-Q2 2024) - COMPLETED',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Status: 100% Complete | Investment: $15.2M | Delivered Value: $24.8M',
            spacing: { after: 100 },
            italics: true,
            children: [
              new TextRun({ text: 'Status: 100% Complete | Investment: $15.2M | Delivered Value: $24.8M', italics: true, color: GREEN }),
            ],
          }),

          new Paragraph({
            text: 'Phase 1 established the digital foundation across all segments. Cloud data platform deployed, market intelligence aggregation activated, competitor monitoring covering 18 companies, and core analytics engine processing real-time data. This phase proved digital ROI potential and built organizational confidence.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Phase 2: Segment Activation (Q3-Q4 2024) - IN PROGRESS',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Status: 78% Complete | Investment: $32.5M | Expected Value: $89.3M',
            spacing: { after: 100 },
            italics: true,
            children: [
              new TextRun({ text: 'Status: 78% Complete | Investment: $32.5M | Expected Value: $89.3M', italics: true, color: YELLOW }),
            ],
          }),

          new Paragraph({
            text: 'Phase 2 deploys segment-specific digital tools and activates AI/ML models. Onshore digital tools operational, offshore remote monitoring live, customer portal serving 50+ accounts. Remaining work focuses on midstream analytics deployment and customer portal enhancement.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Phase 3: Advanced Capabilities (Q1-Q2 2025) - PLANNED',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Planned Investment: $45.8M | Expected Value: $182.4M | Target ROI: 298%',
            spacing: { after: 100 },
            italics: true,
          }),

          new Paragraph({
            text: 'Phase 3 expands AI/ML models across all segments, launches predictive maintenance capabilities reducing downtime by 30%, activates cross-segment synergy tools, and implements performance optimization engines. This phase transforms digital from tool to competitive advantage.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Phase 4: Full Integration (Q3-Q4 2025) - PLANNED',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          }),

          new Paragraph({
            text: 'Planned Investment: $38.2M | Expected Value: $195.8M | Target ROI: 412%',
            spacing: { after: 100 },
            italics: true,
          }),

          new Paragraph({
            text: 'Phase 4 achieves full digital integration with integrated solutions platform serving 100+ accounts, autonomous recommendation engines, real-time market adaptation, and fully automated competitive intelligence. Digital becomes the primary driver of customer value and competitive differentiation.',
            spacing: { after: 200 },
          }),

          // ========== INVESTMENT ANALYSIS ==========
          new Paragraph({
            text: 'Digital Investment Analysis',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          new Paragraph({
            text: 'Total Digital Investment (2024-2025): $131.7M | Expected Return: $492.3M | Blended ROI: 274%',
            spacing: { after: 100 },
            bold: true,
          }),

          new Paragraph({
            text: 'Our digital investments deliver returns through three value streams: cost savings (42%), revenue growth (37%), and risk reduction (21%). Every dollar invested in digital transformation returns $3.74 through measurable business impact.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Top Digital Investments by ROI:',
            spacing: { after: 50 },
            bold: true,
          }),

          new Paragraph({
            text: 'Integrated Solutions Platform',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '1. Integrated Solutions Platform', bold: true }),
              new TextRun({ text: ' - Investment: $28.5M | Return: $128.3M | ROI: 350% | Payback: 4 months | Status: Deployed' }),
            ],
          }),

          new Paragraph({
            text: 'Offshore Remote Monitoring',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '2. Offshore Remote Monitoring', bold: true }),
              new TextRun({ text: ' - Investment: $22.0M | Return: $83.6M | ROI: 280% | Payback: 5 months | Status: Optimized' }),
            ],
          }),

          new Paragraph({
            text: 'Shale Production Optimization AI',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '3. Shale Production Optimization AI', bold: true }),
              new TextRun({ text: ' - Investment: $15.5M | Return: $38.0M | ROI: 145% | Payback: 8 months | Status: Deployed' }),
            ],
          }),

          new Paragraph({
            text: 'EOR Reservoir Simulation',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: '4. EOR Reservoir Simulation', bold: true }),
              new TextRun({ text: ' - Investment: $12.8M | Return: $43.5M | ROI: 240% | Payback: 6 months | Status: In Progress' }),
            ],
          }),

          new Paragraph({
            text: 'Market Intelligence Platform',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: '5. Market Intelligence Platform', bold: true }),
              new TextRun({ text: ' - Investment: $5.8M | Return: $17.4M | ROI: 200% | Payback: 6 months | Status: Optimized' }),
            ],
          }),

          // ========== CROSS-SEGMENT SYNERGIES ==========
          new Paragraph({
            text: 'Cross-Segment Digital Synergies',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          new Paragraph({
            text: 'Digital technologies enable unprecedented cross-segment synergy realization. AI algorithms identify 127+ synergy opportunities worth $175M+ in combined value. Technology developed for one segment adapts to others, intelligence flows seamlessly across boundaries, and integrated solutions leverage the full portfolio.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Key Synergy Realizations:',
            spacing: { after: 50 },
            bold: true,
          }),

          new Paragraph({
            text: 'Integrated Shale Development Programs',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Integrated Shale Development Programs', bold: true }),
              new TextRun({ text: ' - Combining unconventional optimization AI with integrated solutions platform. Value: $22.5M. Status: Realized. Impact: Comprehensive well-to-facility optimization.' }),
            ],
          }),

          new Paragraph({
            text: 'Bundled EOR Project Solutions',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Bundled EOR Project Solutions', bold: true }),
              new TextRun({ text: ' - Combining recovery chemistry optimization with integrated solutions platform. Value: $18.0M. Status: Identified. Impact: End-to-end EOR project digital management.' }),
            ],
          }),

          new Paragraph({
            text: 'Full-Field Mature Asset Management',
            bullet: { level: 0 },
            spacing: { after: 50 },
            children: [
              new TextRun({ text: 'Full-Field Mature Asset Management', bold: true }),
              new TextRun({ text: ' - Combining conventional field analytics with integrated solutions approach. Value: $16.5M. Status: Realized. Impact: Extended field life and improved economics.' }),
            ],
          }),

          new Paragraph({
            text: 'Cross-Segment Performance Benchmarking',
            bullet: { level: 0 },
            spacing: { after: 200 },
            children: [
              new TextRun({ text: 'Cross-Segment Performance Benchmarking', bold: true }),
              new TextRun({ text: ' - Intelligence sharing between offshore and integrated solutions. Value: $15.5M. Status: Realized. Impact: Optimization insights improving offshore operations.' }),
            ],
          }),

          // ========== COMPETITIVE ADVANTAGE ==========
          new Paragraph({
            text: 'Digital Competitive Positioning',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          new Paragraph({
            text: 'Our digital maturity score of 76/100 positions us favorably against competitors. We lead in integrated solutions (88/100) and unconventional (82/100), while competitors like Halliburton (85/100) and Baker Hughes (82/100) focus narrowly. Our advantage lies in cross-segment integration and outcome-based analytics.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Competitive Differentiation Through Digital:',
            spacing: { after: 100 },
            bold: true,
          }),

          new Paragraph({
            text: 'Industry-leading integrated solutions platform serving 100+ accounts with outcome-based contracts',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Cross-segment synergy identification AI unlocking 15-20% additional value versus single-segment competitors',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Real-time market intelligence platform providing competitive advantage in strategic positioning',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Comprehensive digital maturity across all six segments versus competitors\' narrow focus',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Proven ROI track record (274% blended) demonstrating measurable customer value',
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),

          // ========== RISKS AND MITIGATION ==========
          new Paragraph({
            text: 'Digital Risk Mitigation',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          new Paragraph({
            text: 'Digital transformation introduces new risks while mitigating traditional ones. Our strategy explicitly addresses cybersecurity (high priority), technology obsolescence (continuous innovation), customer adoption (change management), and organizational capability (talent development).',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: 'Key Risk Mitigation Strategies:',
            spacing: { after: 100 },
            bold: true,
          }),

          new Paragraph({
            text: 'Cybersecurity: AI-powered threat detection with automated response systems, reducing vulnerability exposure by 90%',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Technology Obsolescence: Modular digital architecture enabling rapid technology refresh without disruption',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Customer Adoption: Customer portals and performance tracking improving retention by 35% and satisfaction by 25%',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Operational Failures: Predictive analytics preventing 80% of failures through early detection and intervention',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Regulatory Compliance: Automated compliance tracking reducing violations by 90% and reporting burden by 80%',
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          // ========== DIGITAL SUCCESS METRICS ==========
          new Paragraph({
            text: 'Digital Success Metrics',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),

          new Paragraph({
            text: 'Success requires disciplined measurement across six key performance objectives (KPOs): Market Intelligence Excellence (87/100), Digital Adoption Across Segments (82/100), Competitive Response Acceleration (85/100), Cross-Segment Synergy Realization (78/100), Customer Digital Engagement (72/100 - at risk), and Operational Efficiency Gains (89/100).',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: '2026 Digital Targets:',
            spacing: { after: 100 },
            bold: true,
          }),

          new Paragraph({
            text: 'Digital Maturity: Achieve 85+ average maturity score across all segments (current: 76)',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Customer Adoption: 80% of key accounts actively using digital platforms (current: 58%)',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'ROI Delivery: $250M+ in measurable digital value delivered to customers',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Efficiency Gains: 25% average efficiency improvement across segments (current: 18%)',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Innovation Velocity: 6-month average cycle from concept to deployment (current: 10 months)',
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          // ========== CLOSING STATEMENT ==========
          new Paragraph({
            text: 'Digital transformation is not optional—it is the foundation upon which our 2030 ambition will be achieved. Every revenue dollar, every margin point, and every competitive advantage depends on our ability to leverage digital technologies faster and better than competitors. The investments are substantial, but the returns are compelling. The path is clear. The time to act is now.',
            spacing: { after: 400 },
          }),

          // ==================== CONCLUSION ====================
          new Paragraph({
            text: 'Conclusion & Next Steps',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
          }),
          new Paragraph({
            text: `The path to $${revenueData.target_amount}M by 2030 is clear but demanding. Success requires transforming how we operate, innovate, and serve customers. It requires addressing real constraints while leveraging our significant strengths. Most importantly, it requires disciplined execution of our seven strategic outcomes through specific, time-bound initiatives.`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'This is not just a revenue growth strategy. It is a transformation of PCT\'s business model from product supplier to solutions provider, from reactive to proactive, from manual to digital, from complexity to simplicity. It positions us for sustainable competitive advantage in an evolving market.',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Immediate Next Steps',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            text: 'Communicate this strategy clearly across the organization, ensuring everyone understands how their work contributes',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Address at-risk outcomes with focused intervention plans and additional resources where needed',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Accelerate digital adoption across all regions, particularly in Rest of World markets',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Execute 2026 priority milestones on schedule with clear accountability',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Establish quarterly strategy review rhythm with CTLT to monitor progress and make course corrections',
            bullet: { level: 0 },
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: 'Monitor market dynamics and competitive responses, adjusting strategy as needed',
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: 'The opportunity before us is significant. The strategy is sound. Success now depends on disciplined execution, persistent focus, and the collective commitment of every member of the PCT organization.',
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: '',
            spacing: { after: 400 },
          }),

          new Paragraph({
            text: '---',
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: 'Generated by SLB Strategy AI',
            alignment: AlignmentType.CENTER,
            italics: true,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Document Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
        ],
      }],
    });

    // Generate the Word document
    const buffer = await Packer.toBuffer(doc);

    // Return the file as a download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="SLB-PCT-Strategy-Document-${new Date().toISOString().split('T')[0]}.docx"`,
      },
    });

  } catch (error) {
    console.error('Error generating Word document:', error);
    return NextResponse.json({
      error: 'Failed to generate Word document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
