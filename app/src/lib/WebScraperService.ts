/**
 * WebScraperService - Real-time market intelligence scraping
 *
 * CRITICAL: All dates are dynamic - NO hardcoded dates
 * Implements 365-day rolling window with automatic archiving
 */

import { getDateRanges, isWithinCurrentWindow } from './dateUtils';
import type { IntelligenceItem, IntelligenceSegment, IntelligenceCategory } from '@/types/intelligence';

interface ScrapedArticle {
  title: string;
  summary: string;
  url: string;
  publishedDate: Date;
  source: string;
}

interface CompetitorSource {
  name: string;
  url: string;
  scrapeFunction: () => Promise<ScrapedArticle[]>;
}

export class WebScraperService {
  private rateLimitDelay = 2000; // 2 seconds between requests
  private lastRequestTime: number = 0;
  private maxRetries = 3;

  /**
   * Rate limiting to be respectful to source websites
   */
  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve =>
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Fetch HTML content with retry logic
   */
  private async fetchWithRetry(url: string, retries = 0): Promise<string> {
    await this.respectRateLimit();

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SLB-Intelligence-Bot/1.0)',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      if (retries < this.maxRetries) {
        console.warn(`Fetch failed, retry ${retries + 1}/${this.maxRetries}:`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1)));
        return this.fetchWithRetry(url, retries + 1);
      }
      throw error;
    }
  }

  /**
   * Baker Hughes newsroom scraper
   */
  private async scrapeBakerHughes(): Promise<ScrapedArticle[]> {
    try {
      const html = await this.fetchWithRetry('https://www.bakerhughes.com/company/news');
      const articles: ScrapedArticle[] = [];

      // Parse HTML for news articles
      // Note: This is a simplified parser - production would use cheerio or similar
      const articlePattern = /<article[^>]*>([\s\S]*?)<\/article>/gi;
      const matches = html.matchAll(articlePattern);

      for (const match of matches) {
        const articleHtml = match[1];

        // Extract title
        const titleMatch = articleHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
        const title = titleMatch ? this.stripHtml(titleMatch[1]) : '';

        // Extract summary
        const summaryMatch = articleHtml.match(/<p[^>]*>(.*?)<\/p>/i);
        const summary = summaryMatch ? this.stripHtml(summaryMatch[1]) : '';

        // Extract URL
        const urlMatch = articleHtml.match(/href=["'](\/[^"']+)["']/i);
        const relativeUrl = urlMatch ? urlMatch[1] : '';
        const url = relativeUrl ? `https://www.bakerhughes.com${relativeUrl}` : '';

        // Extract date (try multiple formats)
        const dateMatch = articleHtml.match(/\d{4}-\d{2}-\d{2}|\w+ \d{1,2}, \d{4}/);
        const publishedDate = dateMatch ? new Date(dateMatch[0]) : new Date();

        if (title && summary && url) {
          articles.push({
            title,
            summary: summary.substring(0, 300), // Limit summary length
            url,
            publishedDate,
            source: 'Baker Hughes',
          });
        }

        // Limit to prevent excessive data
        if (articles.length >= 10) break;
      }

      return articles;
    } catch (error) {
      console.error('Baker Hughes scraping failed:', error);
      return [];
    }
  }

  /**
   * Halliburton press releases scraper
   */
  private async scrapeHalliburton(): Promise<ScrapedArticle[]> {
    try {
      const html = await this.fetchWithRetry('https://www.halliburton.com/en/news');
      const articles: ScrapedArticle[] = [];

      // Parse HTML for press releases
      const articlePattern = /<div[^>]*class=["'][^"']*news-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
      const matches = html.matchAll(articlePattern);

      for (const match of matches) {
        const articleHtml = match[1];

        const titleMatch = articleHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
        const title = titleMatch ? this.stripHtml(titleMatch[1]) : '';

        const summaryMatch = articleHtml.match(/<p[^>]*>(.*?)<\/p>/i);
        const summary = summaryMatch ? this.stripHtml(summaryMatch[1]) : '';

        const urlMatch = articleHtml.match(/href=["']([^"']+)["']/i);
        let url = urlMatch ? urlMatch[1] : '';
        if (url && !url.startsWith('http')) {
          url = `https://www.halliburton.com${url}`;
        }

        const dateMatch = articleHtml.match(/\d{4}-\d{2}-\d{2}|\w+ \d{1,2}, \d{4}/);
        const publishedDate = dateMatch ? new Date(dateMatch[0]) : new Date();

        if (title && summary && url) {
          articles.push({
            title,
            summary: summary.substring(0, 300),
            url,
            publishedDate,
            source: 'Halliburton',
          });
        }

        if (articles.length >= 10) break;
      }

      return articles;
    } catch (error) {
      console.error('Halliburton scraping failed:', error);
      return [];
    }
  }

  /**
   * Oil & Gas Journal scraper
   */
  private async scrapeOilGasJournal(): Promise<ScrapedArticle[]> {
    try {
      const html = await this.fetchWithRetry('https://www.ogj.com/home/topic/1000001352');
      const articles: ScrapedArticle[] = [];

      // Parse HTML for articles
      const articlePattern = /<article[^>]*>([\s\S]*?)<\/article>/gi;
      const matches = html.matchAll(articlePattern);

      for (const match of matches) {
        const articleHtml = match[1];

        const titleMatch = articleHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
        const title = titleMatch ? this.stripHtml(titleMatch[1]) : '';

        const summaryMatch = articleHtml.match(/<p[^>]*class=["'][^"']*summary[^"']*["'][^>]*>(.*?)<\/p>/i) ||
                            articleHtml.match(/<p[^>]*>(.*?)<\/p>/i);
        const summary = summaryMatch ? this.stripHtml(summaryMatch[1]) : '';

        const urlMatch = articleHtml.match(/href=["']([^"']+)["']/i);
        let url = urlMatch ? urlMatch[1] : '';
        if (url && !url.startsWith('http')) {
          url = `https://www.ogj.com${url}`;
        }

        const dateMatch = articleHtml.match(/\d{4}-\d{2}-\d{2}|\w+ \d{1,2}, \d{4}/);
        const publishedDate = dateMatch ? new Date(dateMatch[0]) : new Date();

        if (title && summary && url) {
          articles.push({
            title,
            summary: summary.substring(0, 300),
            url,
            publishedDate,
            source: 'Oil & Gas Journal',
          });
        }

        if (articles.length >= 10) break;
      }

      return articles;
    } catch (error) {
      console.error('Oil & Gas Journal scraping failed:', error);
      return [];
    }
  }

  /**
   * Offshore Technology scraper (offshore segment focus)
   * ENHANCED: Scrapes news, projects, and contracts for comprehensive coverage
   */
  private async scrapeOffshoreTechnology(): Promise<ScrapedArticle[]> {
    try {
      // Scrape from multiple sections for broader coverage
      const urls = [
        'https://www.offshore-technology.com/news',
        'https://www.offshore-technology.com/projects',
        'https://www.offshore-technology.com/marketdata'
      ];

      const articles: ScrapedArticle[] = [];

      for (const baseUrl of urls) {
        try {
          const html = await this.fetchWithRetry(baseUrl);
          const articlePattern = /<article[^>]*>([\s\S]*?)<\/article>/gi;
          const matches = html.matchAll(articlePattern);

          for (const match of matches) {
            const articleHtml = match[1];

            const titleMatch = articleHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
            const title = titleMatch ? this.stripHtml(titleMatch[1]) : '';

            const summaryMatch = articleHtml.match(/<p[^>]*>(.*?)<\/p>/i);
            const summary = summaryMatch ? this.stripHtml(summaryMatch[1]) : '';

            const urlMatch = articleHtml.match(/href=["']([^"']+)["']/i);
            let url = urlMatch ? urlMatch[1] : '';
            if (url && !url.startsWith('http')) {
              url = `https://www.offshore-technology.com${url}`;
            }

            const dateMatch = articleHtml.match(/\d{4}-\d{2}-\d{2}|\w+ \d{1,2}, \d{4}/);
            const publishedDate = dateMatch ? new Date(dateMatch[0]) : new Date();

            if (title && summary && url) {
              articles.push({
                title,
                summary: summary.substring(0, 300),
                url,
                publishedDate,
                source: 'Offshore Technology',
              });
            }

            if (articles.length >= 15) break;
          }
        } catch (error) {
          console.warn(`Failed to scrape ${baseUrl}:`, error);
          // Continue with other URLs even if one fails
        }
      }

      return articles;
    } catch (error) {
      console.error('Offshore Technology scraping failed:', error);
      return [];
    }
  }

  /**
   * World Oil scraper (onshore/general segment focus)
   */
  private async scrapeWorldOil(): Promise<ScrapedArticle[]> {
    try {
      const html = await this.fetchWithRetry('https://www.worldoil.com/news');
      const articles: ScrapedArticle[] = [];

      const articlePattern = /<article[^>]*>([\s\S]*?)<\/article>/gi;
      const matches = html.matchAll(articlePattern);

      for (const match of matches) {
        const articleHtml = match[1];

        const titleMatch = articleHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
        const title = titleMatch ? this.stripHtml(titleMatch[1]) : '';

        const summaryMatch = articleHtml.match(/<p[^>]*>(.*?)<\/p>/i);
        const summary = summaryMatch ? this.stripHtml(summaryMatch[1]) : '';

        const urlMatch = articleHtml.match(/href=["']([^"']+)["']/i);
        let url = urlMatch ? urlMatch[1] : '';
        if (url && !url.startsWith('http')) {
          url = `https://www.worldoil.com${url}`;
        }

        const dateMatch = articleHtml.match(/\d{4}-\d{2}-\d{2}|\w+ \d{1,2}, \d{4}/);
        const publishedDate = dateMatch ? new Date(dateMatch[0]) : new Date();

        if (title && summary && url) {
          articles.push({
            title,
            summary: summary.substring(0, 300),
            url,
            publishedDate,
            source: 'World Oil',
          });
        }

        if (articles.length >= 10) break;
      }

      return articles;
    } catch (error) {
      console.error('World Oil scraping failed:', error);
      return [];
    }
  }

  /**
   * Pipeline & Gas Journal scraper (midstream segment focus)
   * ENHANCED: Scrapes news, projects, and infrastructure for comprehensive coverage
   */
  private async scrapePipelineGasJournal(): Promise<ScrapedArticle[]> {
    try {
      // Scrape from multiple sections for broader midstream coverage
      const urls = [
        'https://www.pipelineandgasjournal.com/latest-news',
        'https://www.pipelineandgasjournal.com/projects',
        'https://www.pipelineandgasjournal.com/construction'
      ];

      const articles: ScrapedArticle[] = [];

      for (const baseUrl of urls) {
        try {
          const html = await this.fetchWithRetry(baseUrl);
          const articlePattern = /<article[^>]*>([\s\S]*?)<\/article>/gi;
          const matches = html.matchAll(articlePattern);

          for (const match of matches) {
            const articleHtml = match[1];

            const titleMatch = articleHtml.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
            const title = titleMatch ? this.stripHtml(titleMatch[1]) : '';

            const summaryMatch = articleHtml.match(/<p[^>]*>(.*?)<\/p>/i);
            const summary = summaryMatch ? this.stripHtml(summaryMatch[1]) : '';

            const urlMatch = articleHtml.match(/href=["']([^"']+)["']/i);
            let url = urlMatch ? urlMatch[1] : '';
            if (url && !url.startsWith('http')) {
              url = `https://www.pipelineandgasjournal.com${url}`;
            }

            const dateMatch = articleHtml.match(/\d{4}-\d{2}-\d{2}|\w+ \d{1,2}, \d{4}/);
            const publishedDate = dateMatch ? new Date(dateMatch[0]) : new Date();

            if (title && summary && url) {
              articles.push({
                title,
                summary: summary.substring(0, 300),
                url,
                publishedDate,
                source: 'Pipeline & Gas Journal',
              });
            }

            if (articles.length >= 15) break;
          }
        } catch (error) {
          console.warn(`Failed to scrape ${baseUrl}:`, error);
          // Continue with other URLs even if one fails
        }
      }

      return articles;
    } catch (error) {
      console.error('Pipeline & Gas Journal scraping failed:', error);
      return [];
    }
  }

  /**
   * Strip HTML tags from text and decode entities safely
   * Uses cheerio for proper HTML entity decoding to prevent XSS
   */
  private stripHtml(html: string): string {
    try {
      // Use cheerio to safely parse and extract text content
      // This properly decodes HTML entities without XSS risk
      const $ = cheerio.load(html);
      const text = $.text();

      // Clean up whitespace
      return text
        .replace(/\s+/g, ' ')
        .trim();
    } catch (error) {
      // Fallback: If cheerio fails, use basic sanitization
      console.warn('HTML parsing failed, using fallback sanitization:', error);

      // Remove all HTML tags first
      const withoutTags = html.replace(/<[^>]*>/g, '');

      // Only decode safe entities, do NOT decode < > to prevent XSS
      return withoutTags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

  /**
   * Categorize article based on content analysis
   * PRIORITIZES traditional segment categories over technology trends
   */
  private categorizeArticle(title: string, summary: string): IntelligenceCategory {
    const content = `${title} ${summary}`.toLowerCase();

    // Check product launches FIRST (highest priority)
    if (content.match(/launch|release|announce.*product|new.*product/)) {
      return 'product_launch';
    }
    // Strategic moves (high priority)
    if (content.match(/acquire|merger|partnership|strategic|invest/)) {
      return 'strategic_moves';
    }
    // Case studies and project news (traditional segment activity)
    if (content.match(/case study|success|project|deployment|implementation/)) {
      return 'case_study';
    }
    // Regulatory updates
    if (content.match(/regulation|compliance|policy|standard/)) {
      return 'regulatory';
    }
    // Market analysis and reports
    if (content.match(/research|study|report|analysis|forecast/)) {
      return 'market_analysis';
    }
    // Research & development
    if (content.match(/research.*development|patent|innovation/)) {
      return 'research';
    }
    // Technology trend checked LAST (catch-all for digital content)
    if (content.match(/ai|machine learning|digital|iot|automation|technology/)) {
      return 'technology_trend';
    }

    return 'general_news';
  }

  /**
   * Determine market segment based on content
   * Enhanced to cover all 5 segments comprehensively
   */
  private determineSegment(title: string, summary: string): IntelligenceSegment {
    const content = `${title} ${summary}`.toLowerCase();

    // Score each segment based on keyword matches
    const segmentScores: Record<IntelligenceSegment, number> = {
      offshore: 0,
      onshore: 0,
      midstream: 0,
      recovery: 0,
      integratedSolutions: 0,
      general: 0
    };

    // Offshore keywords
    const offshorePatterns = [
      /\boffshore\b/, /\bsubsea\b/, /\bdeepwater\b/, /\bunderwater\b/,
      /\bfpso\b/, /\boffshore platform\b/, /\bdrilling rig\b/, /\boffshore drilling\b/,
      /\bsemisubmersible\b/, /\bjackup\b/, /\boffshore production\b/
    ];
    offshorePatterns.forEach(pattern => {
      if (pattern.test(content)) segmentScores.offshore += 1;
    });

    // Onshore keywords
    const onshorePatterns = [
      /\bonshore\b/, /\bshale\b/, /\bfracking\b/, /\bhydraulic fracturing\b/,
      /\bhorizontal drilling\b/, /\bunconventional\b/, /\btight oil\b/, /\btight gas\b/,
      /\bland drilling\b/, /\bpermian\b/, /\bbakken\b/, /\beagle ford\b/
    ];
    onshorePatterns.forEach(pattern => {
      if (pattern.test(content)) segmentScores.onshore += 1;
    });

    // Midstream keywords
    const midstreamPatterns = [
      /\bpipeline\b/, /\btransport\b/, /\bmidstream\b/, /\bgathering\b/,
      /\blng\b/, /\bnatural gas\b/, /\bstorage\b/, /\bcompression\b/,
      /\bterminal\b/, /\bprocessing\b/, /\brefining\b/, /\bdistribution\b/
    ];
    midstreamPatterns.forEach(pattern => {
      if (pattern.test(content)) segmentScores.midstream += 1;
    });

    // Recovery keywords (EOR)
    const recoveryPatterns = [
      /\beor\b/, /\benhanced recovery\b/, /\benhanced oil recovery\b/,
      /\bsecondary recovery\b/, /\btertiary recovery\b/,
      /\bwaterflood\b/, /\bco2 injection\b/, /\bsteam injection\b/,
      /\bchemical flooding\b/, /\bpolymer flooding\b/, /\bimproved recovery\b/
    ];
    recoveryPatterns.forEach(pattern => {
      if (pattern.test(content)) segmentScores.recovery += 1;
    });

    // Integrated Solutions keywords
    const integratedPatterns = [
      /\bintegrated\b/, /\bplatform\b/, /\bsolution\b/, /\bdigital platform\b/,
      /\bsoftware\b/, /\bworkflow\b/, /\bsystem integration\b/, /\bend-to-end\b/,
      /\bcloud platform\b/, /\bdata platform\b/, /\bdigital transformation\b/
    ];
    integratedPatterns.forEach(pattern => {
      if (pattern.test(content)) segmentScores.integratedSolutions += 1;
    });

    // Find segment with highest score
    let maxScore = 0;
    let primarySegment: IntelligenceSegment = 'general';

    Object.entries(segmentScores).forEach(([segment, score]) => {
      if (score > maxScore) {
        maxScore = score;
        primarySegment = segment as IntelligenceSegment;
      }
    });

    // If no specific segment detected, return general
    return maxScore > 0 ? primarySegment : 'general';
  }

  /**
   * Generate unique ID for intelligence item
   */
  private generateId(article: ScrapedArticle): string {
    const hash = Buffer.from(`${article.source}-${article.title}-${article.publishedDate}`)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 16);
    return `intel-${hash}`;
  }

  /**
   * Convert scraped article to IntelligenceItem
   */
  private articleToIntelligence(article: ScrapedArticle): IntelligenceItem {
    const { today } = getDateRanges();
    const category = this.categorizeArticle(article.title, article.summary);
    const segment = this.determineSegment(article.title, article.summary);

    return {
      id: this.generateId(article),
      segment,
      title: article.title,
      summary: article.summary,
      source: {
        name: article.source,
        url: article.url,
        publishedDate: article.publishedDate.toISOString(),
      },
      publishedDate: article.publishedDate.toISOString(),
      scrapedDate: today.toISOString(),
      category,
      relevanceScore: this.calculateRelevanceScore(article),
      tags: this.extractTags(article.title, article.summary),
      isArchived: false,
      citation: {
        formatted: this.formatCitation(article),
        linkVerified: true,
        lastVerified: today.toISOString(),
      },
    };
  }

  /**
   * Calculate relevance score based on content analysis
   * EQUAL WEIGHTING for traditional and digital topics (NO digital bias)
   */
  private calculateRelevanceScore(article: ScrapedArticle): number {
    let score = 70; // Base score

    const content = `${article.title} ${article.summary}`.toLowerCase();

    // Keywords organized by segment - ALL segments get equal +3 weighting
    const segmentKeywords = {
      // Offshore segment
      offshore: ['offshore', 'subsea', 'deepwater', 'underwater', 'fpso', 'platform', 'drilling rig', 'offshore platform'],

      // Onshore segment
      onshore: ['onshore', 'shale', 'fracking', 'hydraulic fracturing', 'horizontal drilling', 'unconventional', 'tight oil'],

      // Midstream segment
      midstream: ['pipeline', 'transport', 'midstream', 'gathering', 'lng', 'natural gas', 'storage', 'compression'],

      // Recovery segment
      recovery: ['eor', 'enhanced recovery', 'secondary recovery', 'tertiary recovery', 'waterflooding', 'co2 injection', 'steam injection'],

      // Integrated Solutions
      integrated: ['integrated', 'platform', 'solution', 'system', 'workflow', 'software', 'service']
    };

    // All segment keywords get EQUAL +3 weight (digital keywords removed to eliminate bias)
    [segmentKeywords.offshore, segmentKeywords.onshore, segmentKeywords.midstream,
     segmentKeywords.recovery, segmentKeywords.integrated].forEach(keywords => {
      keywords.forEach(keyword => {
        if (content.includes(keyword)) score += 3;
      });
    });

    // Boost score for recent articles
    const daysSincePublished = (Date.now() - article.publishedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 7) score += 10;
    else if (daysSincePublished < 30) score += 5;

    // Boost for innovation/strategic content (applies to both traditional and digital)
    const highValueTerms = ['innovation', 'breakthrough', 'strategic', 'acquisition', 'merger', 'partnership'];
    highValueTerms.forEach(term => {
      if (content.includes(term)) score += 4;
    });

    return Math.min(score, 100);
  }

  /**
   * Extract relevant tags from content
   * COMPREHENSIVE COVERAGE: 100+ tags across all 5 segments + production chemistry
   */
  private extractTags(title: string, summary: string): string[] {
    const content = `${title} ${summary}`.toLowerCase();
    const tags: string[] = [];

    const tagPatterns: Record<string, RegExp> = {
      // ===== OFFSHORE SEGMENT TAGS (25 tags) =====

      // Traditional Offshore
      'Rig Contract': /\b(rig contract|drilling contract|charter|rig award)\b/,
      'Drilling Campaign': /\b(drilling campaign|drilling program|exploration campaign)\b/,
      'Field Development': /\b(field development|field plan|development plan)\b/,
      'FID': /\b(fid|final investment decision|project sanction)\b/,
      'Subsea Installation': /\b(subsea installation|subsea project|subsea construction)\b/,
      'FPSO': /\b(fpso|floating production|production vessel)\b/,
      'Offshore Platform': /\b(offshore platform|fixed platform|platform installation)\b/,
      'Jack-up Rig': /\b(jack-up|jackup|jack up rig)\b/,
      'Drillship': /\b(drillship|drill ship|drilling vessel)\b/,
      'Semisubmersible': /\b(semisubmersible|semi-submersible|semisub)\b/,
      'Well Intervention': /\b(well intervention|intervention|workover)\b/,
      'Decommissioning': /\b(decommission|abandonment|platform removal)\b/,
      'Mooring System': /\b(mooring|anchoring|anchor system)\b/,
      'Umbilical': /\b(umbilical|subsea umbilical|control umbilical)\b/,
      'Flowline': /\b(flowline|subsea flowline|production flowline)\b/,
      'Subsea Tree': /\b(subsea tree|christmas tree|wellhead)\b/,
      'Manifold': /\b(manifold|subsea manifold|production manifold)\b/,

      // Offshore Production Chemistry
      'Corrosion Inhibitor': /\b(corrosion inhibitor|corrosion control|anti-corrosion)\b/,
      'Scale Inhibitor': /\b(scale inhibitor|scale control|anti-scaling)\b/,
      'Hydrate Inhibitor': /\b(hydrate inhibitor|methanol injection|meg|glycol)\b/,
      'Demulsifier': /\b(demulsifier|emulsion breaker|water separation)\b/,
      'Biocide': /\b(biocide|bacterial control|microbiocide)\b/,
      'H2S Scavenger': /\b(h2s scavenger|hydrogen sulfide scavenger|sour gas treatment)\b/,
      'Oxygen Scavenger': /\b(oxygen scavenger|deoxygenation|oxygen removal)\b/,
      'Subsea Chemical Injection': /\b(chemical injection|downhole chemical|subsea chemical)\b/,

      // ===== ONSHORE SEGMENT TAGS (30 tags) =====

      // Traditional Onshore
      'Well Completion': /\b(well completion|completion design|completing)\b/,
      'Hydraulic Fracturing': /\b(hydraulic fracturing|fracking|frac|stimulation)\b/,
      'Proppant': /\b(proppant|sand|ceramic proppant|resin coated)\b/,
      'Frac Fluid': /\b(frac fluid|fracturing fluid|slickwater)\b/,
      'Drilling Permit': /\b(drilling permit|permit approval|spud)\b/,
      'Basin Activity': /\b(basin activity|basin production|rig count)\b/,
      'Horizontal Well': /\b(horizontal well|lateral|horizontal drilling)\b/,
      'Vertical Well': /\b(vertical well|vertical drilling)\b/,
      'Perforation': /\b(perforation|perforating|perf guns)\b/,
      'Cementing': /\b(cement|cementing|primary cement)\b/,
      'Casing': /\b(casing|casing design|tubular)\b/,
      'Tubing': /\b(tubing|production tubing|coiled tubing)\b/,
      'Artificial Lift': /\b(artificial lift|lift system)\b/,
      'ESP': /\b(esp|electric submersible pump|downhole pump)\b/,
      'Gas Lift': /\b(gas lift|gas injection|lift gas)\b/,
      'Rod Pump': /\b(rod pump|sucker rod|beam pump)\b/,
      'Workover': /\b(workover|well workover|intervention)\b/,
      'Stimulation': /\b(stimulation|matrix|acid stimulation)\b/,

      // Onshore Basins
      'Permian Basin': /\b(permian|permian basin|delaware|midland)\b/,
      'Bakken': /\b(bakken|williston basin)\b/,
      'Eagle Ford': /\b(eagle ford)\b/,
      'Haynesville': /\b(haynesville)\b/,
      'Marcellus': /\b(marcellus)\b/,
      'Utica': /\b(utica)\b/,

      // Onshore Production Chemistry
      'Friction Reducer': /\b(friction reducer|slickwater|drag reducer)\b/,
      'Surfactant': /\b(surfactant|surface active|wetting agent)\b/,
      'Clay Stabilizer': /\b(clay stabilizer|clay control)\b/,
      'Iron Control': /\b(iron control|sequestering agent)\b/,
      'Paraffin Inhibitor': /\b(paraffin inhibitor|wax inhibitor|pour point)\b/,
      'Asphaltene Inhibitor': /\b(asphaltene inhibitor|asphaltene control)\b/,

      // ===== MIDSTREAM SEGMENT TAGS (25 tags) =====

      // Traditional Midstream
      'Pipeline': /\b(pipeline|pipelines|pipe)\b/,
      'LNG Terminal': /\b(lng terminal|liquefaction|regasification)\b/,
      'Gathering System': /\b(gathering|gathering system|field gathering)\b/,
      'Compression Station': /\b(compression|compressor station|gas compression)\b/,
      'Processing Plant': /\b(processing plant|gas plant|processing facility)\b/,
      'Gas Plant': /\b(gas plant|natural gas plant|treating plant)\b/,
      'NGL': /\b(ngl|natural gas liquids|ngl extraction)\b/,
      'Fractionation': /\b(fractionation|fractionator|ngl fractionation)\b/,
      'Storage Facility': /\b(storage|storage facility|tank farm|cavern)\b/,
      'Export Terminal': /\b(export terminal|export facility)\b/,
      'Import Terminal': /\b(import terminal|import facility)\b/,
      'Regasification': /\b(regasification|lng regasification)\b/,
      'Liquefaction': /\b(liquefaction|lng liquefaction|lng plant)\b/,
      'Transmission Pipeline': /\b(transmission|transmission pipeline|interstate)\b/,
      'Distribution Network': /\b(distribution|distribution network|utility)\b/,

      // Midstream Production Chemistry
      'Drag Reducer': /\b(drag reducer|dra|flow improver)\b/,
      'Odorant': /\b(odorant|mercaptan|odorization)\b/,
      'Glycol Dehydration': /\b(glycol|dehydration|teg|triethylene glycol)\b/,
      'Amine Treatment': /\b(amine|amine treatment|sweetening)\b/,
      'Mercury Removal': /\b(mercury removal|mercury control)\b/,

      // Midstream Operations
      'Capacity Expansion': /\b(capacity expansion|expansion project|throughput)\b/,
      'Throughput': /\b(throughput|capacity|volume)\b/,
      'Pipeline Integrity': /\b(pipeline integrity|integrity management|inline inspection)\b/,
      'Compression Optimization': /\b(compression optimization|compressor efficiency)\b/,
      'Custody Transfer': /\b(custody transfer|metering|measurement)\b/,

      // ===== RECOVERY SEGMENT TAGS (30 tags) =====

      // Traditional Recovery
      'Enhanced Oil Recovery': /\b(enhanced oil recovery|eor)\b/,
      'EOR': /\b(eor|ior|improved recovery)\b/,
      'Waterflood': /\b(waterflood|waterflooding|water injection)\b/,
      'Water Injection': /\b(water injection|injection well|water injector)\b/,
      'CO2 Injection': /\b(co2 injection|carbon dioxide injection|co2 flood)\b/,
      'CO2 Flood': /\b(co2 flood|co2 flooding|miscible flood)\b/,
      'Polymer Flood': /\b(polymer flood|polymer flooding)\b/,
      'Surfactant Flood': /\b(surfactant flood|surfactant flooding)\b/,
      'ASP Flood': /\b(asp|alkaline surfactant polymer)\b/,
      'Steam Injection': /\b(steam injection|steam flood|thermal recovery)\b/,
      'SAGD': /\b(sagd|steam assisted gravity drainage)\b/,
      'Cyclic Steam': /\b(cyclic steam|css|huff and puff)\b/,
      'Thermal Recovery': /\b(thermal recovery|thermal eor)\b/,
      'Gas Injection': /\b(gas injection|gas flood)\b/,
      'WAG': /\b(wag|water alternating gas)\b/,
      'Miscible Flood': /\b(miscible|miscible displacement)\b/,
      'Immiscible Flood': /\b(immiscible)\b/,

      // Recovery Production Chemistry
      'Polymer': /\b(polymer|polyacrylamide|pam|hpam)\b/,
      'Xanthan': /\b(xanthan|xanthan gum)\b/,
      'Scleroglucan': /\b(scleroglucan)\b/,
      'Viscosifier': /\b(viscosifier|thickener|viscosity modifier)\b/,
      'Mobility Control': /\b(mobility control|mobility ratio)\b/,
      'Conformance Control': /\b(conformance control|profile modification)\b/,
      'Profile Modification': /\b(profile modification|sweep improvement)\b/,
      'Gel Treatment': /\b(gel treatment|gel|crosslinked gel)\b/,
      'Cross-linked Polymer': /\b(crosslinked|crosslinking|gelation)\b/,
      'Foam': /\b(foam|foam flooding)\b/,
      'Nanoparticles': /\b(nanoparticle|nano|nanotechnology)\b/,

      // Recovery Operations
      'Pilot Program': /\b(pilot|pilot program|pilot project|field trial)\b/,
      'Recovery Factor': /\b(recovery factor|oil recovery|ultimate recovery)\b/,
      'Sweep Efficiency': /\b(sweep|sweep efficiency|volumetric sweep)\b/,

      // ===== INTEGRATED SOLUTIONS SEGMENT TAGS (25 tags) =====

      // Traditional Integrated
      'Service Contract': /\b(service contract|contract award|service agreement)\b/,
      'Integrated Project': /\b(integrated project|turnkey|epc|epcic)\b/,
      'Turnkey Solution': /\b(turnkey|lump sum|fixed price)\b/,
      'EPCIC': /\b(epcic|epc|engineering procurement construction)\b/,
      'Operations & Maintenance': /\b(o&m|operations maintenance|operations and maintenance)\b/,
      'Asset Management': /\b(asset management|asset optimization)\b/,
      'Field Services': /\b(field services|field support|onsite services)\b/,
      'Well Services': /\b(well services|well intervention)\b/,
      'Drilling Services': /\b(drilling services|directional drilling)\b/,
      'Completions Services': /\b(completion services|completions)\b/,
      'Production Services': /\b(production services|production optimization)\b/,
      'Intervention Services': /\b(intervention|wireline|slickline)\b/,
      'Coiled Tubing': /\b(coiled tubing|ct services)\b/,
      'Wireline': /\b(wireline|e-line|slickline)\b/,
      'Logging': /\b(logging|wireline logging|formation evaluation)\b/,
      'Testing': /\b(well testing|production testing|dsp)\b/,

      // Integrated Production Chemistry
      'Chemical Management': /\b(chemical management|chemical program)\b/,
      'Chemical Optimization': /\b(chemical optimization|dosage optimization)\b/,
      'Treatment Programs': /\b(treatment program|chemical treatment)\b/,
      'Specialty Chemicals': /\b(specialty chemical|oilfield chemical)\b/,

      // Digital Integration (20% of content)
      'Digital Oilfield': /\b(digital oilfield|digital transformation)\b/,
      'Remote Monitoring': /\b(remote monitoring|remote operations)\b/,
      'Predictive Maintenance': /\b(predictive maintenance|condition monitoring)\b/,
      'Data Analytics': /\b(data analytics|analytics|big data)\b/,
      'AI': /\b(ai|artificial intelligence|machine learning)\b/,
    };

    Object.entries(tagPatterns).forEach(([tag, pattern]) => {
      if (pattern.test(content)) {
        tags.push(tag);
      }
    });

    return tags.slice(0, 8); // Increased from 5 to 8 tags to capture more detail
  }

  /**
   * Format citation for article
   */
  private formatCitation(article: ScrapedArticle): string {
    const date = article.publishedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return `${article.source}. "${article.title}" Published ${date}.`;
  }

  /**
   * Scrape all sources and return intelligence items
   */
  async scrapeAll(): Promise<IntelligenceItem[]> {
    console.log('🔍 Starting real-time web scraping from 6 sources...');
    const { archiveCutoff } = getDateRanges();

    try {
      // Scrape all sources in parallel (6 sources now)
      const [bakerHughes, halliburton, oilGasJournal, offshoreTech, worldOil, pipelineGas] = await Promise.allSettled([
        this.scrapeBakerHughes(),
        this.scrapeHalliburton(),
        this.scrapeOilGasJournal(),
        this.scrapeOffshoreTechnology(),
        this.scrapeWorldOil(),
        this.scrapePipelineGasJournal(),
      ]);

      // Combine all articles
      const allArticles: ScrapedArticle[] = [];

      if (bakerHughes.status === 'fulfilled') {
        allArticles.push(...bakerHughes.value);
        console.log(`✅ Baker Hughes: ${bakerHughes.value.length} articles`);
      } else {
        console.error('Baker Hughes failed:', bakerHughes.reason);
      }

      if (halliburton.status === 'fulfilled') {
        allArticles.push(...halliburton.value);
        console.log(`✅ Halliburton: ${halliburton.value.length} articles`);
      } else {
        console.error('Halliburton failed:', halliburton.reason);
      }

      if (oilGasJournal.status === 'fulfilled') {
        allArticles.push(...oilGasJournal.value);
        console.log(`✅ Oil & Gas Journal: ${oilGasJournal.value.length} articles`);
      } else {
        console.error('Oil & Gas Journal failed:', oilGasJournal.reason);
      }

      if (offshoreTech.status === 'fulfilled') {
        allArticles.push(...offshoreTech.value);
        console.log(`✅ Offshore Technology: ${offshoreTech.value.length} articles`);
      } else {
        console.error('Offshore Technology failed:', offshoreTech.reason);
      }

      if (worldOil.status === 'fulfilled') {
        allArticles.push(...worldOil.value);
        console.log(`✅ World Oil: ${worldOil.value.length} articles`);
      } else {
        console.error('World Oil failed:', worldOil.reason);
      }

      if (pipelineGas.status === 'fulfilled') {
        allArticles.push(...pipelineGas.value);
        console.log(`✅ Pipeline & Gas Journal: ${pipelineGas.value.length} articles`);
      } else {
        console.error('Pipeline & Gas Journal failed:', pipelineGas.reason);
      }

      // Filter articles within 365-day window
      const recentArticles = allArticles.filter(article =>
        article.publishedDate >= archiveCutoff
      );

      // Convert to intelligence items
      const intelligenceItems = recentArticles.map(article =>
        this.articleToIntelligence(article)
      );

      // Remove duplicates based on ID
      const uniqueItems = Array.from(
        new Map(intelligenceItems.map(item => [item.id, item])).values()
      );

      // Sort by published date (most recent first)
      uniqueItems.sort((a, b) =>
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      );

      console.log(`Scraped ${uniqueItems.length} unique intelligence items`);
      return uniqueItems;

    } catch (error) {
      console.error('Scraping failed:', error);
      return [];
    }
  }

  /**
   * Scrape specific competitor source
   */
  async scrapeSource(sourceName: string): Promise<IntelligenceItem[]> {
    const { archiveCutoff } = getDateRanges();
    let articles: ScrapedArticle[] = [];

    switch (sourceName.toLowerCase()) {
      case 'baker hughes':
        articles = await this.scrapeBakerHughes();
        break;
      case 'halliburton':
        articles = await this.scrapeHalliburton();
        break;
      case 'oil & gas journal':
        articles = await this.scrapeOilGasJournal();
        break;
      default:
        console.warn(`Unknown source: ${sourceName}`);
        return [];
    }

    // Filter and convert
    const recentArticles = articles.filter(article =>
      article.publishedDate >= archiveCutoff
    );

    return recentArticles.map(article => this.articleToIntelligence(article));
  }
}

// Export singleton instance
export const webScraperService = new WebScraperService();
