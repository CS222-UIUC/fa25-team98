import { Routes, Route, Link, Outlet } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import PositionsForm from './pages/PositionsForm';
import Timelines from './pages/Timelines';
import Politicians from './pages/Politicians';
import ReportsAlerts from './pages/ReportsAlerts';

function Feature({ title, children }) {
  return (
    <div className="feature">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function TeamCard({ name, handle }) {
  return (
    <div className="feature">
      <h3>{name}</h3>
      <p className="muted">{handle}</p>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <h1>Portfolio Tracker — with personality</h1>
          <p className="subtitle">
            Track your holdings, view live prices and visualise alternative timelines. Compare your portfolio to public figures and see sentiment context from social posts.
          </p>
          <div className="hero-ctas">
            <a href="/signup" className="primary">Create an account</a>
            <a href="#features" className="secondary">See features</a>
          </div>
        </div>
      </header>

      <main>
        <section id="features" className="features">
          <h2>Core features</h2>
          <div className="feature-grid">
            <Feature title="Easy portfolio input">
              Add positions manually or import transactions. Token-based sessions let you revisit your portfolio without signing in.
            </Feature>
            <Feature title="Live & historical data">
              Daily updates and historical series pulled from market APIs to build performance charts and alternative timelines.
            </Feature>
            <Feature title="Alternative timelines">
              Reconstruct "what-if" scenarios for positions you held historically and compare outcomes to your current portfolio.
            </Feature>
            <Feature title="Politician comparisons">
              Compare allocation and performance against public figures and explore the timeline of their public posts.
            </Feature>
            <Feature title="Sentiment context">
              NLP-powered sentiment analysis surfaces how social posts relate to positions and market moves.
            </Feature>
          </div>
        </section>

        <section id="how" className="how">
          <h2>How it works</h2>
          <ol>
            <li>Input or import your portfolio and receive a persistent token.</li>
            <li>The backend fetches market data and caches it in Postgres for efficiency.</li>
            <li>Visualise performance, run alternative timelines and compare sentiment from social feeds.</li>
          </ol>
        </section>

        <section id="team" className="features">
          <h2>Team</h2>
          <div className="feature-grid">
            <TeamCard name="Uzair" handle="uzairs2 — backend, API, Docker" />
            <TeamCard name="Youngjin" handle="ys62 — frontend, Recharts, UI" />
            <TeamCard name="Hugh" handle="ahs6 — data, product ideas" />
          </div>
        </section>

        <section id="signup" className="signup">
          <h2>Ready to try it?</h2>
          <a href="/signup" className="primary large">Create a token-based session</a>
        </section>
      </main>
    </>
  );
}

function Layout() {
  return (
    <div className="App">
      <Header />
      <Outlet />
      <footer className="footer">
        <p>© {new Date().getFullYear()} Portfolio Tracker — Team 98</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/positions" element={<PositionsForm />} />
        <Route path="/timelines" element={<Timelines />} />
        <Route path="/politicians" element={<Politicians />} />
        <Route path="/reports" element={<ReportsAlerts />} />
        <Route path="*" element={<div style={{ padding: 24 }}>Page not found.</div>} />
      </Route>
    </Routes>
  );
}
