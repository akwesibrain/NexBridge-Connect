import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const AXIS = { fontSize: 11, fill: "#9a8f86" };
const kfmt = (n) => {
  const a = Math.abs(n);
  if (a >= 1e6) return `${(n / 1e6).toFixed(a % 1e6 ? 1 : 0)}M`;
  if (a >= 1e3) return `${Math.round(n / 1e3)}k`;
  return `${n}`;
};
const tip = {
  contentStyle: { borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(16,24,40,.12)", fontSize: 12 },
  labelStyle: { color: "#162344", fontWeight: 600 },
};

export function AreaTrend({ data, x = "label", series, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: 4, right: 10, top: 8 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#efe7dd" vertical={false} />
        <XAxis dataKey={x} tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} width={50} tickFormatter={kfmt} />
        <Tooltip {...tip} />
        {series.map((s) => (
          <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} fill={`url(#g-${s.key})`} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Bars({ data, x = "label", series, height = 260, stacked }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: 4, right: 10, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#efe7dd" vertical={false} />
        <XAxis dataKey={x} tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} width={50} tickFormatter={kfmt} />
        <Tooltip {...tip} cursor={{ fill: "#f7f3ee" }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={stacked ? 0 : [5, 5, 0, 0]} stackId={stacked ? "a" : undefined} maxBarSize={38} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LineTrend({ data, x = "label", series, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: 4, right: 10, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#efe7dd" vertical={false} />
        <XAxis dataKey={x} tick={AXIS} axisLine={false} tickLine={false} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} width={50} tickFormatter={kfmt} />
        <Tooltip {...tip} />
        {series.map((s) => <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false} />)}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data, height = 230 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={85} paddingAngle={2} stroke="none">
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip {...tip} />
      </PieChart>
    </ResponsiveContainer>
  );
}
