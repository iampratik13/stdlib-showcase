'use client';

import { useState, useMemo } from 'react';
import ChartWrapper from '@/components/ChartWrapper';

import daxpy_std from '@stdlib/blas-base-daxpy';
import ddot_std from '@stdlib/blas-base-ddot';
import dscal_std from '@stdlib/blas-base-dscal';
import dnrm2_std from '@stdlib/blas-base-dnrm2';

function daxpy(n, alpha, x, y) { 
  const r = new Float64Array(y); 
  daxpy_std(n, alpha, x, 1, r, 1); 
  return r; 
}
function ddot(n, x, y) { 
  return ddot_std(n, x, 1, y, 1); 
}
function dscal(n, alpha, x) { 
  const r = new Float64Array(x); 
  dscal_std(n, alpha, r, 1); 
  return r; 
}
function dnrm2(n, x) { 
  return dnrm2_std(n, x, 1); 
}
function dgemv(m, n, alpha, A, x, beta, y) { const r = new Float64Array(m); for (let i = 0; i < m; i++) { let s = 0; for (let j = 0; j < n; j++) s += A[i*n+j]*x[j]; r[i] = alpha*s+beta*y[i]; } return r; }

const operations = [
  { key: 'daxpy', name: 'DAXPY', desc: 'y = αx + y', needsAlpha: true, needsTwo: true },
  { key: 'ddot', name: 'DDOT', desc: 'result = xᵀy', needsAlpha: false, needsTwo: true },
  { key: 'dscal', name: 'DSCAL', desc: 'x = αx', needsAlpha: true, needsTwo: false },
  { key: 'dnrm2', name: 'DNRM2', desc: '‖x‖₂', needsAlpha: false, needsTwo: false },
  { key: 'dgemv', name: 'DGEMV', desc: 'y = αAx + βy', needsAlpha: true, needsTwo: true },
];

export default function MatrixPage() {
  const [operation, setOperation] = useState('daxpy');
  const [alpha, setAlpha] = useState(2.0);
  const [vectorX, setVectorX] = useState('1, 2, 3, 4, 5');
  const [vectorY, setVectorY] = useState('5, 4, 3, 2, 1');
  const [matrixA, setMatrixA] = useState('1,0,0,0,0\n0,1,0,0,0\n0,0,1,0,0\n0,0,0,1,0\n0,0,0,0,1');
  const op = operations.find((o) => o.key === operation);

  const result = useMemo(() => {
    try {
      const x = new Float64Array(vectorX.split(',').map(Number));
      const y = new Float64Array(vectorY.split(',').map(Number));
      const n = x.length;
      switch (operation) {
        case 'daxpy': return { type: 'vector', value: Array.from(daxpy(n, alpha, x, y)), label: `y = ${alpha}x + y` };
        case 'ddot': { const d = ddot(n, x, y); return { type: 'scalar', value: d, label: `xᵀy = ${d.toFixed(6)}` }; }
        case 'dscal': return { type: 'vector', value: Array.from(dscal(n, alpha, x)), label: `x = ${alpha}x` };
        case 'dnrm2': { const nm = dnrm2(n, x); return { type: 'scalar', value: nm, label: `‖x‖₂ = ${nm.toFixed(6)}` }; }
        case 'dgemv': { const rows = matrixA.trim().split('\n'); const m = rows.length; const A = new Float64Array(rows.flatMap((r) => r.split(',').map(Number))); return { type: 'vector', value: Array.from(dgemv(m, n, alpha, A, x, 1.0, y)), label: `y = ${alpha}Ax + y` }; }
        default: return { type: 'error', label: 'Unknown' };
      }
    } catch { return { type: 'error', label: 'Invalid input' }; }
  }, [operation, vectorX, vectorY, alpha, matrixA]);

  const chartData = useMemo(() => {
    if (result.type !== 'vector') return null;
    const x = new Float64Array(vectorX.split(',').map(Number));
    return {
      labels: result.value.map((_, i) => `i=${i}`),
      datasets: [
        { label: 'Input x', data: Array.from(x), borderColor: 'rgba(245,130,32,0.5)', backgroundColor: 'rgba(245,130,32,0.12)', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#F58220' },
        { label: 'Result', data: result.value, borderColor: '#1E88E5', backgroundColor: 'rgba(30,136,229,0.12)', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#1E88E5' },
      ],
    };
  }, [result, vectorX]);

  return (
    <div className="module-page">
      <div className="module-header">
        <span className="module-badge badge-blue">Linear Algebra</span>
        <h1>Matrix <span className="text-blue">Operations</span> Calculator</h1>
        <p>Perform BLAS-level vector and matrix operations. Implementations follow stdlib&apos;s @stdlib/blas/base API.</p>
      </div>
      <div className="module-content">
        <div className="module-grid">
          <div className="module-controls">
            <div className="card controls-card">
              <div className="form-group">
                <label>Operation</label>
                <select className="form-select" value={operation} onChange={(e) => setOperation(e.target.value)}>
                  {operations.map((o) => <option key={o.key} value={o.key}>{o.name} — {o.desc}</option>)}
                </select>
              </div>
              {op.needsAlpha && (
                <div className="form-group">
                  <label>α (Scalar): <span style={{ color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>{alpha}</span></label>
                  <input type="range" min={-5} max={5} step={0.5} value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} />
                </div>
              )}
              <div className="form-group"><label>Vector x</label><input className="form-input" value={vectorX} onChange={(e) => setVectorX(e.target.value)} /></div>
              {op.needsTwo && <div className="form-group"><label>Vector y</label><input className="form-input" value={vectorY} onChange={(e) => setVectorY(e.target.value)} /></div>}
              {operation === 'dgemv' && (
                <div className="form-group"><label>Matrix A (rows on new lines)</label>
                  <textarea className="form-input" value={matrixA} onChange={(e) => setMatrixA(e.target.value)} rows={5} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical' }} />
                </div>
              )}
            </div>
          </div>
          <div className="module-results">
            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Operation</h4>
              <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', color: 'var(--blue)', marginBottom: '1.25rem' }}>{result.label}</div>
              {result.type === 'vector' && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {result.value.map((v, i) => (
                    <div key={i} style={{ padding: '0.4rem 0.85rem', background: 'var(--blue-light)', border: '1px solid var(--blue-100)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{v.toFixed(4)}</div>
                  ))}
                </div>
              )}
              {result.type === 'scalar' && (
                <div style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', textAlign: 'center', padding: '1.5rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>{result.value.toFixed(6)}</div>
              )}
              {result.type === 'error' && <p style={{ color: '#ef4444' }}>{result.label}</p>}
            </div>
            {chartData && (
              <div className="card chart-container">
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>Vector Comparison</h4>
                <ChartWrapper data={chartData} type="bar" options={{ scales: { x: { grid: { display: false } } } }} />
              </div>
            )}
            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>BLAS Reference</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                {operations.map((o) => (
                  <div key={o.key} onClick={() => setOperation(o.key)} style={{ padding: '0.65rem', background: operation === o.key ? 'var(--blue-light)' : 'var(--bg-section)', border: `1px solid ${operation === o.key ? 'var(--blue-100)' : 'var(--border-light)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: operation === o.key ? 'var(--blue)' : 'var(--text-primary)', fontSize: '0.82rem' }}>{o.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{o.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
