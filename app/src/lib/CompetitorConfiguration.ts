/**
 * CompetitorConfiguration.ts
 *
 * Comprehensive competitor tracking configuration for SLB Strategy Agent.
 * Tracks 18 major competitors in the oilfield chemicals and services space.
 *
 * NOTE: ChampionX (previously Nalco Champion) has been REMOVED from this list
 * as SLB acquired ChampionX and they are now part of the same company.
 * DO NOT track ChampionX as a competitor.
 */

export interface CompetitorDetails {
  aliases: string[];
  website: string;
  focus_areas: string[];
  market_position: string;
  estimated_share: string;
  keywords: string[];
}

export const COMPREHENSIVE_COMPETITOR_LIST: Record<string, CompetitorDetails> = {
  'Baker Hughes': {
    aliases: ['Baker Hughes', 'BH', 'BHGE', 'GE Oil & Gas'],
    website: 'https://www.bakerhughes.com',
    focus_areas: ['drilling fluids', 'production chemicals', 'completion fluids', 'stimulation', 'EOR'],
    market_position: 'Leader',
    estimated_share: '23%',
    keywords: [
      'Baker Hughes chemicals',
      'Baker Hughes production',
      'Baker Hughes EOR',
      'Baker Hughes drilling fluids',
      'Baker Hughes polymer',
    ],
  },

  Halliburton: {
    aliases: ['Halliburton', 'HAL'],
    website: 'https://www.halliburton.com',
    focus_areas: ['completion chemicals', 'production chemicals', 'cementing', 'stimulation', 'EOR'],
    market_position: 'Strong #2',
    estimated_share: '19%',
    keywords: [
      'Halliburton chemicals',
      'Halliburton production',
      'Halliburton completion',
      'Halliburton EOR',
      'Halliburton stimulation',
    ],
  },

  Clariant: {
    aliases: ['Clariant', 'Clariant Oil Services'],
    website: 'https://www.clariant.com/en/Business-Units/Oil-and-Mining-Services',
    focus_areas: ['production chemicals', 'drilling additives', 'functional chemicals', 'water treatment'],
    market_position: 'Specialty chemicals leader',
    estimated_share: '8-10%',
    keywords: [
      'Clariant oilfield chemicals',
      'Clariant production chemicals',
      'Clariant oil services',
      'Clariant drilling additives',
      'Clariant water treatment',
      'Clariant demulsifiers',
      'Clariant scale inhibitors',
    ],
  },

  'JACAM Chemical Company': {
    aliases: ['JACAM', 'Jacam Catalyst', 'JACAM Chemical'],
    website: 'https://www.jacam.com',
    focus_areas: ['water treatment', 'production chemicals', 'biocides', 'scale inhibitors', 'specialty chemicals'],
    market_position: 'Regional strong player',
    estimated_share: '3-5%',
    keywords: [
      'JACAM chemicals',
      'JACAM oilfield',
      'JACAM water treatment',
      'JACAM biocides',
      'JACAM production chemicals',
      'JACAM scale inhibitor',
    ],
  },

  Weatherford: {
    aliases: ['Weatherford', 'Weatherford International'],
    website: 'https://www.weatherford.com',
    focus_areas: ['drilling fluids', 'completion fluids', 'cementing', 'stimulation chemicals'],
    market_position: 'Established player',
    estimated_share: '10-12%',
    keywords: [
      'Weatherford chemicals',
      'Weatherford drilling fluids',
      'Weatherford completion',
      'Weatherford cementing',
    ],
  },

  'CES Energy Solutions': {
    aliases: ['CES', 'CES Energy', 'Canadian Energy Services'],
    website: 'https://www.cesenergysolutions.com',
    focus_areas: ['drilling fluids', 'production chemicals', 'cementing', 'stimulation', 'water treatment'],
    market_position: 'North America focused',
    estimated_share: '5-7%',
    keywords: [
      'CES Energy chemicals',
      'CES drilling fluids',
      'CES production chemicals',
      'CES cementing',
      'CES water treatment',
      'Canadian Energy Services',
    ],
  },

  Kemira: {
    aliases: ['Kemira', 'Kemira Oyj'],
    website: 'https://www.kemira.com/industries/oil-and-gas/',
    focus_areas: ['production chemicals', 'water treatment', 'process chemicals'],
    market_position: 'European strong player',
    estimated_share: '4-6%',
    keywords: ['Kemira oilfield', 'Kemira production chemicals', 'Kemira water treatment', 'Kemira oil and gas'],
  },

  BASF: {
    aliases: ['BASF', 'BASF SE'],
    website: 'https://www.basf.com/global/en/who-we-are/organization/divisions/performance-chemicals/oilfield-mining.html',
    focus_areas: ['oilfield chemicals', 'mining chemicals', 'specialty chemicals'],
    market_position: 'Diversified chemical giant',
    estimated_share: '6-8%',
    keywords: [
      'BASF oilfield chemicals',
      'BASF production chemicals',
      'BASF drilling',
      'BASF specialty chemicals oil',
    ],
  },

  'Newpark Resources': {
    aliases: ['Newpark', 'Newpark Fluids Systems'],
    website: 'https://www.newpark.com',
    focus_areas: ['drilling fluids', 'fluid systems', 'environmental solutions'],
    market_position: 'Drilling fluids specialist',
    estimated_share: '3-5%',
    keywords: ['Newpark drilling fluids', 'Newpark Resources', 'Newpark fluids systems', 'Newpark chemicals'],
  },

  'AES Drilling Fluids': {
    aliases: ['AES', 'AES Drilling'],
    website: 'https://www.aesdrillingfluids.com',
    focus_areas: ['drilling fluids', 'drilling additives', 'completion fluids'],
    market_position: 'Specialized provider',
    estimated_share: '2-3%',
    keywords: ['AES drilling fluids', 'AES drilling chemicals', 'AES drilling additives'],
  },

  Innospec: {
    aliases: ['Innospec', 'Innospec Inc'],
    website: 'https://www.innospecinc.com/businesses/oilfield-services/',
    focus_areas: ['fuel additives', 'oilfield chemicals', 'specialty chemicals'],
    market_position: 'Specialty chemicals player',
    estimated_share: '3-4%',
    keywords: ['Innospec oilfield', 'Innospec chemicals', 'Innospec production chemicals'],
  },

  SNF: {
    aliases: ['SNF', 'SNF Floerger'],
    website: 'https://www.snf.com',
    focus_areas: ['polymers', 'flocculants', 'EOR chemicals', 'water treatment'],
    market_position: 'Polymer specialist',
    estimated_share: '4-5%',
    keywords: ['SNF oilfield polymers', 'SNF EOR', 'SNF water treatment', 'SNF Floerger oil'],
  },

  'Stepan Company': {
    aliases: ['Stepan', 'Stepan Company'],
    website: 'https://www.stepan.com/oilfield/',
    focus_areas: ['surfactants', 'EOR chemicals', 'specialty chemicals'],
    market_position: 'Surfactant specialist',
    estimated_share: '2-3%',
    keywords: ['Stepan oilfield', 'Stepan surfactants', 'Stepan EOR', 'Stepan chemicals oil'],
  },

  Solvay: {
    aliases: ['Solvay', 'Solvay SA'],
    website: 'https://www.solvay.com/en/markets/oil-gas',
    focus_areas: ['specialty polymers', 'surfactants', 'drilling chemicals'],
    market_position: 'Diversified chemicals',
    estimated_share: '3-4%',
    keywords: ['Solvay oilfield', 'Solvay oil and gas', 'Solvay drilling chemicals', 'Solvay polymers oil'],
  },

  'Tetra Technologies': {
    aliases: ['Tetra', 'TETRA Technologies', 'TTI'],
    website: 'https://www.tetratec.com',
    focus_areas: ['completion fluids', 'production chemicals', 'water management'],
    market_position: 'Fluids specialist',
    estimated_share: '2-3%',
    keywords: [
      'Tetra Technologies chemicals',
      'Tetra completion fluids',
      'Tetra production chemicals',
      'TETRA oilfield',
    ],
  },

  Evonik: {
    aliases: ['Evonik', 'Evonik Industries'],
    website: 'https://www.evonik.com',
    focus_areas: ['specialty chemicals', 'additives', 'surfactants'],
    market_position: 'Specialty chemicals',
    estimated_share: '2-3%',
    keywords: ['Evonik oilfield', 'Evonik oil and gas', 'Evonik specialty chemicals'],
  },

  Huntsman: {
    aliases: ['Huntsman', 'Huntsman Corporation'],
    website: 'https://www.huntsman.com',
    focus_areas: ['polyurethanes', 'specialty chemicals', 'oilfield chemicals'],
    market_position: 'Diversified chemicals',
    estimated_share: '2-3%',
    keywords: ['Huntsman oilfield', 'Huntsman oil and gas', 'Huntsman chemicals'],
  },

  Nouryon: {
    aliases: ['Nouryon', 'AkzoNobel Specialty Chemicals'],
    website: 'https://www.nouryon.com',
    focus_areas: ['specialty chemicals', 'surfactants', 'chelates'],
    market_position: 'Specialty chemicals',
    estimated_share: '2-3%',
    keywords: ['Nouryon oilfield', 'Nouryon oil and gas', 'Nouryon specialty chemicals'],
  },
};

