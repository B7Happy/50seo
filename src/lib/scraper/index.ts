import puppeteer, { Browser, Page } from 'puppeteer-core';
import * as cheerio from 'cheerio';

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;
const BROWSERLESS_URL = `wss://chrome.browserless.io?token=${BROWSERLESS_TOKEN}`;

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; 50SEO-Bot/1.0; +https://50seo.fr)';

export interface PageData {
  url: string;
  finalUrl: string;
  statusCode: number;
  html: string;
  headers: Record<string, string>;
  loadTime: number;
  ttfb: number;
  resources: ResourceData[];
  consoleErrors: string[];
}

export interface ResourceData {
  url: string;
  type: string;
  size: number;
  status: number;
  loadTime: number;
}

export interface RobotsData {
  exists: boolean;
  content: string | null;
  rules: RobotsRule[];
  sitemaps: string[];
}

export interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export interface SitemapData {
  exists: boolean;
  url: string;
  urls: string[];
  lastmod?: string;
  isSitemapIndex: boolean;
  childSitemaps?: string[];
}

async function connectBrowser(): Promise<Browser> {
  if (!BROWSERLESS_TOKEN) {
    throw new Error('BROWSERLESS_TOKEN is not configured');
  }

  return puppeteer.connect({
    browserWSEndpoint: BROWSERLESS_URL,
  });
}

export async function fetchPage(url: string): Promise<PageData> {
  let browser;
  try {
    browser = await connectBrowser();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Connexion au navigateur échouée: ${message}`);
  }
  const page = await browser.newPage();

  const resources: ResourceData[] = [];
  const consoleErrors: string[] = [];
  let ttfb = 0;

  try {
    await page.setUserAgent(DEFAULT_USER_AGENT);
    await page.setViewport({ width: 1920, height: 1080 });

    // Track resources
    await page.setRequestInterception(true);
    const resourceTimings: Map<string, number> = new Map();

    page.on('request', (request) => {
      resourceTimings.set(request.url(), Date.now());
      request.continue();
    });

    page.on('response', async (response) => {
      const reqUrl = response.url();
      const startTime = resourceTimings.get(reqUrl) || Date.now();
      const loadTime = Date.now() - startTime;

      // Track TTFB for main document
      if (response.url() === url || response.request().isNavigationRequest()) {
        ttfb = loadTime;
      }

      let size = 0;
      try {
        const buffer = await response.buffer();
        size = buffer.length;
      } catch {
        // Some responses can't be buffered
      }

      resources.push({
        url: reqUrl,
        type: response.request().resourceType(),
        size,
        status: response.status(),
        loadTime,
      });
    });

    // Track console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const startTime = Date.now();

    let response;
    try {
      response = await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: DEFAULT_TIMEOUT,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Impossible de charger la page: ${message}`);
    }

    const loadTime = Date.now() - startTime;
    const finalUrl = page.url();
    const statusCode = response?.status() || 0;
    const headers: Record<string, string> = {};

    const responseHeaders = response?.headers() || {};
    for (const [key, value] of Object.entries(responseHeaders)) {
      headers[key.toLowerCase()] = value;
    }

    // Wait a bit for JS to execute
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const html = await page.content();

    return {
      url,
      finalUrl,
      statusCode,
      html,
      headers,
      loadTime,
      ttfb,
      resources,
      consoleErrors,
    };
  } finally {
    try {
      await page.close();
      await browser.close();
    } catch {
      // Ignore cleanup errors
    }
  }
}

export async function fetchRawHtml(url: string): Promise<{ html: string; statusCode: number; headers: Record<string, string> }> {
  // Fetch without JS execution (raw HTML)
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
      },
      redirect: 'follow',
    });

    const html = await response.text();
    const headers: Record<string, string> = {};

    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    return {
      html,
      statusCode: response.status,
      headers,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Impossible de récupérer le HTML: ${message}`);
  }
}

export async function fetchRobots(domain: string): Promise<RobotsData> {
  const robotsUrl = `${domain}/robots.txt`;

  try {
    const response = await fetch(robotsUrl, {
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
      },
    });

    if (!response.ok) {
      return {
        exists: false,
        content: null,
        rules: [],
        sitemaps: [],
      };
    }

    const content = await response.text();
    const rules = parseRobotsTxt(content);
    const sitemaps = extractSitemapsFromRobots(content);

    return {
      exists: true,
      content,
      rules,
      sitemaps,
    };
  } catch {
    return {
      exists: false,
      content: null,
      rules: [],
      sitemaps: [],
    };
  }
}

function parseRobotsTxt(content: string): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let currentRule: RobotsRule | null = null;

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const [directive, ...valueParts] = trimmed.split(':');
    const value = valueParts.join(':').trim();

    const lowerDirective = directive.toLowerCase();

    if (lowerDirective === 'user-agent') {
      if (currentRule) {
        rules.push(currentRule);
      }
      currentRule = {
        userAgent: value,
        allow: [],
        disallow: [],
      };
    } else if (currentRule) {
      if (lowerDirective === 'allow') {
        currentRule.allow.push(value);
      } else if (lowerDirective === 'disallow') {
        currentRule.disallow.push(value);
      }
    }
  }

  if (currentRule) {
    rules.push(currentRule);
  }

  return rules;
}

function extractSitemapsFromRobots(content: string): string[] {
  const sitemaps: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith('sitemap:')) {
      const url = trimmed.substring(8).trim();
      if (url) {
        sitemaps.push(url);
      }
    }
  }

  return sitemaps;
}

export async function fetchSitemap(url: string): Promise<SitemapData> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
      },
    });

    if (!response.ok) {
      return {
        exists: false,
        url,
        urls: [],
        isSitemapIndex: false,
      };
    }

    const content = await response.text();
    const $ = cheerio.load(content, { xmlMode: true });

    // Check if it's a sitemap index
    const sitemapIndexUrls = $('sitemapindex sitemap loc').map((_, el) => $(el).text()).get();

    if (sitemapIndexUrls.length > 0) {
      return {
        exists: true,
        url,
        urls: [],
        isSitemapIndex: true,
        childSitemaps: sitemapIndexUrls,
      };
    }

    // Regular sitemap
    const urls = $('urlset url loc').map((_, el) => $(el).text()).get();
    const lastmod = $('urlset url lastmod').first().text() || undefined;

    return {
      exists: true,
      url,
      urls,
      lastmod,
      isSitemapIndex: false,
    };
  } catch {
    return {
      exists: false,
      url,
      urls: [],
      isSitemapIndex: false,
    };
  }
}

export async function fetchSitemapFromDomain(domain: string): Promise<SitemapData> {
  // Try common sitemap locations
  const sitemapUrls = [
    `${domain}/sitemap.xml`,
    `${domain}/sitemap_index.xml`,
    `${domain}/sitemap/sitemap.xml`,
  ];

  for (const url of sitemapUrls) {
    const sitemap = await fetchSitemap(url);
    if (sitemap.exists) {
      return sitemap;
    }
  }

  return {
    exists: false,
    url: `${domain}/sitemap.xml`,
    urls: [],
    isSitemapIndex: false,
  };
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return url;
  }
}

export function parseHtml(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}
