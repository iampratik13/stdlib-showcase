import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';

const features = [
  {
    title: 'Statistical Distributions',
    description: 'Explore PDF and CDF curves for Normal, Exponential, Beta, Gamma, Chi-squared, and Uniform distributions — all powered by @stdlib/stats.',
    href: '/distributions',
    color: 'orange',
  },
  {
    title: 'BLAS Operations',
    description: 'Level 1 and Level 2 BLAS routines: DGEMV matrix-vector multiply, DAXPY, DDOT, DSCAL, DNRM2 — all from @stdlib/blas/base.',
    href: '/matrix',
    color: 'blue',
  },
  {
    title: 'LAPACK Operations',
    description: 'Real LAPACK routines: matrix copy (dlacpy), row permutations (dlaswp), scaled norms (dlassq), tridiagonal factorization (dpttrf), and machine parameters (dlamch).',
    href: '/lapack',
    color: 'orange',
  },
  {
    title: 'Random Sampling',
    description: 'Generate samples with stdlib PRNGs (randu, randn, minstd, minstd-shuffle) and compare empirical histograms against theoretical PDFs.',
    href: '/random-sampling',
    color: 'blue',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="section section-alt" id="modules">
        <div className="container">
          <div className="section-header">
            <h2>
              Explore <span className="text-orange">Scientific</span> Modules
            </h2>
            <p>
              Four interactive modules showcasing stdlib&apos;s numerical computing
              capabilities — all running directly in your browser.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {features.map((feature) => (
              <FeatureCard key={feature.href} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>
              Why <span className="text-orange">stdlib</span>?
            </h2>
            <p style={{ maxWidth: '640px', margin: '0 auto 2rem' }}>
              stdlib is the most comprehensive standard library for JavaScript and Node.js,
              providing robust, high-performance implementations of mathematical, statistical,
              and scientific computing functions.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto',
            }}>
              {[
                { label: 'High Performance', desc: 'Optimized C/Fortran via native bindings and WebAssembly' },
                { label: 'Precision', desc: 'IEEE 754 compliant with rigorous numerical accuracy' },
                { label: 'Modular', desc: '3,500+ individually installable packages' },
                { label: 'Well Tested', desc: 'Extensive test suites with reference implementations' },
              ].map((item) => (
                <div key={item.label} style={{
                  padding: '1.15rem',
                  background: 'var(--bg-section)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.label}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="card" style={{ padding: '2.5rem', margin: '0 auto', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>
              How to <span className="text-orange">Install</span>
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
              Getting started with stdlib is as easy as installing any other npm package. 
              You can install individual packages or the entire library.
            </p>
            <div style={{ background: '#1A1A2E', color: '#FFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
              <span style={{ color: '#8E8EA9' }}>{"// Install the entire library"}</span><br />
              npm install @stdlib/stdlib<br /><br />
              <span style={{ color: '#8E8EA9' }}>{"// Or install individual packages for smaller bundles"}</span><br />
              npm install @stdlib/stats-base-dists-normal-pdf<br />
              npm install @stdlib/lapack-base-dlacpy
            </div>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Basic Example:</h4>
            <div style={{ background: '#1A1A2E', color: '#FFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', overflowX: 'auto' }}>
              <span style={{ color: '#F58220' }}>import</span> erf <span style={{ color: '#F58220' }}>from</span> <span style={{ color: '#1E88E5' }}>&apos;@stdlib/math-base-special-erf&apos;</span>;<br /><br />
              <span style={{ color: '#8E8EA9' }}>{"// Evaluate the error function"}</span><br />
              <span style={{ color: '#F58220' }}>const</span> y = erf( <span style={{ color: '#FFF' }}>0.5</span> );<br />
              console.log( y ); <span style={{ color: '#8E8EA9' }}>{"// => 0.5204998778130465"}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
