import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './FraudScoreMonitor.css';

const THRESHOLD = 72;

function buildSeedPoints() {
  const base = Date.now() - 24 * 60 * 1000;
  const out: { t: string; score: number; ts: number }[] = [];
  let v = 38;
  for (let i = 0; i < 20; i++) {
    const ts = base + i * (72 * 60 * 1000) / 20;
    v = Math.min(95, Math.max(18, v + (Math.random() - 0.45) * 14));
    out.push({
      ts,
      t: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: Math.round(v * 10) / 10,
    });
  }
  return out;
}

export function FraudScoreMonitor() {
  const [data, setData] = useState(() => buildSeedPoints());

  useEffect(() => {
    const id = window.setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const nextScore = Math.min(
          98,
          Math.max(15, last.score + (Math.random() - 0.48) * 12),
        );
        const ts = Date.now();
        const row = {
          ts,
          t: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          score: Math.round(nextScore * 10) / 10,
        };
        const next = [...prev.slice(-35), row];
        return next;
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  const latest = data[data.length - 1]?.score ?? 0;
  const over = latest > THRESHOLD;

  const chartData = useMemo(
    () => data.map(({ t, score }) => ({ t, score })),
    [data],
  );

  return (
    <section className="score-panel" aria-label="Fraud score monitor">
      <h2 className="score-panel__header">Living fraud score</h2>
      {over ? (
        <p className="score-panel__alert" role="alert">
          Alert: score {latest.toFixed(1)} exceeds threshold ({THRESHOLD}) — review queued
          transactions.
        </p>
      ) : (
        <p className="score-panel__ok">Score within normal band (threshold {THRESHOLD}).</p>
      )}
      <div className="score-panel__chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.15)" strokeDasharray="3 3" />
            <XAxis dataKey="t" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} width={36} />
            <Tooltip
              contentStyle={{
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: 8,
                color: '#f3f4f6',
              }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <ReferenceLine
              y={THRESHOLD}
              stroke="#f87171"
              strokeDasharray="5 5"
              label={{ value: 'Limit', fill: '#f87171', fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="score-panel__meta">
        Mock stream updates every ~3s. Latest: <strong>{latest.toFixed(1)}</strong>
      </p>
    </section>
  );
}
