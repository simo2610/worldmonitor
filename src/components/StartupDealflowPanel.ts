import { Panel } from './Panel';
import { getStartupDealflowItems } from '@/services/startup-dealflow';
import type { StartupDealflowItem, StartupDealflowStatus } from '@/types';
import { escapeHtml } from '@/utils/sanitize';

interface StartupDealflowPanelFilters {
  status: StartupDealflowStatus | 'all';
  geography: 'all' | 'italy' | 'europe';
  stage: 'all' | 'pre-seed' | 'seed' | 'series-a' | 'growth';
  websiteOnly: boolean;
  query: string;
}

export class StartupDealflowPanel extends Panel {
  private readonly allItems: StartupDealflowItem[];
  private filters: StartupDealflowPanelFilters = {
    status: 'all',
    geography: 'all',
    stage: 'all',
    websiteOnly: false,
    query: '',
  };
  private onStartupClick?: (item: StartupDealflowItem) => void;

  constructor(onStartupClick?: (item: StartupDealflowItem) => void) {
    super({
      id: 'startup-dealflow',
      title: 'Startup Dealflow (Italy + EU)',
      showCount: true,
      infoTooltip: 'Seed dataset v1: 70 startup items. Portfolio and dealflow are shown with dedicated map layers.',
    });

    this.onStartupClick = onStartupClick;
    this.allItems = getStartupDealflowItems();
    this.setupEvents();
    this.renderPanel();
  }

