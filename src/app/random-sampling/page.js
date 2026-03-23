'use client';

import { useState, useMemo, useCallback } from 'react';
import ChartWrapper from '@/components/ChartWrapper';

import randu from '@stdlib/random-base-randu';
import randn from '@stdlib/random-base-randn';
import minstd from '@stdlib/random-base-minstd';
import minstdShuffle from '@stdlib/random-base-minstd-shuffle';
import normalPDF from '@stdlib/stats-base-dists-normal-pdf';
import uniformPDF from '@stdlib/stats-base-dists-uniform-pdf';
import sqrt from '@stdlib/math-base-special-sqrt';

const generators = {
  randu: {
    name: 'Uniform Random (randu)',
    fn: randu,
    normalize: (v) => v,
    theoreticalPDF: (x) => uniformPDF(x, 0, 1),
    pdfRange: { min: -0.5, max: 1.5 },
    description: 'Generates uniform pseudorandom numbers on [0, 1). Uses the underlying system PRNG.',
    expectedMean: '0.500',
    expectedVar: '0.083',
    package: '@stdlib/random-base-randu',
  },
  randn: {
    name: 'Standard Normal (randn)',
    fn: randn,
    normalize: (v) => v,
    theoreticalPDF: (x) => normalPDF(x, 0, 1),
    pdfRange: { min: -4, max: 4 },
    description: 'Generates standard normal (Gaussian) pseudorandom numbers with mean 0 and variance 1. Uses the Box-Muller transform.',
    expectedMean: '0.000',
    expectedVar: '1.000',
    package: '@stdlib/random-base-randn',
  },
  minstd: {
    name: 'Linear Congruential (minstd)',
    fn: minstd,
    normalize: (v) => v / 2147483647,
    theoreticalPDF: (x) => uniformPDF(x, 0, 1),
    pdfRange: { min: -0.5, max: 1.5 },
    description: 'Lehmer LCG: generates integers via xₙ₊₁ = 16807·xₙ mod 2³¹−1, normalized to [0,1]. A classic "minimal standard" PRNG (Park & Miller, 1988).',
    expectedMean: '0.500',
    expectedVar: '0.083',
    package: '@stdlib/random-base-minstd',
  },
  minstdShuffle: {
    name: 'Shuffled LCG (minstd-shuffle)',
    fn: minstdShuffle,
    normalize: (v) => v / 2147483647,
    theoreticalPDF: (x) => uniformPDF(x, 0, 1),
    pdfRange: { min: -0.5, max: 1.5 },
    description: 'Bays-Durham shuffled variant of the LCG. Adds a shuffle table to break sequential correlations, improving statistical quality.',
    expectedMean: '0.500',
    expectedVar: '0.083',
    package: '@stdlib/random-base-minstd-shuffle',
  },
};

function buildHistogram(samples, numBins, range) {
  const { min, max } = range;
  const binWidth = (max - min) / numBins;
  const counts = new Array(numBins).fill(0);
  const labels = [];
  for (let i = 0; i < numBins; i++) {
    const lo = min + i * binWidth;
    labels.push((lo + binWidth / 2).toFixed(2));
  }
  for (const s of samples) {
    if (s >= min && s < max) {
      const idx = Math.min(Math.floor((s - min) / binWidth), numBins - 1);
      counts[idx]++;
    }
  }
  const n = samples.length;
  const density = counts.map((c) => c / (n * binWidth));
  return { labels, density, counts };
}

