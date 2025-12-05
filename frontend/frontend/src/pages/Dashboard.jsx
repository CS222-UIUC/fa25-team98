import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { useEffect, useState } from 'react';
import { api, mockData } from '../services/api';
import Sparkline from '../components/Sparkline';

const COLORS = ["#2563eb","#06b6d4","#22c55e","#f59e0b","#ef4444","#a855f7"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [portfolio, setPortfolio] = useState(mockData.portfolio);
  const [positions, setPositions] = useState(mockData.positions);
  const [allocation, setAllocation] = useState(mockData.allocation);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('pt_token') || '';
    if (!token) {
      setUsingMock(true);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [pf, pos, alloc] = await Promise.all([
          api.portfolio(token),
          api.positions(token),
          api.allocation(token),
        ]);
        setPortfolio(pf);
        setPositions(pos);
        setAllocation(alloc);
      } catch (e) {
        setError('API unreachable, showing mock data.');
        setUsingMock(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalValue = portfolio.value;
  const dayChange = portfolio.dayChange;
  const dayPct = portfolio.dayPct;

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: '0 0 8px' }}>Dashboard</h1>
        <p className="subtitle" style={{ marginTop: 0 }}>Loading portfolio…</p>
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    );
  }

  const risk = { beta: 1.12, vol30d: 18.5, sharpe1y: 1.4 };

  return (
    <div>
      <h1 style={{ margin: '0 0 8px' }}>Dashboard</h1>
      <p className="subtitle" style={{ marginTop: 0 }}>
        {usingMock ? 'Mock portfolio overview.' : 'Live portfolio overview.'}
      </p>

      {(usingMock || error) && (
        <div className="banner">
          <span>{error || 'Using mock data. Set a token and run FastAPI to fetch live data.'}</span>
        </div>
      )}

      <section className="kpis">
        <div className="kpi-card">
          <div className="kpi-label">Total Value</div>
          <div className="kpi-value">${totalValue.toLocaleString()}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Day Change</div>
          <div
            className="kpi-value"
            style={{
              color: dayChange >= 0 ? "#22c55e" : "#ef4444",
            }}
          >
            {dayChange >= 0 ? "+" : "-"}
            ${Math.abs(dayChange).toLocaleString()} ({dayPct}%)
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">1M Return</div>
          <div className="kpi-value" style={{ color: "#22c55e" }}>
            +5.4%
          </div>
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
              <AreaChart
                data={mockData.portfolioHistory}
                margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#9aa4b2" />
                <YAxis
                  stroke="#9aa4b2"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v) => [`$${v.toLocaleString()}`, "Value"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#pv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Allocation</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={allocation}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {allocation.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Daily P&L</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={mockData.dailyPnl}
                margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
              >
                <XAxis dataKey="date" stroke="#9aa4b2" />
                <YAxis stroke="#9aa4b2" />
                <Tooltip formatter={(v) => [`$${v}`, "P&L"]} />
                <Bar dataKey="pnl" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Risk Metrics</h3>
          <div className="chart-wrap">
            <div className="risk-metrics">
              <div className="risk-metric">
                <div className="metric-label">Beta</div>
                <div className="metric-value">{risk.beta.toFixed(2)}</div>
              </div>
              <div className="risk-metric">
                <div className="metric-label">30d Volatility</div>
                <div className="metric-value">{risk.vol30d.toFixed(1)}%</div>
              </div>
              <div className="risk-metric">
                <div className="metric-label">1Y Sharpe Ratio</div>
                <div className="metric-value">{risk.sharpe1y.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Notes</h3>
          <p className="muted" style={{ marginTop: 8 }}>
            • Data shown is mock unless FastAPI is running.
            <br />• Use your token to fetch user portfolio.
            <br />• Cache symbols in Postgres to reduce API calls.
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
