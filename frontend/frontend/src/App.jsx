import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import logo from './assets/react.svg';

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

export default function App() {
  return (
    <div className="App">
      <header className="hero">
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-left">
            <img src={logo} className="logo" alt="PortfolioTracker logo" />
            <span className="brand">PortfolioTracker</span>
          </div>
          <div className="nav-right">
            <a href="#features">Features</a>
            <a href="/signup" className="btn">Get Started</a>
          </div>
        </nav>

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
            <Feature title="Export & alerts">
              Price alerts, exportable transaction reports and basic tax-ready summaries.
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

      <footer className="footer">
        <p>© {new Date().getFullYear()} Portfolio Tracker — Team 98</p>
      </footer>
    </div>
  );
}
