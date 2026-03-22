'use client';

import { useState, useMemo } from 'react';
import ChartWrapper from '@/components/ChartWrapper';

import gammafn from '@stdlib/math-base-special-gamma';
import lnGamma from '@stdlib/math-base-special-gammaln';
import betafn from '@stdlib/math-base-special-beta';
import erf from '@stdlib/math-base-special-erf';
import erfc from '@stdlib/math-base-special-erfc';
import besselJ0 from '@stdlib/math-base-special-besselj0';
import besselJ1 from '@stdlib/math-base-special-besselj1';
import sinc from '@stdlib/math-base-special-sinc';
import sigmoid from '@stdlib/math-base-special-expit';

const functions = {
  gamma:   { name:'Gamma Γ(x)', formula:'Γ(x) = ∫₀^∞ t^(x-1) e^(-t) dt', fn:x=>Math.abs(x)<0.01?NaN:gammafn(x), range:{min:-4.5,max:6,step:0.02}, yRange:{min:-10,max:10}, description:'Generalization of factorial. Γ(n) = (n-1)! for positive integers.', color:'#F58220' },
  lngamma: { name:'Log-Gamma ln|Γ(x)|', formula:'ln|Γ(x)|', fn:x=>x>0?lnGamma(x):NaN, range:{min:0.1,max:10,step:0.05}, yRange:{min:-2,max:15}, description:'Natural log of absolute Gamma. Avoids overflow.', color:'#F58220' },
  beta:    { name:'Beta B(x, β)', formula:'B(x,β) = Γ(x)Γ(β)/Γ(x+β)', fn:(x,p)=>x>0?betafn(x,p.beta):NaN, range:{min:0.1,max:6,step:0.05}, yRange:{min:0,max:8}, params:[{key:'beta',label:'β',min:0.1,max:5,step:0.1,default:2}], description:'Defined via Gamma. Fundamental in probability.', color:'#1E88E5' },
  besselj0:{ name:'Bessel J₀(x)', formula:'J₀(x) = (1/π)∫₀^π cos(x sinθ) dθ', fn:besselJ0, range:{min:0,max:30,step:0.15}, yRange:{min:-0.5,max:1.1}, description:'First kind, order zero. Wave propagation, vibrations.', color:'#1E88E5' },
  besselj1:{ name:'Bessel J₁(x)', formula:'J₁(x)', fn:besselJ1, range:{min:0,max:30,step:0.15}, yRange:{min:-0.4,max:0.6}, description:'First kind, order one. Cylindrical symmetry.', color:'#F58220' },
  erf:     { name:'Error Function erf(x)', formula:'erf(x) = (2/√π)∫₀^x e^(-t²) dt', fn:erf, range:{min:-4,max:4,step:0.05}, yRange:{min:-1.2,max:1.2}, description:'Related to normal CDF. Essential in statistics.', color:'#1E88E5' },
  erfc:    { name:'Erfc(x)', formula:'erfc(x) = 1 - erf(x)', fn:erfc, range:{min:-3,max:5,step:0.05}, yRange:{min:-0.1,max:2.1}, description:'Complementary error function for precision.', color:'#F58220' },
  sigmoid: { name:'Sigmoid σ(x)', formula:'σ(x) = 1/(1+e^(-x))', fn:sigmoid, range:{min:-8,max:8,step:0.1}, yRange:{min:-0.1,max:1.1}, description:'Logistic function. Neural networks, logistic regression.', color:'#1E88E5' },
  sinc:    { name:'Sinc sinc(x)', formula:'sinc(x) = sin(πx)/(πx)', fn:sinc, range:{min:-10,max:10,step:0.05}, yRange:{min:-0.3,max:1.1}, description:'Normalized sinc. Signal processing, Fourier analysis.', color:'#F58220' },
};

export default function SpecialFunctionsPage() {
  const [fnKey, setFnKey] = useState('gamma');
  const [params, setParams] = useState({ beta: 2 });
  const fn = functions[fnKey];

  const chartData = useMemo(() => {
    const { min, max, step } = fn.range;
    const labels = [], data = [];
    for (let x = min; x <= max; x += step) {
      labels.push(x.toFixed(2));
      let val = fn.params ? fn.fn(x, params) : fn.fn(x);
      if (!isFinite(val) || Math.abs(val) > (fn.yRange?.max || 50) * 2) val = null;
      data.push(val);
    }
    return { labels, datasets: [{ label: fn.name, data, borderColor: fn.color, backgroundColor: fn.color + '14', fill: true, pointRadius: 0, borderWidth: 2.5, tension: 0.2, spanGaps: false }] };
  }, [fnKey, params, fn]);

  return (
    <div className="module-page">
      <div className="module-header">
        <span className="module-badge badge-orange">Mathematics</span>
        <h1>Special <span className="text-orange">Functions</span> Visualizer</h1>
        <p>Explore mathematical special functions with interactive plots — the backbone of scientific computing.</p>
      </div>
      <div className="module-content">
        <div className="module-grid">
          <div className="module-controls">
            <div className="card controls-card">
              <div className="form-group">
                <label>Function</label>
                <select className="form-select" value={fnKey} onChange={(e) => setFnKey(e.target.value)}>
                  {Object.entries(functions).map(([k, f]) => <option key={k} value={k}>{f.name}</option>)}
                </select>
              </div>
              {fn.params?.map((p) => (
                <div className="form-group" key={p.key}>
                  <label>{p.label}: <span style={{ color: 'var(--orange)', fontFamily: 'var(--font-mono)' }}>{params[p.key]??p.default}</span></label>
                  <input type="range" min={p.min} max={p.max} step={p.step} value={params[p.key]??p.default} onChange={(e) => setParams((prev) => ({ ...prev, [p.key]: parseFloat(e.target.value) }))} />
                </div>
              ))}
              <div style={{ padding: '0.85rem', background: 'var(--bg-section)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: fn.color, marginBottom: '0.6rem', lineHeight: '1.4' }}>{fn.formula}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{fn.description}</p>
              </div>
            </div>
            <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>All Functions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {Object.entries(functions).map(([k, f]) => (
                  <button key={k} onClick={() => setFnKey(k)} style={{ background: fnKey===k ? (f.color==='#1E88E5'?'var(--blue-light)':'var(--orange-light)') : 'transparent', border: `1px solid ${fnKey===k ? (f.color==='#1E88E5'?'var(--blue-100)':'var(--orange-100)') : 'transparent'}`, borderRadius: '6px', padding: '0.4rem 0.6rem', color: fnKey===k ? f.color : 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}>{f.name}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="module-results">
            <div className="card chart-container" style={{ minHeight: '430px' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>{fn.name}</h4>
              <ChartWrapper data={chartData} height={360} options={{ plugins: { legend: { display: false } }, scales: { y: fn.yRange ? { min: fn.yRange.min, max: fn.yRange.max } : {} } }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
