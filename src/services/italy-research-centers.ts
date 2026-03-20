import {
  ITALY_RESEARCH_CENTERS,
  type ItalyResearchCenter,
  type ItalyResearchCenterType,
} from '@/config/it-research-centers';

const REMOTE_URL = (import.meta.env.VITE_IT_RESEARCH_CENTERS_URL || '').trim();

let cachedCenters: ItalyResearchCenter[] = [...ITALY_RESEARCH_CENTERS];
let remoteLoadPromise: Promise<ItalyResearchCenter[]> | null = null;

const ALLOWED_TYPES: Set<ItalyResearchCenterType> = new Set(['university', 'research_center', 'private_lab']);

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

function normalizeFocus(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  const raw = String(value ?? '').trim();
  if (!raw) return [];
  return raw.split(',').map((v) => v.trim()).filter(Boolean);
}

function normalizeCenter(input: Partial<ItalyResearchCenter> & Record<string, unknown>): ItalyResearchCenter | null {
  const id = String(input.id ?? '').trim();
  const name = String(input.name ?? '').trim();
  const type = String(input.type ?? '').trim() as ItalyResearchCenterType;
  const city = String(input.city ?? '').trim();
  const region = String(input.region ?? '').trim();
  const country = String(input.country ?? '').trim() || 'Italy';
  const lat = Number(input.lat);
  const lon = Number(input.lon);
  const focus = normalizeFocus(input.focus);
  const website = String(input.website ?? '').trim();

  if (!id || !name || !ALLOWED_TYPES.has(type)) return null;
  if (!city || !region || !country) return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  return {
    id,
    name,
    type,
    city,
    region,
    country,
    lat,
    lon,
    focus,
    website: website || undefined,
  };
}

function parseCsvCenters(csv: string): ItalyResearchCenter[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];
  const header = parseCsvLine(lines[0] || '');
  const indexByKey = new Map<string, number>();
  header.forEach((key, index) => indexByKey.set(key.trim(), index));

  const required = ['id', 'name', 'type', 'city', 'region', 'country', 'lat', 'lon', 'focus', 'website'];
  const hasAllColumns = required.every((key) => indexByKey.has(key));
  if (!hasAllColumns) return [];

  const parsed: ItalyResearchCenter[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i] || '');
    const obj: Record<string, unknown> = {};
    required.forEach((key) => {
      const idx = indexByKey.get(key);
      obj[key] = idx != null ? cols[idx] : '';
    });
    const normalized = normalizeCenter(obj);
    if (normalized) parsed.push(normalized);
  }
  return parsed;
}

function mergeCenters(base: ItalyResearchCenter[], remote: ItalyResearchCenter[]): ItalyResearchCenter[] {
  if (remote.length === 0) return [...base];
  const merged = new Map<string, ItalyResearchCenter>();
  base.forEach((center) => merged.set(center.id, center));
  remote.forEach((center) => merged.set(center.id, center));
  return Array.from(merged.values());
}

async function fetchRemoteCenters(url: string): Promise<ItalyResearchCenter[]> {
  const response = await fetch(url);
  if (!response.ok) return [];

  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    const payload = await response.json();
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { centers?: unknown[] }).centers)
        ? (payload as { centers: unknown[] }).centers
        : [];
    return rows
      .map((row) => normalizeCenter((row as Record<string, unknown>) ?? {}))
      .filter((row): row is ItalyResearchCenter => !!row);
  }

  const text = await response.text();
  return parseCsvCenters(text);
}

export function getItalyResearchCenters(): ItalyResearchCenter[] {
  return [...cachedCenters];
}

export async function loadItalyResearchCenters(): Promise<ItalyResearchCenter[]> {
  if (!REMOTE_URL) return getItalyResearchCenters();
  if (remoteLoadPromise) return remoteLoadPromise;

  remoteLoadPromise = (async () => {
    try {
      const remoteCenters = await fetchRemoteCenters(REMOTE_URL);
      cachedCenters = mergeCenters(ITALY_RESEARCH_CENTERS, remoteCenters);
      return getItalyResearchCenters();
    } catch {
      return getItalyResearchCenters();
    }
  })();

  return remoteLoadPromise;
}

