import { useMemo, useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './FraudNetworkGraph.css';

type Risk = 'high' | 'medium' | 'low';

type GraphNode = {
  id: string;
  name: string;
  risk: Risk;
};

type GraphLink = { source: string; target: string };

const RISK_COLOR: Record<Risk, string> = {
  high: '#f87171',
  medium: '#fbbf24',
  low: '#4ade80',
};

const MOCK_NODES: GraphNode[] = [
  { id: 'n1', name: 'Shell Corp A', risk: 'high' },
  { id: 'n2', name: 'Front Account', risk: 'high' },
  { id: 'n3', name: 'Mule Ring', risk: 'high' },
  { id: 'n4', name: 'Payment Hub', risk: 'medium' },
  { id: 'n5', name: 'Merchant X', risk: 'medium' },
  { id: 'n6', name: 'User 8821', risk: 'low' },
  { id: 'n7', name: 'User 4410', risk: 'low' },
  { id: 'n8', name: 'Crypto Mixer', risk: 'high' },
  { id: 'n9', name: 'Bank Branch', risk: 'low' },
];

const MOCK_LINKS: GraphLink[] = [
  { source: 'n1', target: 'n2' },
  { source: 'n2', target: 'n3' },
  { source: 'n3', target: 'n8' },
  { source: 'n4', target: 'n5' },
  { source: 'n5', target: 'n6' },
  { source: 'n6', target: 'n7' },
  { source: 'n1', target: 'n4' },
  { source: 'n8', target: 'n4' },
  { source: 'n9', target: 'n6' },
  { source: 'n7', target: 'n9' },
];

export function FraudNetworkGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 600, height: 280 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({
        width: Math.max(320, el.clientWidth),
        height: Math.max(260, el.clientHeight),
      });
    });
    ro.observe(el);
    setDims({
      width: Math.max(320, el.clientWidth),
      height: Math.max(260, el.clientHeight),
    });
    return () => ro.disconnect();
  }, []);

  const graphData = useMemo(
    () => ({
      nodes: MOCK_NODES.map((n) => ({ ...n })),
      links: MOCK_LINKS.map((l) => ({ ...l })),
    }),
    [],
  );

  return (
    <section className="graph-panel" aria-label="Fraud network graph">
      <h2 className="graph-panel__header">Fraud ring network</h2>
      <div className="graph-panel__legend" aria-hidden="true">
        <span>
          <span className="graph-panel__dot" style={{ background: RISK_COLOR.high }} />
          High risk
        </span>
        <span>
          <span className="graph-panel__dot" style={{ background: RISK_COLOR.medium }} />
          Medium
        </span>
        <span>
          <span className="graph-panel__dot" style={{ background: RISK_COLOR.low }} />
          Low
        </span>
      </div>
      <div className="graph-panel__canvas-wrap" ref={wrapRef}>
        <ForceGraph2D
          width={dims.width}
          height={dims.height}
          graphData={graphData}
          backgroundColor="#0b1220"
          nodeLabel="name"
          nodeColor={(n) => RISK_COLOR[(n as GraphNode).risk] ?? '#94a3b8'}
          linkColor={() => 'rgba(148, 163, 184, 0.35)'}
          linkWidth={1.2}
          cooldownTicks={120}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.25}
        />
      </div>
      <p className="graph-panel__hint">Drag nodes to explore. Links show suspected fund-flow ties (mock).</p>
    </section>
  );
}
