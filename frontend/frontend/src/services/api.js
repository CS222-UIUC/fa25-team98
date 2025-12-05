const BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';

async function request(path, { method = 'GET', token, body, headers } = {}) {
  const url = (BASE || '') + path;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-pt-token': token } : {}),
      ...(headers || {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  health: () => request('/api/health'),
  portfolio: (token) => request('/api/portfolio', { token }),
  positions: (token) => request('/api/positions', { token }),
  allocation: (token) => request('/api/allocation', { token }),
  upsertPosition: (token, position) => request('/api/positions', { method: 'POST', token, body: position }),
  timelines: (token) => request('/api/timelines', { token }),
  politicians: (token) => request('/api/politicians', { token }),
  alerts: (token) => request('/api/alerts', { token }),
  createAlert: (token, payload) => request('/api/alerts', { method: 'POST', token, body: payload }),
  reports: (token) => request('/api/reports', { token }),
};

// Expanded mock data
export const mockData = {
  portfolio: { value: 52340, dayChange: 532, dayPct: 1.03 },
  positions: [
    { symbol: 'AAPL', name: 'Apple Inc.', qty: 24, avgCost: 168.12, price: 177.22, weight: 18 },
    { symbol: 'MSFT', name: 'Microsoft', qty: 12, avgCost: 362.15, price: 375.31, weight: 16 },
    { symbol: 'NVDA', name: 'NVIDIA', qty: 6,  avgCost: 844.20, price: 867.90, weight: 12 },
    { symbol: 'VOO',  name: 'S&P 500 ETF', qty: 10, avgCost: 505.40, price: 512.10, weight: 12 },
    { symbol: 'TSLA', name: 'Tesla', qty: 8, avgCost: 232.10, price: 228.70, weight: 8 },
    { symbol: 'GOOG', name: 'Alphabet', qty: 10, avgCost: 140.10, price: 145.30, weight: 8 },
    { symbol: 'AMZN', name: 'Amazon', qty: 7, avgCost: 125.50, price: 131.40, weight: 7 },
    { symbol: 'META', name: 'Meta', qty: 4, avgCost: 332.00, price: 345.10, weight: 6 },
    { symbol: 'AMD',  name: 'AMD', qty: 10, avgCost: 112.40, price: 118.10, weight: 5 },
    { symbol: 'NFLX', name: 'Netflix', qty: 3, avgCost: 580.00, price: 592.20, weight: 4 },
    { symbol: 'CASH', name: 'Cash', qty: 1, avgCost: 1.00, price: 1.00, weight: 4 },
  ],
  allocation: [
    { name: 'AAPL', value: 18 },
    { name: 'MSFT', value: 16 },
    { name: 'NVDA', value: 12 },
    { name: 'VOO', value: 12 },
    { name: 'TSLA', value: 8 },
    { name: 'GOOG', value: 8 },
    { name: 'AMZN', value: 7 },
    { name: 'META', value: 6 },
    { name: 'AMD', value: 5 },
    { name: 'NFLX', value: 4 },
    { name: 'CASH', value: 4 },
  ],
  portfolioHistory: [
    { date: "11/01", value: 48000 },
    { date: "11/05", value: 48950 },
    { date: "11/09", value: 49210 },
    { date: "11/13", value: 50120 },
    { date: "11/17", value: 49750 },
    { date: "11/21", value: 50580 },
    { date: "11/25", value: 51240 },
    { date: "11/29", value: 51700 },
    { date: "12/02", value: 52120 },
    { date: "12/04", value: 52340 },
  ],
  dailyPnl: [
    { date: "11/25", pnl: 220 },
    { date: "11/26", pnl: -80 },
    { date: "11/27", pnl: 140 },
    { date: "11/28", pnl: 60 },
    { date: "11/29", pnl: 190 },
    { date: "12/01", pnl: -40 },
    { date: "12/02", pnl: 120 },
    { date: "12/03", pnl: 90 },
    { date: "12/04", pnl: 160 },
  ],
  watchlist: [
    { symbol: 'AAPL', last: 177.22, chg: 1.85, chgPct: 1.06, spark: [170,171,169,172,174,176,175,176,177] },
    { symbol: 'MSFT', last: 375.31, chg: -2.10, chgPct: -0.56, spark: [370,372,371,373,374,376,377,374,375] },
    { symbol: 'NVDA', last: 867.90, chg: 9.40, chgPct: 1.10, spark: [820,830,835,840,850,855,860,862,868] },
    { symbol: 'TSLA', last: 228.70, chg: -1.30, chgPct: -0.57, spark: [236,235,234,233,232,231,230,229,228] },
    { symbol: 'VOO', last: 512.10, chg: 0.80, chgPct: 0.16, spark: [506,507,508,509,510,510,511,511,512] },
  ],
  news: [
    { id: 'n1', title: 'Tech leads gains as broader market rallies', source: 'Reuters', time: '2h ago', url: '#' },
    { id: 'n2', title: 'Chipmakers climb on data center demand', source: 'Bloomberg', time: '4h ago', url: '#' },
    { id: 'n3', title: 'EVs mixed ahead of delivery updates', source: 'WSJ', time: '6h ago', url: '#' },
  ],
  activity: [
    { id: 'tr1', date: '2025-11-28', action: 'BUY', symbol: 'VOO', qty: 2, price: 509.20 },
    { id: 'tr2', date: '2025-11-22', action: 'BUY', symbol: 'AAPL', qty: 4, price: 175.10 },
    { id: 'tr3', date: '2025-11-15', action: 'SELL', symbol: 'TSLA', qty: 2, price: 236.40 },
  ],
  timelines: [
    { label: 'Hold NVDA from Jan', value: 14.2 },
    { label: 'Rotate into VOO Mar', value: 6.3 },
    { label: 'Add AAPL Jul', value: 3.8 },
  ],
  timelineSeries: {
    current: [
      { date: '11/01', value: 48000 },
      { date: '11/10', value: 49250 },
      { date: '11/20', value: 50500 },
      { date: '12/01', value: 52120 },
      { date: '12/04', value: 52340 },
    ],
    scenarios: [
      { key: 'nvda_jan', label: 'Hold NVDA from Jan', series: [
        { date: '11/01', value: 48200 }, { date: '11/10', value: 49700 }, { date: '11/20', value: 51020 }, { date: '12/04', value: 53400 }
      ]},
      { key: 'voo_mar', label: 'Rotate into VOO Mar', series: [
        { date: '11/01', value: 47900 }, { date: '11/10', value: 48850 }, { date: '11/20', value: 49980 }, { date: '12/04', value: 51800 }
      ]},
    ],
  },
  politicians: [
    {
      name: 'Nancy Pelosi',
      portfolioOverlap: 22,
      tweets: [
        { id: 't1', text: 'Strong innovation leads the market.', date: '2025-11-12', sentiment: 'positive' },
        { id: 't2', text: 'Concern about regulation impacts.', date: '2025-11-18', sentiment: 'negative' },
      ],
      positions: [{ symbol: 'AAPL', weight: 18 }, { symbol: 'MSFT', weight: 14 }, { symbol: 'NVDA', weight: 10 }],
    },
    {
      name: 'Dan Crenshaw',
      portfolioOverlap: 12,
      tweets: [
        { id: 't3', text: 'Tech outlook remains mixed.', date: '2025-11-09', sentiment: 'neutral' },
      ],
      positions: [{ symbol: 'XOM', weight: 20 }, { symbol: 'MSFT', weight: 8 }],
    },
  ],
  sentimentSeries: [
    { date: '11/01', positive: 6, neutral: 8, negative: 3 },
    { date: '11/10', positive: 8, neutral: 6, negative: 2 },
    { date: '11/20', positive: 7, neutral: 7, negative: 4 },
    { date: '12/01', positive: 9, neutral: 5, negative: 3 },
  ],
  alerts: [
    { id: 'a1', symbol: 'AAPL', above: 180, created: '2025-11-01' },
    { id: 'a2', symbol: 'NVDA', below: 800, created: '2025-11-05' },
  ],
  reports: [
    { id: 'r1', title: 'Transactions Q3', generated: '2025-10-20', url: '#' },
    { id: 'r2', title: 'Holdings Snapshot', generated: '2025-11-01', url: '#' },
  ],
};