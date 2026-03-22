'use client';

import { useState, useMemo } from 'react';
import ChartWrapper from '@/components/ChartWrapper';

import dlacpy from '@stdlib/lapack-base-dlacpy';
import dlaswp from '@stdlib/lapack-base-dlaswp';
import dlassq from '@stdlib/lapack-base-dlassq';
import dpttrf from '@stdlib/lapack-base-dpttrf';
import dlaset from '@stdlib/lapack-base-dlaset';
import dlamch from '@stdlib/lapack-base-dlamch';
import sqrt from '@stdlib/math-base-special-sqrt';

const operations = [
  { key: 'dlacpy', name: 'DLACPY', desc: 'Copy matrix region' },
  { key: 'dlaswp', name: 'DLASWP', desc: 'Row interchanges' },
  { key: 'dlassq', name: 'DLASSQ', desc: 'Scaled sum of squares' },
  { key: 'dpttrf', name: 'DPTTRF', desc: 'Tridiagonal LDLᵀ factorization' },
  { key: 'dlaset', name: 'DLASET', desc: 'Initialize matrix' },
  { key: 'dlamch', name: 'DLAMCH', desc: 'Machine parameters' },
];

function matrixToRows(flat, m, n) {
  const rows = [];
  for (let i = 0; i < m; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(flat[i * n + j]);
    }
    rows.push(row);
  }
  return rows;
}

