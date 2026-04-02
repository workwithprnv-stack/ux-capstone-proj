import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { ARXIV_CATEGORIES } from '@/lib/types';

const FEATURED_CATEGORIES = [
  'cs.AI', 'cs.LG', 'cs.CV', 'cs.CL', 'cs.NE', 'cs.RO',
  'cs.SE', 'cs.CR', 'stat.ML', 'math.OC', 'q-bio.NC', 'eess.IV',
];

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ⚡ Powered by arXiv Open Access
          </div>

          <h1 className="hero-title">
            Discover, Share &{' '}
            <span className="hero-title-gradient">Collaborate</span>{' '}
            on regex
          </h1>

          <p className="hero-subtitle">
            Your intelligent regex companion. Search millions of arXiv papers,
            bookmark discoveries, follow topics, and collaborate with researchers worldwide.
          </p>

          <div className="hero-search">
            <SearchBar placeholder="Search papers, authors, or topics..." size="large" />
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">2.4M+</span>
              <span className="hero-stat-label">Papers Indexed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">150+</span>
              <span className="hero-stat-label">Research Fields</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">Free</span>
              <span className="hero-stat-label">Open Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section" id="categories-section">
        <div className="section-header">
          <h2 className="section-title">Browse by Topic</h2>
          <p className="section-subtitle">Explore the latest research across popular fields</p>
        </div>

        <div className="categories-grid">
          {FEATURED_CATEGORIES.map((code) => (
            <Link
              key={code}
              href={`/papers?category=${code}`}
              className="category-card"
              id={`category-${code.replace('.', '-')}`}
            >
              <div className="category-code">{code}</div>
              <div className="category-name">{ARXIV_CATEGORIES[code]}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features-section">
        <div className="section-header">
          <h2 className="section-title">Why regex?</h2>
          <p className="section-subtitle">Everything you need for modern regex collaboration</p>
        </div>

        <div className="categories-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          <div className="category-card">
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>🔍</div>
            <div className="category-code" style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>Smart Search</div>
            <div className="category-name">Search millions of arXiv papers with advanced filters by topic, author, and date.</div>
          </div>
          <div className="category-card">
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>📑</div>
            <div className="category-code" style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>Bookmarks</div>
            <div className="category-name">Save papers to your personal library for quick access later.</div>
          </div>
          <div className="category-card">
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>📡</div>
            <div className="category-code" style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>Topic Feed</div>
            <div className="category-name">Subscribe to topics and get a personalized feed of the latest papers.</div>
          </div>
          <div className="category-card">
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>👥</div>
            <div className="category-code" style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>Groups</div>
            <div className="category-name">Create research groups, share papers, and collaborate with peers.</div>
          </div>
          <div className="category-card">
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>👤</div>
            <div className="category-code" style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>Profiles</div>
            <div className="category-name">Build your researcher profile and connect with other scientists.</div>
          </div>
          <div className="category-card">
            <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>🔓</div>
            <div className="category-code" style={{ fontSize: '1rem', marginBottom: 'var(--space-xs)' }}>Open Access</div>
            <div className="category-name">All papers are freely accessible. No paywalls, no subscriptions needed.</div>
          </div>
        </div>
      </section>
    </main>
  );
}
