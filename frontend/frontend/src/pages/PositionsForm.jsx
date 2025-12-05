import { useEffect, useState } from 'react';
import { mockData } from '../services/api';

export default function PositionsForm() {
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem('pt_positions');
    return saved ? JSON.parse(saved) : mockData.positions;
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('pt_positions', JSON.stringify(rows));
  }, [rows]);

  const addRow = () => setRows((r) => [...r, { symbol: '', name: '', qty: 0, avgCost: 0, price: 0, weight: 0 }]);
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));
  const update = (i, key, val) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  };

  const onSave = (e) => {
    e.preventDefault();
    setMessage('Saved locally. Backend wiring pending.');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div>
      <h1 style={{ margin: '0 0 8px' }}>Positions</h1>
      <p className="subtitle" style={{ marginTop: 0 }}>
        Add or edit your holdings. Currently saved to localStorage (mock).
      </p>

      {message && <div className="banner">{message}</div>}

      <form onSubmit={onSave}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Avg Cost</th>
                <th>Price</th>
                <th>Weight %</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td><input className="input" value={row.symbol} onChange={(e)=>update(i,'symbol',e.target.value.toUpperCase())} /></td>
                  <td><input className="input" value={row.name} onChange={(e)=>update(i,'name',e.target.value)} /></td>
                  <td><input className="input" type="number" value={row.qty} onChange={(e)=>update(i,'qty',Number(e.target.value))} /></td>
                  <td><input className="input" type="number" step="0.01" value={row.avgCost} onChange={(e)=>update(i,'avgCost',Number(e.target.value))} /></td>
                  <td><input className="input" type="number" step="0.01" value={row.price} onChange={(e)=>update(i,'price',Number(e.target.value))} /></td>
                  <td><input className="input" type="number" step="0.1" value={row.weight} onChange={(e)=>update(i,'weight',Number(e.target.value))} /></td>
                  <td><button type="button" className="secondary" onClick={()=>removeRow(i)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display:'flex', gap:8, marginTop:12 }}>
          <button type="button" className="secondary" onClick={addRow}>Add Row</button>
          <button type="submit" className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}