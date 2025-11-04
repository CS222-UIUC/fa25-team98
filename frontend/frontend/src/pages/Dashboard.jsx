import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const COLORS = ['#2563eb', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#a855f7'];

const portfolioHistory = [
  { date: '10/01', value: 48000 },
  { date: '10/03', value: 48650 },
  { date: '10/05', value: 49210 },
  { date: '10/07', value: 50120 },
  { date: '10/09', value: 49750 },
  { date: '10/11', value: 50580 },
  { date: '10/13', value: 51240 },
  { date: '10/15', value: 51700 },
  { date: '10/17', value: 52120 },
  { date: '10/19', value: 52340 },
];

const allocation = [
  { name: 'AAPL', value: 28 },
  { name: 'MSFT', value: 24 },
  { name: 'NVDA', value: 18 },
  { name: 'VOO',  value: 15 },
  { name: 'TSLA', value: 10 },
  { name: 'CASH', value: 5 },
];

const dailyPnl = [
  { date: '10/11', pnl: 220 },
  { date: '10/12', pnl: -80 },
  { date: '10/13', pnl: 140 },
  { date: '10/14', pnl: 60 },
  { date: '10/15', pnl: 190 },
  { date: '10/16', pnl: -40 },
  { date: '10/17', pnl: 120 },
  { date: '10/18', pnl: 90 },
  { date: '10/19', pnl: 160 },
];

const positions = [
  { symbol: 'AAPL', name: 'Apple Inc.', qty: 24, avgCost: 168.12, price: 177.22, weight: 28 },
  { symbol: 'MSFT', name: 'Microsoft', qty: 12, avgCost: 362.15, price: 375.31, weight: 24 },
  { symbol: 'NVDA', name: 'NVIDIA', qty: 6,  avgCost: 844.20, price: 867.90, weight: 18 },
  { symbol: 'VOO',  name: 'S&P 500 ETF', qty: 10, avgCost: 505.40, price: 512.10, weight: 15 },
  { symbol: 'TSLA', name: 'Tesla', qty: 8, avgCost: 232.10, price: 228.70, weight: 10 },
];

export default function Dashboard() {
  const totalValue = 52340;
  const dayChange = 532;
  const dayPct = (dayChange / (totalValue - dayChange) * 100).toFixed(2);

  const token = typeof window !== 'undefined' ? localStorage.getItem('pt_token') : '';
  const usingMock = !token; // simple indicator for now

  return (
    <div>
      <h1 style={{ margin: '0 0 8px' }}>Dashboard</h1>
      <p className="subtitle" style={{ marginTop: 0 }}>
        Mock portfolio overview with charts, allocation, and positions.
      </p>

      {usingMock && (
        <div className="banner">
          <span>Using mock data. Set a token to fetch from FastAPI when it’s running.</span>
        </div>
      )}

      <section className="kpis">
        <div className="kpi-card">
          <div className="kpi-label">Total Value</div>
          <div className="kpi-value">${totalValue.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Day Change</div>
          <div className="kpi-value" style={{ color: '#22c55e' }}>
            +${dayChange.toLocaleString()} ({dayPct}%)
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">1M Return</div>
          <div className="kpi-value" style={{ color: '#22c55e' }}>+5.4%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Best Performer</div>
          <div className="kpi-value">NVDA +2.8%</div>
        </div>
      </section>

      <section className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Portfolio Value</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={portfolioHistory} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#9aa4b2" />
                <YAxis stroke="#9aa4b2" tickFormatter={(v)=>`$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v)=>[`$${v.toLocaleString()}`, 'Value']} />
                <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#pv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Allocation</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" outerRadius={90} label>
                  {allocation.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(v, n)=>[`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Daily P&L</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dailyPnl} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#9aa4b2" />
                <YAxis stroke="#9aa4b2" />
                <Tooltip formatter={(v)=>[`$${v}`, 'P&L']} />
                <Bar dataKey="pnl" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Notes</h3>
          <p className="muted" style={{ marginTop: 8 }}>
            • Data shown is mock. Replace with FastAPI endpoints later.
            <br/>• Use your token session to fetch user portfolio.
            <br/>• Cache symbols in Postgres to reduce API calls.
          </p>
        </div>
      </section>

      <section className="positions">
        <h3 style={{ marginBottom: 12 }}>Positions</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Avg Cost</th>
                <th>Price</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.symbol}>
                  <td>{p.symbol}</td>
                  <td className="muted">{p.name}</td>
                  <td>{p.qty}</td>
                  <td>${p.avgCost.toFixed(2)}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.weight}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}