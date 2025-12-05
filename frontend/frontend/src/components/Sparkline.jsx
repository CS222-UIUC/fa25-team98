import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Sparkline({ data = [], color = '#06b6d4' }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div style={{ width: 100, height: 30 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id="spline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area dataKey="v" type="monotone" stroke={color} fill="url(#spline)" strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}