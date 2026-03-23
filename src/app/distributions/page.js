'use client';

import { useState, useMemo } from 'react';
import ChartWrapper from '@/components/ChartWrapper';

import normalPDF from '@stdlib/stats-base-dists-normal-pdf';
import normalCDF from '@stdlib/stats-base-dists-normal-cdf';
import exponentialPDF from '@stdlib/stats-base-dists-exponential-pdf';
import exponentialCDF from '@stdlib/stats-base-dists-exponential-cdf';
import betaPDF from '@stdlib/stats-base-dists-beta-pdf';
import betaCDF from '@stdlib/stats-base-dists-beta-cdf';
import gammaPDF from '@stdlib/stats-base-dists-gamma-pdf';
import gammaCDF from '@stdlib/stats-base-dists-gamma-cdf';
import chisquarePDF from '@stdlib/stats-base-dists-chisquare-pdf';
import chisquareCDF from '@stdlib/stats-base-dists-chisquare-cdf';
import uniformPDF from '@stdlib/stats-base-dists-uniform-pdf';
import uniformCDF from '@stdlib/stats-base-dists-uniform-cdf';

const distributions = {
  normal: {
    name: 'Normal (Gaussian)',
    params: [
      { key: 'mu', label: 'μ (Mean)', min: -5, max: 5, step: 0.1, default: 0 },
      { key: 'sigma', label: 'σ (Std Dev)', min: 0.1, max: 5, step: 0.1, default: 1 },
    ],
    range: () => ({ min: -8, max: 8, step: 0.05 }),
    pdf: (x, { mu, sigma }) => normalPDF(x, mu, sigma),
    cdf: (x, { mu, sigma }) => normalCDF(x, mu, sigma),
    stats: ({ mu, sigma }) => ({ Mean: mu.toFixed(3), Variance: (sigma*sigma).toFixed(3), 'Std Dev': sigma.toFixed(3), Skewness: '0.000', Kurtosis: '3.000' }),
  },
  exponential: {
    name: 'Exponential',
    params: [{ key: 'lambda', label: 'λ (Rate)', min: 0.1, max: 5, step: 0.1, default: 1 }],
    range: () => ({ min: 0, max: 8, step: 0.05 }),
    pdf: (x, { lambda }) => exponentialPDF(x, lambda),
    cdf: (x, { lambda }) => exponentialCDF(x, lambda),
    stats: ({ lambda }) => ({ Mean: (1/lambda).toFixed(3), Variance: (1/(lambda*lambda)).toFixed(3), 'Std Dev': (1/lambda).toFixed(3), Skewness: '2.000' }),
  },
  beta: {
    name: 'Beta',
    params: [
      { key: 'alpha', label: 'α (Alpha)', min: 0.1, max: 10, step: 0.1, default: 2 },
      { key: 'beta', label: 'β (Beta)', min: 0.1, max: 10, step: 0.1, default: 5 },
    ],
    range: () => ({ min: 0.01, max: 0.99, step: 0.005 }),
    pdf: (x, { alpha, beta: b }) => betaPDF(x, alpha, b),
    cdf: (x, { alpha, beta: b }) => betaCDF(x, alpha, b),
    stats: ({ alpha, beta: b }) => ({ Mean: (alpha/(alpha+b)).toFixed(3), Variance: ((alpha*b)/((alpha+b)**2*(alpha+b+1))).toFixed(3), Mode: alpha>1&&b>1 ? ((alpha-1)/(alpha+b-2)).toFixed(3) : 'N/A' }),
  },
  gamma: {
    name: 'Gamma',
    params: [
      { key: 'k', label: 'k (Shape)', min: 0.5, max: 10, step: 0.5, default: 2 },
      { key: 'theta', label: 'θ (Scale)', min: 0.5, max: 5, step: 0.5, default: 1 },
    ],
    range: () => ({ min: 0.01, max: 20, step: 0.1 }),
    pdf: (x, { k, theta }) => gammaPDF(x, k, 1/theta),
    cdf: (x, { k, theta }) => gammaCDF(x, k, 1/theta),
    stats: ({ k, theta }) => ({ Mean: (k*theta).toFixed(3), Variance: (k*theta*theta).toFixed(3), 'Std Dev': Math.sqrt(k*theta*theta).toFixed(3), Skewness: (2/Math.sqrt(k)).toFixed(3) }),
  },
  chisquared: {
    name: 'Chi-Squared',
    params: [{ key: 'k', label: 'k (Degrees of Freedom)', min: 1, max: 20, step: 1, default: 3 }],
    range: () => ({ min: 0.01, max: 25, step: 0.1 }),
    pdf: (x, { k }) => chisquarePDF(x, k),
    cdf: (x, { k }) => chisquareCDF(x, k),
    stats: ({ k }) => ({ Mean: k.toFixed(3), Variance: (2*k).toFixed(3), Skewness: Math.sqrt(8/k).toFixed(3), Kurtosis: (3+12/k).toFixed(3) }),
  },
  uniform: {
    name: 'Uniform',
    params: [
      { key: 'a', label: 'a (Min)', min: -5, max: 4, step: 0.5, default: 0 },
      { key: 'b', label: 'b (Max)', min: -4, max: 10, step: 0.5, default: 1 },
    ],
    range: () => ({ min: -6, max: 11, step: 0.05 }),
    pdf: (x, { a, b }) => uniformPDF(x, a, b),
    cdf: (x, { a, b }) => uniformCDF(x, a, b),
    stats: ({ a, b }) => ({ Mean: ((a+b)/2).toFixed(3), Variance: ((b-a)**2/12).toFixed(3), 'Std Dev': (Math.abs(b-a)/Math.sqrt(12)).toFixed(3), Skewness: '0.000' }),
  },
};