/**
 * Companies explicitly excluded from competitor tracking
 * (now part of SLB)
 */
export const EXCLUDED_COMPANIES = ['ChampionX', 'Champion Technologies', 'Nalco Champion'];

/**
 * Get all competitor names
 */
export function getAllCompetitorNames(): string[] {
  return Object.keys(COMPREHENSIVE_COMPETITOR_LIST);
}

/**
 * Get competitor details by name
 */
export function getCompetitorDetails(name: string): CompetitorDetails | undefined {
  return COMPREHENSIVE_COMPETITOR_LIST[name];
}

/**
 * Check if a company is an excluded competitor
 */
export function isExcludedCompetitor(name: string): boolean {
  return EXCLUDED_COMPANIES.some((excluded) => name.toLowerCase().includes(excluded.toLowerCase()));
}

/**
 * Get competitors by market position category
 */
export function getCompetitorsByCategory(category: 'leader' | 'specialty' | 'diversified' | 'regional'): string[] {
  return Object.entries(COMPREHENSIVE_COMPETITOR_LIST)
    .filter(([_, details]) => {
      const position = details.market_position.toLowerCase();
      switch (category) {
        case 'leader':
          return position.includes('leader') || position.includes('#2');
        case 'specialty':
          return position.includes('specialty') || position.includes('specialist');
        case 'diversified':
          return position.includes('diversified');
        case 'regional':
          return position.includes('regional') || position.includes('focused');
        default:
          return false;
      }
    })
    .map(([name]) => name);
}

/**
 * Get total number of tracked competitors
 */
export function getTotalCompetitorCount(): number {
  return Object.keys(COMPREHENSIVE_COMPETITOR_LIST).length;
}

export default COMPREHENSIVE_COMPETITOR_LIST;
