'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src="https://cdn.jsdelivr.net/gh/stdlib-js/stdlib@9f7d30f089ecc458a8b836a75afab75caf5c0b36/docs/assets/logo_banner.svg"
              alt="stdlib"
              className="footer-logo"
            />
            <p className="footer-description">
              A standard library for JavaScript and Node.js, with an emphasis
              on scientific computing and numerical analysis.
            </p>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Explore</h4>
            <a href="/distributions">Distributions</a>
            <a href="/matrix">BLAS Ops</a>
            <a href="/lapack">LAPACK</a>
            <a href="/special-functions">Special Functions</a>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-heading">Resources</h4>
            <a href="https://stdlib.io" target="_blank" rel="noopener noreferrer">Documentation</a>
            <a href="https://github.com/stdlib-js/stdlib" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Powered by <a href="https://stdlib.io" target="_blank" rel="noopener noreferrer" className="footer-link-orange">stdlib</a></p>
          <p className="footer-copy">&copy; {new Date().getFullYear()} stdlib. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--bg-section);
          border-top: 1px solid var(--border);
          padding: 3.5rem 2rem 1.5rem;
        }
        .footer-container {
          max-width: var(--container-max);
          margin: 0 auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 2.5rem;
        }
        .footer-logo {
          height: 36px;
          margin-bottom: 0.85rem;
        }
        .footer-description {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 300px;
        }
        .footer-heading {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 0.85rem;
        }
        .footer-links-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-links-group a {
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .footer-links-group a:hover { color: var(--orange); }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .footer-link-orange { color: var(--orange); font-weight: 600; }
        .footer-copy { color: var(--text-muted); }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