export default function DistributionsPage() {
  const [distKey, setDistKey] = useState('normal');
  const dist = distributions[distKey];
  const defaultParams = {};
  dist.params.forEach((p) => { defaultParams[p.key] = p.default; });
  const [params, setParams] = useState(defaultParams);

  const handleDistChange = (key) => {
    setDistKey(key);
    const d = {}; distributions[key].params.forEach((p) => { d[p.key] = p.default; }); setParams(d);
  };

  const { pdfData, cdfData, statsData } = useMemo(() => {
    const range = dist.range();
    const xV = [], pV = [], cV = [];
    for (let x = range.min; x <= range.max; x += range.step) {
      xV.push(x.toFixed(2)); pV.push(dist.pdf(x, params)); cV.push(dist.cdf(x, params));
    }
    return {
      pdfData: { labels: xV, datasets: [{ label: 'PDF', data: pV, borderColor: '#F58220', backgroundColor: 'rgba(245,130,32,0.08)', fill: true, pointRadius: 0, borderWidth: 2, tension: 0.3 }] },
      cdfData: { labels: xV, datasets: [{ label: 'CDF', data: cV, borderColor: '#1E88E5', backgroundColor: 'rgba(30,136,229,0.08)', fill: true, pointRadius: 0, borderWidth: 2, tension: 0.3 }] },
      statsData: dist.stats(params),
    };
  }, [distKey, params, dist]);

  return (
    <div className="module-page">
      <div className="module-header">
        <span className="module-badge badge-orange">Statistics</span>
        <h1>Statistical <span className="text-orange">Distributions</span> Explorer</h1>
        <p>Explore probability distributions interactively. Adjust parameters and watch PDF and CDF curves update in real-time.</p>
      </div>
      <div className="module-content">
        <div className="module-grid">
          <div className="module-controls">
            <div className="card controls-card">
              <div className="form-group">
                <label>Distribution</label>
                <select className="form-select" value={distKey} onChange={(e) => handleDistChange(e.target.value)}>
                  {Object.entries(distributions).map(([key, d]) => <option key={key} value={key}>{d.name}</option>)}
                </select>
              </div>
              {dist.params.map((p) => (
                <div className="form-group" key={p.key}>
                  <label>{p.label}: <span style={{ color: 'var(--orange)', fontFamily: 'var(--font-mono)' }}>{params[p.key]}</span></label>
                  <input type="range" min={p.min} max={p.max} step={p.step} value={params[p.key] ?? p.default} onChange={(e) => setParams((prev) => ({ ...prev, [p.key]: parseFloat(e.target.value) }))} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}><span>{p.min}</span><span>{p.max}</span></div>
                </div>
              ))}
              <div style={{ marginTop: '0.25rem', padding: '0.85rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Statistics</div>
                {Object.entries(statsData).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{key}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--orange)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="module-results">
            <div className="card chart-container">
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Probability Density Function <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(PDF)</span>
              </h4>
              <ChartWrapper data={pdfData} options={{ plugins: { legend: { display: false } } }} />
            </div>
            <div className="card chart-container">
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Cumulative Distribution Function <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(CDF)</span>
              </h4>
              <ChartWrapper data={cdfData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
