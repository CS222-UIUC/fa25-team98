import { useState } from 'react';
import { mockData } from '../services/api';

export default function ReportsAlerts() {
  const [alerts, setAlerts] = useState(mockData.alerts);
  const [form, setForm] = useState({ symbol: 'AAPL', above: '', below: '' });

  const addAlert = (e) => {
    e.preventDefault();
    const id = 'a' + (Math.random().toString(36).slice(2));
    setAlerts((a) => [...a, { id, symbol: form.symbol, above: form.above ? Number(form.above) : undefined, below: form.below ? Number(form.below) : undefined, created: new Date().toISOString().slice(0,10) }]);
    setForm({ symbol: 'AAPL', above: '', below: '' });
  };

  return (
    <div>
      <h1 style={{ margin: '0 0 8px' }}>Reports & Alerts</h1>
      <p className="subtitle" style={{ marginTop: 0 }}>
        Create simple price alerts and view downloadable mock reports.
      </p>

      <section className="feature-grid" style={{ alignItems:'start' }}>
        <div className="feature">
          <h3>Create Alert</h3>
          <form onSubmit={addAlert}>
            <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 1fr 1fr' }}>
              <input className="input" value={form.symbol} onChange={(e)=>setForm(f=>({ ...f, symbol: e.target.value.toUpperCase() }))} placeholder="Symbol" />
              <input className="input" type="number" step="0.01" value={form.above} onChange={(e)=>setForm(f=>({ ...f, above: e.target.value }))} placeholder="Above price" />
              <input className="input" type="number" step="0.01" value={form.below} onChange={(e)=>setForm(f=>({ ...f, below: e.target.value }))} placeholder="Below price" />
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="primary">Add alert</button>
            </div>
          </form>

          <ul style={{ paddingLeft: 18, marginTop: 12 }}>
            {alerts.map(a => (
              <li key={a.id} className="muted">
                [{a.created}] {a.symbol} {a.above ? `above $${a.above}` : ''} {a.below ? `below $${a.below}` : ''}
              </li>
            ))}
          </ul>
        </div>

        <div className="feature">
          <h3>Reports</h3>
          <ul style={{ paddingLeft: 18 }}>
            {mockData.reports.map(r => (
              <li key={r.id}>
                {r.title} — generated {r.generated} — <a href={r.url}>Download</a>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ marginTop: 8 }}>
            Replace with backend-generated CSV/PDF links later.
          </p>
        </div>
      </section>
    </div>
  );
}