export default function RandomSamplingPage() {
  const [genKey, setGenKey] = useState('randu');
  const [sampleSize, setSampleSize] = useState(1000);
  const [numBins, setNumBins] = useState(40);
  const [seed, setSeed] = useState(0); 

  const gen = generators[genKey];

  const { samples, stats } = useMemo(() => {
    const arr = [];
    for (let i = 0; i < sampleSize; i++) {
      arr.push(gen.normalize(gen.fn()));
    }
    let sum = 0, sum2 = 0, lo = Infinity, hi = -Infinity;
    for (const v of arr) {
      sum += v;
      sum2 += v * v;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    const mean = sum / arr.length;
    const variance = sum2 / arr.length - mean * mean;
    return {
      samples: arr,
      stats: { mean, variance, stddev: sqrt(variance), min: lo, max: hi },
    };
  }, [genKey, sampleSize, seed]);

  const chartData = useMemo(() => {
    const range = gen.pdfRange;
    const hist = buildHistogram(samples, numBins, range);

    const pdfData = hist.labels.map((l) => gen.theoreticalPDF(parseFloat(l)));

    return {
      labels: hist.labels,
      datasets: [
        {
          type: 'bar',
          label: 'Empirical (histogram)',
          data: hist.density,
          backgroundColor: 'rgba(245, 130, 32, 0.35)',
          borderColor: '#F58220',
          borderWidth: 1,
          borderRadius: 1,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
          order: 2,
        },
        {
          type: 'line',
          label: 'Theoretical PDF',
          data: pdfData,
          borderColor: '#1E88E5',
          backgroundColor: 'rgba(30, 136, 229, 0.08)',
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
          order: 1,
        },
      ],
    };
  }, [samples, numBins, gen]);

  const handleRegenerate = useCallback(() => setSeed((s) => s + 1), []);

  return (
    <div className="module-page">
      <div className="module-header">
        <span className="module-badge badge-orange">Random</span>
        <h1>Random <span className="text-orange">Sampling</span> Playground</h1>
        <p>Generate random samples with stdlib PRNGs and compare empirical histograms against theoretical distributions.</p>
      </div>
      <div className="module-content">
        <div className="module-grid">
          <div className="module-controls">
            <div className="card controls-card">
              <div className="form-group">
                <label>Generator</label>
                <select className="form-select" value={genKey} onChange={(e) => setGenKey(e.target.value)}>
                  {Object.entries(generators).map(([k, g]) => (
                    <option key={k} value={k}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sample Size: <span style={{ color: 'var(--orange)', fontFamily: 'var(--font-mono)' }}>{sampleSize.toLocaleString()}</span></label>
                <input type="range" min={100} max={10000} step={100} value={sampleSize} onChange={(e) => setSampleSize(parseInt(e.target.value))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}><span>100</span><span>10,000</span></div>
              </div>
              <div className="form-group">
                <label>Histogram Bins: <span style={{ color: 'var(--orange)', fontFamily: 'var(--font-mono)' }}>{numBins}</span></label>
                <input type="range" min={10} max={100} step={5} value={numBins} onChange={(e) => setNumBins(parseInt(e.target.value))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}><span>10</span><span>100</span></div>
              </div>
              <button
                onClick={handleRegenerate}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  background: 'var(--orange)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: '0.25rem',
                }}
              >
                ↻ Re-sample
              </button>
            </div>

            <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Generator Info</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0.75rem' }}>{gen.description}</p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--orange)', padding: '0.5rem 0.7rem', background: 'var(--orange-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--orange-100)' }}>
                {gen.package}
              </div>
            </div>

            <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>All Generators</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {Object.entries(generators).map(([k, g]) => (
                  <button key={k} onClick={() => setGenKey(k)} style={{
                    background: genKey === k ? 'var(--orange-light)' : 'transparent',
                    border: `1px solid ${genKey === k ? 'var(--orange-100)' : 'transparent'}`,
                    borderRadius: '6px',
                    padding: '0.4rem 0.6rem',
                    color: genKey === k ? 'var(--orange)' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}>{g.name}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="module-results">
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                Empirical Statistics <span style={{ fontStyle: 'italic', textTransform: 'none', letterSpacing: 'normal' }}>vs expected</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.6rem' }}>
                {[
                  { label: 'Mean', empirical: stats.mean.toFixed(4), expected: gen.expectedMean },
                  { label: 'Variance', empirical: stats.variance.toFixed(4), expected: gen.expectedVar },
                  { label: 'Std Dev', empirical: stats.stddev.toFixed(4), expected: null },
                  { label: 'Min', empirical: stats.min.toFixed(4), expected: null },
                  { label: 'Max', empirical: stats.max.toFixed(4), expected: null },
                ].map((item) => (
                  <div key={item.label} style={{ padding: '0.65rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--orange)' }}>{item.empirical}</div>
                    {item.expected && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--blue)', marginTop: '0.15rem' }}>expect ≈ {item.expected}</div>
                    )}
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card chart-container" style={{ minHeight: '430px' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Empirical Histogram vs Theoretical PDF
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}> — {sampleSize.toLocaleString()} samples, {numBins} bins</span>
              </h4>
              <ChartWrapper
                data={chartData}
                height={380}
                options={{
                  plugins: { legend: { display: true } },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { maxTicksLimit: 12 },
                    },
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: 'Density', font: { size: 11 } },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
