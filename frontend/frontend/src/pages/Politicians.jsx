import { mockData } from '../services/api';

function SentimentBadge({ s }) {
  const map = { positive: '#22c55e', neutral: '#9aa4b2', negative: '#ef4444' };
  return (
    <span style={{
      display:'inline-block', padding:'2px 8px', borderRadius:999,
      border:'1px solid rgba(255,255,255,0.1)', color: map[s] || '#9aa4b2'
    }}>
      {s}
    </span>
  );
}

export default function Politicians() {
  return (
    <div>
      <h1 style={{ margin: '0 0 8px' }}>Politician Comparison</h1>
      <p className="subtitle" style={{ marginTop: 0 }}>
        Compare your portfolio to public figures and browse tweet sentiment (mock).
      </p>

      <div className="feature-grid">
        {mockData.politicians.map((p) => (
          <div key={p.name} className="feature">
            <h3 style={{ marginBottom: 4 }}>{p.name}</h3>
            <p className="muted" style={{ marginBottom: 8 }}>
              Overlap with your portfolio: {p.portfolioOverlap}%
            </p>

            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:8 }}>
              {p.positions.map((pos) => (
                <span key={pos.symbol} style={{
                  padding:'4px 8px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)'
                }}>
                  {pos.symbol} · {pos.weight}%
                </span>
              ))}
            </div>

            <div style={{ marginTop: 8 }}>
              <strong>Tweets</strong>
              <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                {p.tweets.map((t) => (
                  <li key={t.id} style={{ marginBottom: 6 }}>
                    <span className="muted" style={{ marginRight: 8 }}>{t.date}</span>
                    <SentimentBadge s={t.sentiment} />
                    <span style={{ marginLeft: 8 }}>{t.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}