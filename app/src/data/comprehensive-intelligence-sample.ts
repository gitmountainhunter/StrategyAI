import { MarketIntelligenceData } from '@/types/intelligence';
import { getDateRanges } from '@/lib/dateUtils';

const { today } = getDateRanges();

// Helper to generate date N days ago
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// 80% TRADITIONAL / 20% DIGITAL intelligence items across all segments
export const comprehensiveSampleData: MarketIntelligenceData['currentIntelligence'] = [
  // === OFFSHORE - TRADITIONAL (4 items) ===
  {
    id: 'offshore-001',
    segment: 'offshore',
    title: 'Transocean Secures $1.2B Drilling Contract for Gulf of Mexico Campaign',
    summary: 'Offshore drilling contractor wins multi-year contract with major operator for 8-well deepwater drilling program using ultra-deepwater drillship, expected to begin Q2 2024.',
    source: { name: 'Offshore Technology', url: 'https://www.offshore-technology.com/news', publishedDate: daysAgo(5) },
    publishedDate: daysAgo(5),
    scrapedDate: today.toISOString(),
    category: 'strategic_moves',
    relevanceScore: 91,
    tags: ['Rig Contract', 'Drilling Campaign', 'Offshore', 'Drillship', 'Field Development'],
    isArchived: false,
    citation: { formatted: 'Offshore Technology. "Transocean Gulf of Mexico Contract." ' + new Date(daysAgo(5)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'offshore-002',
    segment: 'offshore',
    title: 'BP Approves $4.5B Subsea Development for North Sea Field',
    summary: 'Energy major gives final investment decision for major subsea tie-back project, including 12 production wells, manifolds, and 45km flowlines to existing platform infrastructure.',
    source: { name: 'Offshore Magazine', url: 'https://www.offshore-mag.com', publishedDate: daysAgo(25) },
    publishedDate: daysAgo(25),
    scrapedDate: today.toISOString(),
    category: 'case_study',
    relevanceScore: 93,
    tags: ['FID', 'Subsea Installation', 'Field Development', 'Flowline', 'Manifold'],
    isArchived: false,
    citation: { formatted: 'Offshore Magazine. "BP North Sea FID Approval." ' + new Date(daysAgo(25)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'offshore-003',
    segment: 'offshore',
    title: 'SLB Wins $380M Contract for Offshore Chemical Injection Systems',
    summary: 'Service provider secures multi-year agreement to supply corrosion and scale inhibitors for deepwater FPSO operations, including subsea chemical injection infrastructure and MEG recovery systems.',
    source: { name: 'Offshore Energy', url: 'https://www.offshore-energy.biz', publishedDate: daysAgo(45) },
    publishedDate: daysAgo(45),
    scrapedDate: today.toISOString(),
    category: 'product_launch',
    relevanceScore: 87,
    tags: ['Subsea Chemical Injection', 'Corrosion Inhibitor', 'Scale Inhibitor', 'FPSO', 'Hydrate Inhibitor'],
    isArchived: false,
    citation: { formatted: 'Offshore Energy. "SLB Chemical Systems Contract." ' + new Date(daysAgo(45)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'offshore-004',
    segment: 'offshore',
    title: 'Equinor Completes Major Well Intervention Campaign on Troll Field',
    summary: 'Norwegian operator successfully concludes 18-well workover program using semisubmersible rig, restoring production capacity and extending field life by 5+ years through enhanced completion systems.',
    source: { name: 'World Oil', url: 'https://www.worldoil.com', publishedDate: daysAgo(70) },
    publishedDate: daysAgo(70),
    scrapedDate: today.toISOString(),
    category: 'case_study',
    relevanceScore: 89,
    tags: ['Well Intervention', 'Semisubmersible', 'Offshore Platform', 'Production', 'Subsea Tree'],
    isArchived: false,
    citation: { formatted: 'World Oil. "Equinor Troll Intervention Success." ' + new Date(daysAgo(70)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },

  // === ONSHORE - TRADITIONAL (4 items) ===
  {
    id: 'onshore-001',
    segment: 'onshore',
    title: 'Permian Basin Drilling Permits Surge 35% in Q4 2024',
    summary: 'Texas Railroad Commission reports significant increase in horizontal drilling permit applications across Midland and Delaware basins, driven by improved oil prices and well economics.',
    source: { name: 'American Oil & Gas Reporter', url: 'https://www.aogr.com', publishedDate: daysAgo(12) },
    publishedDate: daysAgo(12),
    scrapedDate: today.toISOString(),
    category: 'market_analysis',
    relevanceScore: 88,
    tags: ['Drilling Permit', 'Permian Basin', 'Horizontal Well', 'Basin Activity', 'Onshore'],
    isArchived: false,
    citation: { formatted: 'American Oil & Gas Reporter. "Permian Permit Surge Q4." ' + new Date(daysAgo(12)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'onshore-002',
    segment: 'onshore',
    title: 'Pioneer Natural Resources Completes 127-Well Completion Program',
    summary: 'Major Permian operator finishes massive hydraulic fracturing campaign using high-intensity proppant loadings and friction reducer technology, achieving record EUR per well.',
    source: { name: 'World Oil', url: 'https://www.worldoil.com', publishedDate: daysAgo(30) },
    publishedDate: daysAgo(30),
    scrapedDate: today.toISOString(),
    category: 'case_study',
    relevanceScore: 92,
    tags: ['Well Completion', 'Hydraulic Fracturing', 'Proppant', 'Friction Reducer', 'Stimulation'],
    isArchived: false,
    citation: { formatted: 'World Oil. "Pioneer Completion Campaign Success." ' + new Date(daysAgo(30)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'onshore-003',
    segment: 'onshore',
    title: 'Baker Hughes Launches Enhanced Scale Inhibitor for Bakken Operations',
    summary: 'Oilfield services company introduces new chemical treatment program specifically designed for high-TDS produced water, reducing scale deposition by 85% in Bakken horizontal wells.',
    source: { name: 'Journal of Petroleum Technology', url: 'https://jpt.spe.org', publishedDate: daysAgo(55) },
    publishedDate: daysAgo(55),
    scrapedDate: today.toISOString(),
    category: 'product_launch',
    relevanceScore: 86,
    tags: ['Scale Inhibitor', 'Bakken', 'Production', 'Clay Stabilizer', 'Onshore'],
    isArchived: false,
    citation: { formatted: 'Journal of Petroleum Technology. "Baker Hughes Bakken Scale Program." ' + new Date(daysAgo(55)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'onshore-004',
    segment: 'onshore',
    title: 'Diamondback Energy Expands ESP Deployment Across Midland Basin',
    summary: 'Permian pure-play completes installation of 245 electric submersible pumps to optimize artificial lift performance, reducing operating costs per barrel by 18%.',
    source: { name: 'Rigzone', url: 'https://www.rigzone.com', publishedDate: daysAgo(80) },
    publishedDate: daysAgo(80),
    scrapedDate: today.toISOString(),
    category: 'case_study',
    relevanceScore: 85,
    tags: ['ESP', 'Artificial Lift', 'Production', 'Permian Basin', 'Workover'],
    isArchived: false,
    citation: { formatted: 'Rigzone. "Diamondback ESP Expansion." ' + new Date(daysAgo(80)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },

  // === MIDSTREAM - TRADITIONAL (4 items) ===
  {
    id: 'midstream-001',
    segment: 'midstream',
    title: 'Energy Transfer Announces $2.1B Permian Basin Pipeline Expansion',
    summary: 'Major midstream operator begins construction on 425-mile natural gas transmission pipeline with 2.5 Bcf/d capacity, including three new compression stations and 12 receipt points.',
    source: { name: 'Pipeline & Gas Journal', url: 'https://www.pipelineandgasjournal.com', publishedDate: daysAgo(18) },
    publishedDate: daysAgo(18),
    scrapedDate: today.toISOString(),
    category: 'strategic_moves',
    relevanceScore: 94,
    tags: ['Pipeline', 'Capacity Expansion', 'Compression Station', 'Midstream', 'Transmission Pipeline'],
    isArchived: false,
    citation: { formatted: 'Pipeline & Gas Journal. "Energy Transfer Pipeline Expansion." ' + new Date(daysAgo(18)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'midstream-002',
    segment: 'midstream',
    title: 'Cheniere Energy Completes Corpus Christi LNG Train 3',
    summary: 'Export facility brings online third liquefaction train adding 4.5 MTPA capacity, with fully integrated storage, loading, and natural gas processing infrastructure.',
    source: { name: 'Natural Gas Intelligence', url: 'https://www.naturalgasintel.com', publishedDate: daysAgo(42) },
    publishedDate: daysAgo(42),
    scrapedDate: today.toISOString(),
    category: 'product_launch',
    relevanceScore: 91,
    tags: ['LNG Terminal', 'Liquefaction', 'Export Terminal', 'Storage Facility', 'Processing Plant'],
    isArchived: false,
    citation: { formatted: 'Natural Gas Intelligence. "Cheniere Train 3 Completion." ' + new Date(daysAgo(42)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'midstream-003',
    segment: 'midstream',
    title: 'ONEOK Deploys Advanced Drag Reducer Program Across Pipeline Network',
    summary: 'Midstream giant implements new flow improver chemical injection systems across 8,000 miles of crude oil pipelines, increasing throughput capacity by 12% without compression upgrades.',
    source: { name: 'Oil & Gas Journal', url: 'https://www.ogj.com', publishedDate: daysAgo(65) },
    publishedDate: daysAgo(65),
    scrapedDate: today.toISOString(),
    category: 'case_study',
    relevanceScore: 87,
    tags: ['Drag Reducer', 'Pipeline', 'Throughput', 'Midstream', 'Compression Optimization'],
    isArchived: false,
    citation: { formatted: 'Oil & Gas Journal. "ONEOK Drag Reducer Success." ' + new Date(daysAgo(65)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'midstream-004',
    segment: 'midstream',
    title: 'Williams Companies Completes $950M NGL Fractionation Expansion',
    summary: 'Major processor adds 150,000 barrels per day fractionation capacity in Mont Belvieu hub, with new storage tanks, rail loading, and marine export facilities.',
    source: { name: 'Pipeline Technology Journal', url: 'https://www.pipeline-journal.net', publishedDate: daysAgo(95) },
    publishedDate: daysAgo(95),
    scrapedDate: today.toISOString(),
    category: 'strategic_moves',
    relevanceScore: 89,
    tags: ['Fractionation', 'NGL', 'Storage Facility', 'Processing Plant', 'Capacity Expansion'],
    isArchived: false,
    citation: { formatted: 'Pipeline Technology Journal. "Williams Fractionation Expansion." ' + new Date(daysAgo(95)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },

  // === RECOVERY - TRADITIONAL (4 items) ===
  {
    id: 'recovery-001',
    segment: 'recovery',
    title: 'Occidental Launches $680M Polymer Flood Expansion in Permian Basin',
    summary: 'Major operator initiates large-scale polymer injection program across 45 mature waterflood patterns, using HPAM and crosslinked polymer systems to improve sweep efficiency and boost recovery factors.',
    source: { name: 'SPE Journal', url: 'https://www.spe.org', publishedDate: daysAgo(22) },
    publishedDate: daysAgo(22),
    scrapedDate: today.toISOString(),
    category: 'strategic_moves',
    relevanceScore: 95,
    tags: ['Polymer Flood', 'Polymer', 'EOR', 'Conformance Control', 'Recovery Factor'],
    isArchived: false,
    citation: { formatted: 'SPE Journal. "Occidental Polymer Flood Expansion." ' + new Date(daysAgo(22)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'recovery-002',
    segment: 'recovery',
    title: 'Chevron Reports Successful CO2 Injection Pilot in Wyoming Field',
    summary: 'Major shows 22% incremental oil recovery from 18-month CO2 flood pilot using WAG injection strategy, with plans to expand across 12 additional patterns targeting 45 MMbbl reserves.',
    source: { name: 'Journal of Petroleum Technology', url: 'https://jpt.spe.org', publishedDate: daysAgo(48) },
    publishedDate: daysAgo(48),
    scrapedDate: today.toISOString(),
    category: 'case_study',
    relevanceScore: 92,
    tags: ['CO2 Injection', 'Pilot Program', 'WAG', 'Miscible Flood', 'Enhanced Oil Recovery'],
    isArchived: false,
    citation: { formatted: 'Journal of Petroleum Technology. "Chevron CO2 Pilot Success." ' + new Date(daysAgo(48)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'recovery-003',
    segment: 'recovery',
    title: 'SLB Introduces Advanced Surfactant Package for ASP Flooding',
    summary: 'Service provider launches new alkaline-surfactant-polymer chemistry designed for high-salinity reservoirs, achieving ultra-low interfacial tension and improved oil displacement in laboratory tests.',
    source: { name: 'Petroleum Economist', url: 'https://www.petroleum-economist.com', publishedDate: daysAgo(75) },
    publishedDate: daysAgo(75),
    scrapedDate: today.toISOString(),
    category: 'product_launch',
    relevanceScore: 88,
    tags: ['Surfactant', 'ASP Flood', 'Surfactant Flood', 'Mobility Control', 'EOR'],
    isArchived: false,
    citation: { formatted: 'Petroleum Economist. "SLB ASP Chemistry Launch." ' + new Date(daysAgo(75)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'recovery-004',
    segment: 'recovery',
    title: 'Husky Energy Expands SAGD Operations with New Steam Generation Facility',
    summary: 'Canadian heavy oil producer brings online 50,000 bbl/d steam-assisted gravity drainage project, featuring three wellpad pairs and advanced water treatment for steam injection optimization.',
    source: { name: 'Oil & Gas Journal', url: 'https://www.ogj.com', publishedDate: daysAgo(105) },
    publishedDate: daysAgo(105),
    scrapedDate: today.toISOString(),
    category: 'case_study',
    relevanceScore: 86,
    tags: ['SAGD', 'Steam Injection', 'Thermal Recovery', 'Water Injection', 'Production'],
    isArchived: false,
    citation: { formatted: 'Oil & Gas Journal. "Husky SAGD Expansion Success." ' + new Date(daysAgo(105)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },

  // === INTEGRATED SOLUTIONS - TRADITIONAL (4 items) ===
  {
    id: 'integrated-001',
    segment: 'integratedSolutions',
    title: 'Halliburton Wins $1.8B Multi-Year Drilling Services Contract',
    summary: 'Major service provider secures comprehensive drilling and completions services agreement covering 350+ wells across multiple basins, including directional drilling, wireline logging, and cementing operations.',
    source: { name: 'Halliburton News', url: 'https://www.halliburton.com/en/news', publishedDate: daysAgo(8) },
    publishedDate: daysAgo(8),
    scrapedDate: today.toISOString(),
    category: 'strategic_moves',
    relevanceScore: 94,
    tags: ['Service Contract', 'Drilling Services', 'Wireline', 'Completions Services', 'Logging'],
    isArchived: false,
    citation: { formatted: 'Halliburton News. "Multi-Year Drilling Contract Award." ' + new Date(daysAgo(8)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'integrated-002',
    segment: 'integratedSolutions',
    title: 'Baker Hughes Secures 10-Year O&M Contract for North Sea Platforms',
    summary: 'Service company awarded comprehensive operations and maintenance agreement covering five offshore platforms, including all well intervention, workover, and production optimization services.',
    source: { name: 'Baker Hughes News', url: 'https://www.bakerhughes.com/company/news', publishedDate: daysAgo(35) },
    publishedDate: daysAgo(35),
    scrapedDate: today.toISOString(),
    category: 'strategic_moves',
    relevanceScore: 90,
    tags: ['Operations & Maintenance', 'Integrated Project', 'Well Services', 'Production Services', 'Asset Management'],
    isArchived: false,
    citation: { formatted: 'Baker Hughes News. "North Sea O&M Contract Win." ' + new Date(daysAgo(35)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'integrated-003',
    segment: 'integratedSolutions',
    title: 'Weatherford Expands Coiled Tubing Fleet with 25 New Units',
    summary: 'Well services provider adds advanced coiled tubing equipment to support growing intervention and completions demand in unconventional basins, including Permian, Eagle Ford, and Haynesville.',
    source: { name: 'Weatherford News', url: 'https://www.weatherford.com/news', publishedDate: daysAgo(62) },
    publishedDate: daysAgo(62),
    scrapedDate: today.toISOString(),
    category: 'case_study',
    relevanceScore: 85,
    tags: ['Coiled Tubing', 'Intervention Services', 'Well Services', 'Field Services', 'Completions Services'],
    isArchived: false,
    citation: { formatted: 'Weatherford News. "Coiled Tubing Fleet Expansion." ' + new Date(daysAgo(62)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'integrated-004',
    segment: 'integratedSolutions',
    title: 'SLB Launches Comprehensive Chemical Management Program',
    summary: 'Integrated solutions provider introduces end-to-end chemical optimization service covering production chemistry, treatment programs, and dosage control across upstream operations with guaranteed performance metrics.',
    source: { name: 'SLB Newsroom', url: 'https://www.slb.com/newsroom', publishedDate: daysAgo(90) },
    publishedDate: daysAgo(90),
    scrapedDate: today.toISOString(),
    category: 'product_launch',
    relevanceScore: 87,
    tags: ['Chemical Management', 'Chemical Optimization', 'Treatment Programs', 'Specialty Chemicals', 'Production Services'],
    isArchived: false,
    citation: { formatted: 'SLB Newsroom. "Chemical Management Program Launch." ' + new Date(daysAgo(90)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },

  // === DIGITAL INNOVATION (4 items - 20% of total) ===
  {
    id: 'digital-001',
    segment: 'offshore',
    title: 'Shell Implements AI-Powered Subsea Inspection for Deepwater Assets',
    summary: 'Energy major deploys machine learning algorithms for autonomous ROV navigation and real-time anomaly detection across Gulf of Mexico subsea infrastructure, reducing inspection time by 40%.',
    source: { name: 'Offshore Technology', url: 'https://www.offshore-technology.com/news', publishedDate: daysAgo(15) },
    publishedDate: daysAgo(15),
    scrapedDate: today.toISOString(),
    category: 'technology_trend',
    relevanceScore: 89,
    tags: ['AI', 'Subsea', 'Remote Monitoring', 'Offshore', 'Predictive Maintenance'],
    isArchived: false,
    citation: { formatted: 'Offshore Technology. "Shell AI Subsea Inspection." ' + new Date(daysAgo(15)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'digital-002',
    segment: 'onshore',
    title: 'ConocoPhillips Deploys Digital Twin for Permian Well Optimization',
    summary: 'Major operator uses real-time digital twin simulation to optimize completion designs across 450 Permian wells, improving EUR forecasts by 12% and reducing completion costs by 8%.',
    source: { name: 'Journal of Petroleum Technology', url: 'https://jpt.spe.org', publishedDate: daysAgo(38) },
    publishedDate: daysAgo(38),
    scrapedDate: today.toISOString(),
    category: 'technology_trend',
    relevanceScore: 91,
    tags: ['Digital Oilfield', 'Onshore', 'Data Analytics', 'Well Completion', 'Production'],
    isArchived: false,
    citation: { formatted: 'Journal of Petroleum Technology. "ConocoPhillips Digital Twin Success." ' + new Date(daysAgo(38)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'digital-003',
    segment: 'midstream',
    title: 'Kinder Morgan Rolls Out Predictive Maintenance Across Pipeline Network',
    summary: 'Pipeline operator implements IoT sensor network and machine learning analytics across 70,000 miles of infrastructure, predicting equipment failures 30 days in advance with 92% accuracy.',
    source: { name: 'Pipeline & Gas Journal', url: 'https://www.pipelineandgasjournal.com', publishedDate: daysAgo(58) },
    publishedDate: daysAgo(58),
    scrapedDate: today.toISOString(),
    category: 'technology_trend',
    relevanceScore: 88,
    tags: ['Predictive Maintenance', 'Data Analytics', 'Pipeline', 'Midstream', 'Remote Monitoring'],
    isArchived: false,
    citation: { formatted: 'Pipeline & Gas Journal. "Kinder Morgan Predictive Maintenance." ' + new Date(daysAgo(58)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
  {
    id: 'digital-004',
    segment: 'integratedSolutions',
    title: 'SLB Launches AI-Enhanced Drilling Optimization Platform',
    summary: 'Service provider introduces next-generation Delfi platform with generative AI for real-time drilling parameter optimization, automated well planning, and cross-domain decision support across E&P lifecycle.',
    source: { name: 'SLB Newsroom', url: 'https://www.slb.com/newsroom', publishedDate: daysAgo(85) },
    publishedDate: daysAgo(85),
    scrapedDate: today.toISOString(),
    category: 'product_launch',
    relevanceScore: 93,
    tags: ['AI', 'Digital Oilfield', 'Data Analytics', 'Drilling Services', 'Integrated Project'],
    isArchived: false,
    citation: { formatted: 'SLB Newsroom. "AI Drilling Platform Launch." ' + new Date(daysAgo(85)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), linkVerified: true, lastVerified: today.toISOString() }
  },
];

export const marketIntelligenceData: MarketIntelligenceData = {
  lastScraped: today.toISOString(),
  scrapingConfig: {
    rollingWindowDays: 365,
    archiveEnabled: true,
    autoRefreshHours: 24,
    manualRefreshCooldownMinutes: 15,
    maxItemsPerSegment: 100,
    deleteArchivedAfterDays: 1095
  },
  currentIntelligence: comprehensiveSampleData,
  archivedIntelligence: []
};
