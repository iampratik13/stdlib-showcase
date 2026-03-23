'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-logo-wrap delay-1">
            <img
              src="https://cdn.jsdelivr.net/gh/stdlib-js/stdlib@9f7d30f089ecc458a8b836a75afab75caf5c0b36/docs/assets/logo_banner.svg"
              alt="stdlib"
              className="hero-logo"
            />
          </div>

          <h1 className="hero-title delay-2">
            Scientific Computing <span className="text-orange">Showcase</span>
          </h1>

          <p className="hero-subtitle delay-3">
            Interactive demonstrations of stdlib&apos;s numerical computing libraries.
            Explore statistical distributions, BLAS and LAPACK operations, and random sampling — all running in your browser.
          </p>

          <div className="hero-actions delay-4">
            <Link href="#modules" className="btn btn-orange">
              Explore Modules
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a
              href="https://github.com/stdlib-js/stdlib"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          min-height: 85vh;
          display: flex;
          align-items: center;
          padding: 8rem 0 4rem;
          background: transparent;
        }
        .hero-content {
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }
        .hero-logo-wrap {
          margin-bottom: 2rem;
          animation: fadeInUp 0.5s ease both;
        }
        .hero-logo {
          height: 140px;
          width: auto;
        }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          color: var(--text-primary);
          animation: fadeInUp 0.5s ease both;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          line-height: 1.8;
          animation: fadeInUp 0.5s ease both;
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          animation: fadeInUp 0.5s ease both;
        }
      `}</style>
    </section>
  );
}
