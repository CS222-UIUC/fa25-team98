const BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';

async function request(path, { method = 'GET', token, body, headers } = {}) {
  const url = (BASE || '') + path; // if BASE is '', rely on Vite proxy for /api
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
};