  private setupEvents(): void {
    this.content.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('startup-dealflow-clear')) {
        this.filters.query = '';
        this.renderPanel();
        return;
      }
      if (target.classList.contains('startup-filter-reset')) {
        this.filters = { status: 'all', geography: 'all', stage: 'all', websiteOnly: false, query: '' };
        this.renderPanel();
        return;
      }
      if (target.classList.contains('startup-export-btn')) {
        this.exportFilteredCsv();
        return;
      }
      const statusBtn = target.closest('[data-status]') as HTMLButtonElement | null;
      if (statusBtn) {
        const value = (statusBtn.dataset.status || 'all') as StartupDealflowPanelFilters['status'];
        this.filters.status = value;
        this.renderPanel();
        return;
      }
      const geoBtn = target.closest('[data-geo]') as HTMLButtonElement | null;
      if (geoBtn) {
        const value = (geoBtn.dataset.geo || 'all') as StartupDealflowPanelFilters['geography'];
        this.filters.geography = value;
        this.renderPanel();
        return;
      }
      const actionBtn = target.closest('[data-row-action]') as HTMLButtonElement | null;
      if (actionBtn) {
        const row = actionBtn.closest('.startup-dealflow-row') as HTMLElement | null;
        const id = row?.dataset.id;
        if (!id) return;
        const item = this.allItems.find((entry) => entry.id === id);
        if (!item) return;
        const action = actionBtn.dataset.rowAction;
        if (action === 'news') {
          this.openNewsSearch(item);
        } else if (action === 'site' && item.website) {
          window.open(item.website, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      const row = target.closest('.startup-dealflow-row') as HTMLElement | null;
      if (!row) return;

      const id = row.dataset.id;
      if (!id) return;
      const item = this.allItems.find((entry) => entry.id === id);
      if (item) this.onStartupClick?.(item);
    });

    this.content.addEventListener('input', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('startup-dealflow-search')) {
        this.filters.query = (target as HTMLInputElement).value;
      }
      if (target.classList.contains('startup-website-only')) {
        this.filters.websiteOnly = (target as HTMLInputElement).checked;
      }
      this.renderPanel();
    });

    this.content.addEventListener('change', (event) => {
      const target = event.target as HTMLElement;
      if (!target.classList.contains('startup-stage-select')) return;
      this.filters.stage = (target as HTMLSelectElement).value as StartupDealflowPanelFilters['stage'];
      this.renderPanel();
    });
  }

  private getFilteredItems(): StartupDealflowItem[] {
    const query = this.filters.query.trim().toLowerCase();

    return this.allItems
      .filter((item) => {
        if (this.filters.status !== 'all' && item.status !== this.filters.status) return false;
        if (this.filters.geography === 'italy' && item.country !== 'Italy') return false;
        if (this.filters.geography === 'europe' && item.country === 'Italy') return false;
        if (this.filters.stage !== 'all' && item.stage !== this.filters.stage) return false;
        if (this.filters.websiteOnly && !item.website) return false;
        if (!query) return true;

        const text = [
          item.name,
          item.city,
          item.region,
          item.country,
          item.stage,
          ...item.sectors,
          ...(item.aliases || []),
        ].join(' ').toLowerCase();

        return text.includes(query);
      })
      .sort((a, b) => {
        if (a.country !== b.country) return a.country === 'Italy' ? -1 : 1;
        if (a.city !== b.city) return a.city.localeCompare(b.city);
        return a.name.localeCompare(b.name);
      });
  }

  private buildGoogleNewsSearchUrl(item: StartupDealflowItem): string {
    const query = item.newsQuery?.trim() || `"${item.name}" startup ${item.country}`;
    return `https://news.google.com/search?q=${encodeURIComponent(query)}`;
  }

  private openNewsSearch(item: StartupDealflowItem): void {
    window.open(this.buildGoogleNewsSearchUrl(item), '_blank', 'noopener,noreferrer');
  }

  private exportFilteredCsv(): void {
    const rows = this.getFilteredItems();
    const header = ['id', 'name', 'status', 'stage', 'city', 'region', 'country', 'sectors', 'website'];
    const csvRows = [
      header.join(','),
      ...rows.map((item) => ([
        item.id,
        item.name,
        item.status,
        item.stage,
        item.city,
        item.region,
        item.country,
        item.sectors.join(' | '),
        item.website || '',
      ]).map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'startup-dealflow-filtered.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private renderPanel(): void {
    const filtered = this.getFilteredItems();
    this.setCount(filtered.length);
    const total = this.allItems.length;
    const totalPortfolio = this.allItems.filter((item) => item.status === 'portfolio').length;
    const totalDealflow = total - totalPortfolio;
    const italyCount = this.allItems.filter((item) => item.country === 'Italy').length;

    const tabs = [
      { key: 'all', label: 'All', count: total },
      { key: 'dealflow', label: 'Dealflow', count: totalDealflow },
      { key: 'portfolio', label: 'Portfolio', count: totalPortfolio },
    ]
      .map((tab) => {
        const active = this.filters.status === tab.key;
        return `<button class="startup-dealflow-tab${active ? ' active' : ''}" data-status="${tab.key}">
          <span>${tab.label}</span>
          <span class="startup-dealflow-tab-count">${tab.count}</span>
        </button>`;
      })
      .join('');

    const geos = [
      { key: 'all', label: 'All geos' },
      { key: 'italy', label: 'Italy' },
      { key: 'europe', label: 'EU' },
    ]
      .map((geo) => {
        const active = this.filters.geography === geo.key;
        return `<button class="startup-dealflow-tab geo${active ? ' active' : ''}" data-geo="${geo.key}">${geo.label}</button>`;
      })
      .join('');

    const rows = filtered
      .map((item) => {
        const statusClass = item.status === 'portfolio' ? 'portfolio' : 'dealflow';
        const sectors = item.sectors.slice(0, 2).join(' · ');
        const actionButtons = `
          <div class="startup-row-actions">
            <button type="button" class="startup-row-btn" data-row-action="news" title="Open Google News query">News</button>
            ${item.website ? '<button type="button" class="startup-row-btn" data-row-action="site" title="Open website">Site</button>' : ''}
          </div>
        `;
        return `
          <tr class="startup-dealflow-row" data-id="${escapeHtml(item.id)}">
            <td>
              <div class="startup-name-wrap">
                <span class="startup-name">${escapeHtml(item.name)}</span>
                <span class="startup-meta">${escapeHtml(item.city)}, ${escapeHtml(item.region)}</span>
              </div>
            </td>
            <td>${escapeHtml(item.stage)}</td>
            <td><span class="startup-status ${statusClass}">${escapeHtml(item.status)}</span></td>
            <td>${escapeHtml(sectors || 'n/a')}</td>
            <td class="startup-country-cell">${escapeHtml(item.country)}${actionButtons}</td>
          </tr>
        `;
      })
      .join('');

    this.setContent(`
      <div class="startup-dealflow-shell">
      <div class="startup-dealflow-kpis">
        <div class="startup-kpi-card">
          <span class="startup-kpi-label">Universe</span>
          <span class="startup-kpi-value">${total}</span>
        </div>
        <div class="startup-kpi-card">
          <span class="startup-kpi-label">Italy Focus</span>
          <span class="startup-kpi-value">${italyCount}</span>
        </div>
        <div class="startup-kpi-card">
          <span class="startup-kpi-label">Portfolio</span>
          <span class="startup-kpi-value">${totalPortfolio}</span>
        </div>
      </div>
      <div class="startup-dealflow-toolbar">
        <div class="startup-dealflow-tabs">${tabs}</div>
        <label class="startup-dealflow-search-wrap">
          <span class="startup-dealflow-search-icon">⌕</span>
          <input class="startup-dealflow-search" type="text" placeholder="Search startup, city, sector, stage" value="${escapeHtml(this.filters.query)}" />
          ${this.filters.query ? '<button type="button" class="startup-dealflow-clear" aria-label="Clear search">×</button>' : ''}
        </label>
      </div>
      <div class="startup-dealflow-toolbar startup-dealflow-subtoolbar">
        <div class="startup-dealflow-tabs">${geos}</div>
        <div class="startup-filter-controls">
          <select class="startup-stage-select" aria-label="Filter by stage">
            <option value="all"${this.filters.stage === 'all' ? ' selected' : ''}>All stages</option>
            <option value="pre-seed"${this.filters.stage === 'pre-seed' ? ' selected' : ''}>Pre-seed</option>
            <option value="seed"${this.filters.stage === 'seed' ? ' selected' : ''}>Seed</option>
            <option value="series-a"${this.filters.stage === 'series-a' ? ' selected' : ''}>Series A</option>
            <option value="growth"${this.filters.stage === 'growth' ? ' selected' : ''}>Growth</option>
          </select>
          <label class="startup-website-toggle">
            <input type="checkbox" class="startup-website-only"${this.filters.websiteOnly ? ' checked' : ''} />
            <span>Only with site</span>
          </label>
          <button type="button" class="startup-secondary-btn startup-filter-reset">Reset</button>
          <button type="button" class="startup-secondary-btn startup-export-btn">Export CSV</button>
        </div>
      </div>
      <div class="startup-dealflow-table-wrap">
        <table class="startup-dealflow-table">
          <thead>
            <tr>
              <th>Startup</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Sectors</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="5" class="startup-dealflow-empty">No startup found</td></tr>'}
          </tbody>
        </table>
      </div>
      </div>
    `);
  }
}
