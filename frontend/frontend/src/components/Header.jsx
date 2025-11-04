import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../assets/react.svg';

export default function Header() {
  const { pathname } = useLocation();
  const [token, setToken] = useState(localStorage.getItem('pt_token') || '');
  const [open, setOpen] = useState(false);
  const short = token ? token.slice(0, 6) + '…' : '';

  useEffect(() => {
    if (token) localStorage.setItem('pt_token', token);
  }, [token]);

  const onSave = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const t = (form.get('token') || '').toString().trim();
    setToken(t);
    if (t) localStorage.setItem('pt_token', t);
    else localStorage.removeItem('pt_token');
    setOpen(false);
  };

  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-left">
        <img src={logo} className="logo" alt="PortfolioTracker logo" />
        <span className="brand">PortfolioTracker</span>
      </div>
      <div className="nav-right">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/dashboard" className={`btn ${pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>

        {token ? (
          <span className="token-pill" title={token}>
            Token: {short}
            <button className="link" onClick={() => setOpen(true)}>change</button>
            <button className="link" onClick={() => { setToken(''); localStorage.removeItem('pt_token'); }}>clear</button>
          </span>
        ) : (
          <button className="btn" onClick={() => setOpen(true)}>Set Token</button>
        )}
      </div>

      {open && (
        <div className="modal">
          <form className="modal-card" onSubmit={onSave}>
            <h3 style={{ marginTop: 0 }}>Set session token</h3>
            <p className="muted" style={{ marginTop: 0 }}>Use this token to fetch your portfolio without login.</p>
            <input name="token" placeholder="e.g. abc123" defaultValue={token} className="input" autoFocus />
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" className="primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </nav>
  );
}