export default function LapackPage() {
  const [operation, setOperation] = useState('dlacpy');

  const [dlacpyUplo, setDlacpyUplo] = useState('all');
  const [dlacpyMatrix, setDlacpyMatrix] = useState('1,2,3\n4,5,6\n7,8,9');

  const [dlaswpMatrix, setDlaswpMatrix] = useState('1,2,3\n4,5,6\n7,8,9');
  const [dlaswpPivots, setDlaswpPivots] = useState('3,1,2');

  const [dlassqVector, setDlassqVector] = useState('3, 4, 0, 5, 12');
  const [dlassqScale, setDlassqScale] = useState(1.0);
  const [dlassqSumsq, setDlassqSumsq] = useState(0.0);

  const [dpttrfDiag, setDpttrfDiag] = useState('4, 10, 29, 25');
  const [dpttrfSubdiag, setDpttrfSubdiag] = useState('2, 6, 15');

  const [dlasetM, setDlasetM] = useState(4);
  const [dlasetN, setDlasetN] = useState(4);
  const [dlasetAlpha, setDlasetAlpha] = useState(0.0);
  const [dlasetBeta, setDlasetBeta] = useState(1.0);

  const result = useMemo(() => {
    try {
      switch (operation) {
        case 'dlacpy': {
          const rows = dlacpyMatrix.trim().split('\n');
          const m = rows.length;
          const n = rows[0].split(',').length;
          const A = new Float64Array(rows.flatMap(r => r.split(',').map(Number)));
          const B = new Float64Array(m * n);
          dlacpy('row-major', dlacpyUplo, m, n, A, n, B, n);
          return {
            type: 'matrix',
            input: matrixToRows(A, m, n),
            output: matrixToRows(B, m, n),
            dims: { m, n },
            label: `dlacpy(uplo='${dlacpyUplo}') — copied ${dlacpyUplo === 'all' ? 'entire' : dlacpyUplo} triangle`,
            description: 'Copies all or part of matrix A into matrix B. "upper" copies the upper triangle, "lower" copies the lower triangle, "all" copies the full matrix.',
          };
        }
        case 'dlaswp': {
          const rows = dlaswpMatrix.trim().split('\n');
          const m = rows.length;
          const n = rows[0].split(',').length;
          const A = new Float64Array(rows.flatMap(r => r.split(',').map(Number)));
          const original = new Float64Array(A);
          const ipiv = new Int32Array(dlaswpPivots.split(',').map(s => parseInt(s.trim())));
          dlaswp('row-major', n, A, n, 0, Math.min(ipiv.length, m) - 1, ipiv, 1);
          return {
            type: 'matrix',
            input: matrixToRows(original, m, n),
            output: matrixToRows(A, m, n),
            dims: { m, n },
            label: `dlaswp — rows permuted by pivots [${Array.from(ipiv).join(', ')}]`,
            description: 'Performs a series of row interchanges on matrix A according to pivot indices. Each element ipiv[i] specifies that row i should be interchanged with row ipiv[i].',
          };
        }
        case 'dlassq': {
          const x = new Float64Array(dlassqVector.split(',').map(Number));
          const n = x.length;
          const out = dlassq(n, x, 1, dlassqScale, dlassqSumsq);
          const scaleOut = out[0];
          const sumsqOut = out[1];
          const norm = scaleOut * sqrt(sumsqOut);
    
          let manualSumSq = 0;
          for (let i = 0; i < n; i++) manualSumSq += x[i] * x[i];
          return {
            type: 'dlassq',
            vector: Array.from(x),
            scaleIn: dlassqScale,
            sumsqIn: dlassqSumsq,
            scaleOut,
            sumsqOut,
            norm,
            manualNorm: sqrt(manualSumSq + dlassqScale * dlassqScale * dlassqSumsq),
            label: `dlassq — scaled sum of squares`,
            description: 'Updates a sum of squares in scaled form: (scale_out²)·sumsq_out = (scale_in²)·sumsq_in + Σxᵢ². Avoids overflow for large vectors.',
          };
        }
        case 'dpttrf': {
          const D = new Float64Array(dpttrfDiag.split(',').map(Number));
          const E = new Float64Array(dpttrfSubdiag.split(',').map(Number));
          const n = D.length;
          const Dcopy = new Float64Array(D);
          const Ecopy = new Float64Array(E);
          const info = dpttrf(n, Dcopy, Ecopy);
          return {
            type: 'dpttrf',
            diagIn: Array.from(D),
            subdiagIn: Array.from(E),
            diagOut: Array.from(Dcopy),
            subdiagOut: Array.from(Ecopy),
            info,
            label: info === 0 ? 'dpttrf — LDLᵀ factorization successful' : `dpttrf — factorization failed (info=${info})`,
            description: 'Computes the L·D·Lᵀ factorization of a symmetric positive definite tridiagonal matrix. D contains the diagonal of the factored D matrix, E contains the sub-diagonal of L.',
          };
        }
        case 'dlaset': {
          const m = dlasetM, n = dlasetN;
          const A = new Float64Array(m * n);
          dlaset('row-major', 'all', m, n, dlasetAlpha, dlasetBeta, A, n);
          return {
            type: 'matrix',
            input: null,
            output: matrixToRows(A, m, n),
            dims: { m, n },
            label: `dlaset(α=${dlasetAlpha}, β=${dlasetBeta}) — ${m}×${n} matrix`,
            description: `Sets off-diagonal elements to α=${dlasetAlpha} and diagonal elements to β=${dlasetBeta}. Useful for initializing matrices, e.g. identity matrix with α=0, β=1.`,
          };
        }
        case 'dlamch': {
          const params = [
            { key: 'E', name: 'Epsilon (eps)', desc: 'Relative machine precision' },
            { key: 'S', name: 'Safe minimum (sfmin)', desc: 'Safe minimum such that 1/sfmin does not overflow' },
            { key: 'B', name: 'Base', desc: 'Base of the machine (radix)' },
            { key: 'P', name: 'Precision (prec)', desc: 'eps × base' },
            { key: 'N', name: 'Digits (t)', desc: 'Number of digits in the mantissa' },
            { key: 'L', name: 'Min exponent (emin)', desc: 'Minimum exponent before underflow' },
            { key: 'U', name: 'Max exponent (emax)', desc: 'Largest exponent before overflow' },
            { key: 'O', name: 'Overflow (rmax)', desc: 'Overflow threshold (largest value)' },
          ];
          const values = params.map(p => {
            try { return { ...p, value: dlamch(p.key) }; }
            catch { return { ...p, value: 'N/A' }; }
          });
          return {
            type: 'dlamch',
            values,
            label: 'dlamch — IEEE 754 double-precision machine parameters',
            description: 'Determines double-precision floating-point machine parameters. These constants are fundamental to numerical algorithms — they define the limits of floating-point arithmetic.',
          };
        }
        default:
          return { type: 'error', label: 'Unknown operation' };
      }
    } catch (err) {
      return { type: 'error', label: `Error: ${err.message}` };
    }
  }, [operation, dlacpyUplo, dlacpyMatrix, dlaswpMatrix, dlaswpPivots, dlassqVector, dlassqScale, dlassqSumsq, dpttrfDiag, dpttrfSubdiag, dlasetM, dlasetN, dlasetAlpha, dlasetBeta]);

  const dlassqChart = useMemo(() => {
    if (operation !== 'dlassq' || result.type !== 'dlassq') return null;
    const v = result.vector;
    return {
      labels: v.map((_, i) => `x[${i}]`),
      datasets: [
        { label: 'Value', data: v, backgroundColor: 'rgba(245,130,32,0.5)', borderColor: '#F58220', borderWidth: 1, borderRadius: 2 },
        { label: 'x²', data: v.map(x => x * x), backgroundColor: 'rgba(30,136,229,0.35)', borderColor: '#1E88E5', borderWidth: 1, borderRadius: 2 },
      ],
    };
  }, [operation, result]);

  return (
    <div className="module-page">
      <div className="module-header">
        <span className="module-badge badge-blue">LAPACK</span>
        <h1>LAPACK <span className="text-blue">Operations</span></h1>
        <p>Interactive demos of real LAPACK routines from stdlib — matrix copy, row permutations, scaled norms, tridiagonal factorization, and machine parameters.</p>
      </div>
      <div className="module-content">
        <div className="module-grid">
          <div className="module-controls">
            <div className="card controls-card">
              <div className="form-group">
                <label>Routine</label>
                <select className="form-select" value={operation} onChange={(e) => setOperation(e.target.value)}>
                  {operations.map(o => <option key={o.key} value={o.key}>{o.name} — {o.desc}</option>)}
                </select>
              </div>

              {operation === 'dlacpy' && (
                <>
                  <div className="form-group">
                    <label>Region (uplo)</label>
                    <select className="form-select" value={dlacpyUplo} onChange={(e) => setDlacpyUplo(e.target.value)}>
                      <option value="all">All</option>
                      <option value="upper">Upper triangle</option>
                      <option value="lower">Lower triangle</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Matrix A (rows on new lines)</label>
                    <textarea className="form-input" value={dlacpyMatrix} onChange={(e) => setDlacpyMatrix(e.target.value)} rows={3} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical' }} />
                  </div>
                </>
              )}

              {operation === 'dlaswp' && (
                <>
                  <div className="form-group">
                    <label>Matrix A (rows on new lines)</label>
                    <textarea className="form-input" value={dlaswpMatrix} onChange={(e) => setDlaswpMatrix(e.target.value)} rows={3} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical' }} />
                  </div>
                  <div className="form-group">
                    <label>Pivot indices (1-indexed)</label>
                    <input className="form-input" value={dlaswpPivots} onChange={(e) => setDlaswpPivots(e.target.value)} />
                  </div>
                </>
              )}

              {operation === 'dlassq' && (
                <>
                  <div className="form-group">
                    <label>Vector x</label>
                    <input className="form-input" value={dlassqVector} onChange={(e) => setDlassqVector(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Initial scale: <span style={{ color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>{dlassqScale}</span></label>
                    <input type="range" min={0.1} max={10} step={0.1} value={dlassqScale} onChange={(e) => setDlassqScale(parseFloat(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>Initial sumsq: <span style={{ color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>{dlassqSumsq}</span></label>
                    <input type="range" min={0} max={100} step={1} value={dlassqSumsq} onChange={(e) => setDlassqSumsq(parseFloat(e.target.value))} />
                  </div>
                </>
              )}

              {operation === 'dpttrf' && (
                <>
                  <div className="form-group">
                    <label>Diagonal D (comma-separated)</label>
                    <input className="form-input" value={dpttrfDiag} onChange={(e) => setDpttrfDiag(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Sub-diagonal E (comma-separated)</label>
                    <input className="form-input" value={dpttrfSubdiag} onChange={(e) => setDpttrfSubdiag(e.target.value)} />
                  </div>
                </>
              )}

              {operation === 'dlaset' && (
                <>
                  <div className="form-group">
                    <label>Rows (M): <span style={{ color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>{dlasetM}</span></label>
                    <input type="range" min={2} max={8} step={1} value={dlasetM} onChange={(e) => setDlasetM(parseInt(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>Cols (N): <span style={{ color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>{dlasetN}</span></label>
                    <input type="range" min={2} max={8} step={1} value={dlasetN} onChange={(e) => setDlasetN(parseInt(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>α (off-diagonal): <span style={{ color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>{dlasetAlpha}</span></label>
                    <input type="range" min={-5} max={5} step={0.5} value={dlasetAlpha} onChange={(e) => setDlasetAlpha(parseFloat(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>β (diagonal): <span style={{ color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>{dlasetBeta}</span></label>
                    <input type="range" min={-5} max={5} step={0.5} value={dlasetBeta} onChange={(e) => setDlasetBeta(parseFloat(e.target.value))} />
                  </div>
                </>
              )}

              {operation === 'dlamch' && (
                <div style={{ padding: '0.85rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    No parameters — dlamch queries the IEEE 754 floating-point environment and returns machine constants.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="module-results">
            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Result</h4>
              <div style={{ fontSize: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--blue)', marginBottom: '1rem' }}>{result.label}</div>
              {result.description && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem', padding: '0.75rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>{result.description}</p>
              )}

              {result.type === 'matrix' && (
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {result.input && (
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Input A</div>
                      <div style={{ background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', border: '1px solid var(--border-light)' }}>
                        {result.input.map((row, i) => (
                          <div key={i} style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.2rem' }}>
                            {row.map((v, j) => (
                              <div key={j} style={{ padding: '0.3rem 0.55rem', background: 'var(--orange-light)', border: '1px solid var(--orange-100)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', textAlign: 'center', minWidth: '40px' }}>{v.toFixed(1)}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Output B</div>
                    <div style={{ background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', border: '1px solid var(--border-light)' }}>
                      {result.output.map((row, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.2rem' }}>
                          {row.map((v, j) => (
                            <div key={j} style={{ padding: '0.3rem 0.55rem', background: 'var(--blue-light)', border: '1px solid var(--blue-100)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', textAlign: 'center', minWidth: '40px', color: v === 0 ? 'var(--text-muted)' : 'var(--text-primary)' }}>{v.toFixed(1)}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {result.type === 'dlassq' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {[
                      { label: 'Scale (in)', value: result.scaleIn.toFixed(4) },
                      { label: 'Sumsq (in)', value: result.sumsqIn.toFixed(4) },
                      { label: 'Scale (out)', value: result.scaleOut.toFixed(4) },
                      { label: 'Sumsq (out)', value: result.sumsqOut.toFixed(4) },
                      { label: '‖x‖ (computed)', value: result.norm.toFixed(6) },
                      { label: '‖x‖ (verify)', value: result.manualNorm.toFixed(6) },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '0.65rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--blue)' }}>{item.value}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.type === 'dpttrf' && (
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Input</div>
                    <div style={{ padding: '0.75rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ marginBottom: '0.4rem' }}><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>D: </span><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>[{result.diagIn.map(v => v.toFixed(2)).join(', ')}]</span></div>
                      <div><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>E: </span><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>[{result.subdiagIn.map(v => v.toFixed(2)).join(', ')}]</span></div>
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Factored (L·D·Lᵀ)</div>
                    <div style={{ padding: '0.75rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ marginBottom: '0.4rem' }}><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>D: </span><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue)' }}>[{result.diagOut.map(v => v.toFixed(4)).join(', ')}]</span></div>
                      <div><span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>L (sub-diag): </span><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--blue)' }}>[{result.subdiagOut.map(v => v.toFixed(4)).join(', ')}]</span></div>
                    </div>
                  </div>
                </div>
              )}

              {result.type === 'dlamch' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem' }}>
                  {result.values.map(p => (
                    <div key={p.key} style={{ padding: '0.75rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{p.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue)', marginBottom: '0.25rem', wordBreak: 'break-all' }}>{typeof p.value === 'number' ? p.value.toExponential(6) : p.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{p.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {result.type === 'error' && <p style={{ color: '#ef4444' }}>{result.label}</p>}
            </div>

            {dlassqChart && (
              <div className="card chart-container">
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>Vector Values vs Squared Values</h4>
                <ChartWrapper type="bar" data={dlassqChart} options={{ plugins: { legend: { display: true } }, scales: { x: { grid: { display: false } } } }} />
              </div>
            )}

            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>LAPACK Routines Reference</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.6rem' }}>
                {operations.map(o => (
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
