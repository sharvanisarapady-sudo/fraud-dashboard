import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  type GeographySpec,
} from 'react-simple-maps';
import { fraudRateToColor, getFraudRateForState } from '../data/indiaFraudRates';
import './IndiaFraudHeatmap.css';

const INDIA_GEO_URL =
  'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/geojson/india.geojson';

type GeoJson = {
  type: string;
  features: Array<{
    type: string;
    properties: Record<string, string | undefined>;
    geometry: unknown;
  }>;
};

type TooltipState = {
  x: number;
  y: number;
  state: string;
  district: string;
  rate: number;
};

function geoProps(geo: GeographySpec) {
  const p = geo.properties;
  const st = typeof p.st_nm === 'string' ? p.st_nm : '';
  const district = typeof p.district === 'string' ? p.district : '';
  return { st, district };
}

export function IndiaFraudHeatmap() {
  const [geoData, setGeoData] = useState<GeoJson | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(INDIA_GEO_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.json();
      })
      .then((data: GeoJson) => {
        if (!cancelled) setGeoData(data);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setLoadError(e instanceof Error ? e.message : 'Failed to load map data');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const clearTip = useCallback(() => setTooltip(null), []);

  return (
    <section className="heatmap-panel" aria-label="India fraud heatmap">
      <h2 className="heatmap-panel__header">India fraud heatmap</h2>
      <div className="heatmap-panel__scale">
        <span>Lower risk</span>
        <div className="heatmap-panel__gradient" aria-hidden="true" />
        <span>Higher risk</span>
      </div>
      <div className="heatmap-panel__map-wrap">
        {loadError ? (
          <p className="heatmap-panel__error">{loadError}</p>
        ) : !geoData ? (
          <p className="heatmap-panel__loading">Loading India GeoJSON…</p>
        ) : (
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [82, 22],
              scale: 1200,
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const { st, district } = geoProps(geo);
                  const rate = getFraudRateForState(st);
                  const fill = fraudRateToColor(rate);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="rgba(15, 23, 42, 0.85)"
                      strokeWidth={0.25}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', filter: 'brightness(1.12)' },
                        pressed: { outline: 'none' },
                      }}
                      onMouseEnter={(e: MouseEvent) => {
                        setTooltip({
                          x: e.clientX,
                          y: e.clientY,
                          state: st || 'Unknown',
                          district: district || '—',
                          rate,
                        });
                      }}
                      onMouseMove={(e: MouseEvent) => {
                        setTooltip((prev) =>
                          prev
                            ? {
                                ...prev,
                                x: e.clientX,
                                y: e.clientY,
                              }
                            : prev,
                        );
                      }}
                      onMouseLeave={clearTip}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}
      </div>
      {tooltip ? (
        <div
          className="heatmap-tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
          role="tooltip"
        >
          <strong>{tooltip.state}</strong>
          {tooltip.district !== '—' ? <span>District: {tooltip.district}</span> : null}
          <span>Mock fraud intensity: {(tooltip.rate * 100).toFixed(0)}%</span>
        </div>
      ) : null}
      <p className="heatmap-panel__hint">
        Hover regions for tooltips. Colors use mock rates keyed by state name (`st_nm` in GeoJSON).
      </p>
    </section>
  );
}
