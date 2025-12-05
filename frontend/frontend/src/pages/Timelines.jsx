import { mockData } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Timelines() {
  return (
    <div>
      <h1 style={{ margin: '0 0 8px' }}>Alternative Timelines</h1>
      <p className="subtitle" style={{ marginTop: 0 }}>
        Explore what-if scenarios and compare to your current portfolio (mock).
      </p>

      <div className="chart-card" style={{ marginTop: 12 }}>
        <h3 className="chart-title">Scenario returns vs current</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mockData.timelines}>
              <XAxis dataKey="label" stroke="#9aa4b2" />
              <YAxis stroke="#9aa4b2" tickFormatter={(v)=>`${v}%`} />
              <Tooltip formatter={(v)=>[`${v}%`, 'Return']} />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="feature-grid" style={{ marginTop: 16 }}>
        <div className="feature">
          <h3>Create a scenario</h3>
          <p className="muted">Select a historical date and define buy/sell rules. Backend will compute the path later.</p>
        </div>
        <div className="feature">
          <h3>Compare allocations</h3>
          <p className="muted">See how allocation would have differed and its effect on drawdowns and returns.</p>
        </div>
      </div>
    </div>
  );
}