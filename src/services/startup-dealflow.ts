import { STARTUP_DEALFLOW_SEED } from '@/config/startup-dealflow';
import type { StartupDealflowItem, StartupDealflowStage, StartupDealflowStatus } from '@/types';

const REMOTE_URL = (import.meta.env.VITE_STARTUP_DEALFLOW_URL || '').trim();

let cachedItems: StartupDealflowItem[] = [...STARTUP_DEALFLOW_SEED];
let remoteLoadPromise: Promise<StartupDealflowItem[]> | null = null;

const ALLOWED_STATUS: Set<StartupDealflowStatus> = new Set(['dealflow', 'portfolio']);
const ALLOWED_STAGE: Set<StartupDealflowStage> = new Set(['pre-seed', 'seed', 'series-a', 'series-b+', 'growth']);

function parseCsvLine(line: string): string[] {
  const cols: string[] = [];
  let value = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cols.push(value.trim());
      value = '';
      continue;
    }
    value += ch;
  }
  cols.push(value.trim());
  return cols;
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  const raw = String(value ?? '').trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function normalizeItem(input: Partial<StartupDealflowItem> & Record<string, unknown>): StartupDealflowItem | null {
  const id = String(input.id ?? '').trim();
  const name = String(input.name ?? '').trim();
  const city = String(input.city ?? '').trim();
  const region = String(input.region ?? '').trim();
  const country = String(input.country ?? '').trim();
  const lat = Number(input.lat);
  const lon = Number(input.lon);
  const status = String(input.status ?? '').trim() as StartupDealflowStatus;
  const stage = String(input.stage ?? '').trim() as StartupDealflowStage;
  const sectors = normalizeStringArray(input.sectors);
  const website = String(input.website ?? '').trim();
  const aliases = normalizeStringArray(input.aliases);
  const newsExclusions = normalizeStringArray(input.newsExclusions);
  const newsQuery = String(input.newsQuery ?? '').trim();
  const lastUpdated = String(input.lastUpdated ?? '').trim();

  if (!id || !name || !city || !region || !country) return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  if (!ALLOWED_STATUS.has(status) || !ALLOWED_STAGE.has(stage)) return null;

  return {
    id,
    name,
    city,
    region,
    country,
    lat,
    lon,
    status,
    stage,
    sectors,
    website: website || undefined,
    aliases,
    newsExclusions,
    newsQuery: newsQuery || undefined,
    lastUpdated: lastUpdated || undefined,
  };
}

function parseCsvItems(csv: string): StartupDealflowItem[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0] || '');
  const indexByKey = new Map<string, number>();
  header.forEach((key, idx) => indexByKey.set(key.trim(), idx));

  const required = ['id', 'name', 'city', 'region', 'country', 'lat', 'lon', 'status', 'stage', 'sectors'];
  if (!required.every((key) => indexByKey.has(key))) return [];

  const parsed: StartupDealflowItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i] || '');
    const obj: Record<string, unknown> = {};
    const fields = [...required, 'website', 'aliases', 'newsQuery', 'newsExclusions', 'lastUpdated'];
    fields.forEach((key) => {
      const idx = indexByKey.get(key);
      obj[key] = idx != null ? cols[idx] : '';
    });
    const item = normalizeItem(obj);
    if (item) parsed.push(item);
  }

  return parsed;
}

function mergeItems(base: StartupDealflowItem[], remote: StartupDealflowItem[]): StartupDealflowItem[] {
  if (remote.length === 0) return [...base];
  const merged = new Map<string, StartupDealflowItem>();
  base.forEach((item) => merged.set(item.id, item));
  remote.forEach((item) => merged.set(item.id, item));
  return Array.from(merged.values());
}

async function fetchRemoteItems(url: string): Promise<StartupDealflowItem[]> {
  const response = await fetch(url);
  if (!response.ok) return [];

  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    const payload = await response.json();
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { items?: unknown[] }).items)
        ? (payload as { items: unknown[] }).items
        : [];

    return rows
      .map((row) => normalizeItem((row as Record<string, unknown>) ?? {}))
      .filter((item): item is StartupDealflowItem => !!item);
  }

  const text = await response.text();
  return parseCsvItems(text);
}

export function getStartupDealflowItems(): StartupDealflowItem[] {
  return [...cachedItems];
}

export async function loadStartupDealflowItems(): Promise<StartupDealflowItem[]> {
  if (!REMOTE_URL) return getStartupDealflowItems();
  if (remoteLoadPromise) return remoteLoadPromise;

  remoteLoadPromise = (async () => {
    try {
      const remoteItems = await fetchRemoteItems(REMOTE_URL);
      cachedItems = mergeItems(STARTUP_DEALFLOW_SEED, remoteItems);
      return getStartupDealflowItems();
    } catch {
      return getStartupDealflowItems();
    }
  })();

  return remoteLoadPromise;
}
