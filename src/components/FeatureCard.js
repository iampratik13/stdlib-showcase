'use client';

import Link from 'next/link';

export default function FeatureCard({ icon, title, description, href, color = 'orange' }) {
  const isBlue = color === 'blue';

  return (
    <Link href={href} className="feature-card-link">
      <div className="feature-card card">
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
        <span className="feature-cta">
          Explore →
        </span>
      </div>

      <style jsx>{`
        .feature-card-link {
          text-decoration: none;
          display: block;
        }
        .feature-card {
          padding: 1.75rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          cursor: pointer;
        }
        .feature-card:hover {
          border-color: ${isBlue ? 'var(--blue)' : 'var(--orange)'};
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          background: ${isBlue ? 'var(--blue-light)' : 'var(--orange-light)'};
        }
        .feature-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .feature-description {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          flex: 1;
        }
        .feature-cta {
          font-size: 0.82rem;
          font-weight: 600;
          color: ${isBlue ? 'var(--blue)' : 'var(--orange)'};
          transition: letter-spacing var(--transition-fast);
        }
        .feature-card:hover .feature-cta {
          letter-spacing: 0.03em;
        }
      `}</style>
    </Link>
  );
}
