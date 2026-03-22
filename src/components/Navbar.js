'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/distributions', label: 'Distributions' },
  { href: '/matrix', label: 'BLAS Ops' },
  { href: '/lapack', label: 'LAPACK' },
  { href: '/special-functions', label: 'Special Functions' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <img
            src="https://cdn.jsdelivr.net/gh/stdlib-js/stdlib@9f7d30f089ecc458a8b836a75afab75caf5c0b36/docs/assets/logo_banner.svg"
            alt="stdlib"
            className="nav-logo-img"
          />
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/stdlib-js/stdlib"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-github"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 100px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid transparent;
          transition: all var(--transition-base);
        }
        .navbar-scrolled {
          border-bottom-color: var(--border);
          box-shadow: 0 1px 12px rgba(0, 0, 0, 0.05);
        }
        .nav-container {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .nav-logo-img {
          height: 75px;
          width: auto;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .nav-link:hover {
          color: var(--orange);
          background: var(--orange-light);
        }
        .nav-github {
          margin-left: 0.5rem;
          padding: 0.6rem;
          display: flex;
          align-items: center;
          color: var(--text-muted);
        }
        .nav-github:hover {
          color: var(--text-primary);
          background: var(--bg-section);
        }
      `}</style>
    </nav>
  );
}
