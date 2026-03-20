import type { Feed, StartupDealflowItem } from '@/types';

const rss = (url: string) => `/api/rss-proxy?url=${encodeURIComponent(url)}`;
const PORTFOLIO_FEED_PREFIX = 'Portfolio: ';
const PORTFOLIO_FALLBACK_SUFFIX = ' (fallback)';

const MAX_PORTFOLIO_FEEDS = 40;

function buildQuery(item: StartupDealflowItem): string {
  if (item.newsQuery?.trim()) return item.newsQuery.trim();

  const aliases = [item.name, ...(item.aliases || [])]
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 4);
  const entityPart = aliases.length > 1
    ? `(${aliases.map((name) => `\"${name}\"`).join(' OR ')})`
    : `\"${aliases[0] || item.name}\"`;

  const contextPart = '(startup OR funding OR round OR product OR partnership OR acquisizione OR investimento)';
  const geoPart = `(${item.country} OR ${item.city})`;
  const exclusions = (item.newsExclusions || [])
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => `-${value}`)
    .join(' ');

  return `${entityPart} ${contextPart} ${geoPart} ${exclusions}`.trim();
}

function buildFallbackQuery(item: StartupDealflowItem): string {
  const alias = item.aliases?.find((value) => value.trim().length > 0)?.trim();
  const entity = alias || item.name;
  return `"${entity}" (startup OR finanziamento OR funding OR round)`;
}

function buildGoogleNewsRssUrl(query: string, country: string, recency: '7d' | '30d' = '7d'): string {
  const isItaly = country.toLowerCase() === 'italy';
  const hl = isItaly ? 'it' : 'en-US';
  const gl = isItaly ? 'IT' : 'US';
  const ceid = isItaly ? 'IT:it' : 'US:en';
  return `https://news.google.com/rss/search?q=${encodeURIComponent(`${query} when:${recency}`)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
}

export function extractPortfolioStartupNameFromFeed(source: string): string | null {
  const value = source.trim();
  if (!value.startsWith(PORTFOLIO_FEED_PREFIX)) return null;
  const raw = value.slice(PORTFOLIO_FEED_PREFIX.length).trim();
  if (!raw) return null;
  if (raw.endsWith(PORTFOLIO_FALLBACK_SUFFIX)) {
    return raw.slice(0, -PORTFOLIO_FALLBACK_SUFFIX.length).trim() || null;
  }
  return raw;
}

export function buildPortfolioStartupFeeds(items: StartupDealflowItem[]): Feed[] {
  const portfolioItems = items
    .filter((item) => item.status === 'portfolio')
    .slice(0, Math.max(1, Math.floor(MAX_PORTFOLIO_FEEDS / 2)));

  const feeds: Feed[] = [];

  for (const item of portfolioItems) {
    const primaryQuery = buildQuery(item);
    feeds.push({
      name: `${PORTFOLIO_FEED_PREFIX}${item.name}`,
      url: rss(buildGoogleNewsRssUrl(primaryQuery, item.country, '7d')),
    });

    const fallbackQuery = buildFallbackQuery(item);
    feeds.push({
      name: `${PORTFOLIO_FEED_PREFIX}${item.name}${PORTFOLIO_FALLBACK_SUFFIX}`,
      url: rss(buildGoogleNewsRssUrl(fallbackQuery, item.country, '30d')),
    });

    if (feeds.length >= MAX_PORTFOLIO_FEEDS) break;
  }

  return feeds.slice(0, MAX_PORTFOLIO_FEEDS);
}
