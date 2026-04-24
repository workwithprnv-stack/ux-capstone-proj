'use client';

import React, { useState } from 'react';

interface UpdateItem {
  id: string;
  type: 'news' | 'conference' | 'award' | 'competition';
  title: string;
  date: string;
  description: string;
  source: string;
  image?: string;
  link: string;
}

const COMMUNITY_UPDATES: UpdateItem[] = [
  {
    id: '1',
    type: 'news',
    title: 'Breakthrough in Room-Temperature Superconductors',
    date: 'April 20, 2026',
    description: 'A team at CRONOS Labs has published a pre-print detailing a new hydride material that shows superconducting properties at 295K.',
    source: 'arXiv physics.app-ph',
    link: '#'
  },
  {
    id: '2',
    type: 'conference',
    title: 'ICML 2026: Galactic Intelligence Workshop',
    date: 'July 12-18, 2026',
    description: 'Call for papers is now open for the specialized workshop on AI in Astronomy and Satellite Communications.',
    source: 'Vienna, Austria',
    link: '#'
  },
  {
    id: '3',
    type: 'award',
    title: 'Stellar Researcher Award 2026',
    date: 'Applications Close: May 15',
    description: 'Funding available for early-career researchers demonstrating exceptional work in neural-symbolic integration.',
    source: 'CRONOS Foundation',
    link: '#'
  },
  {
    id: '4',
    type: 'competition',
    title: 'The Great Lunar Coding Challenge',
    date: 'June 5, 2026',
    description: 'Develop an algorithm to optimize rover navigation in craters. Top 3 teams win cloud compute credits.',
    source: 'NASA x CRONOS',
    link: '#'
  },
  {
    id: '5',
    type: 'news',
    title: 'New Policy on AI-Generated Content in Journals',
    date: 'April 18, 2026',
    description: 'The International Board of Open Research has updated its guidelines regarding the use of LLMs in manuscript preparation.',
    source: 'Scientific Ethics',
    link: '#'
  },
  {
    id: '6',
    type: 'conference',
    title: 'NeurIPS 2026: Global Satellite Summit',
    date: 'Dec 6-12, 2026',
    description: 'Registration for the satellite summit on distributed machine learning is now entering early-bird phase.',
    source: 'Vancouver, BC',
    link: '#'
  }
];

export default function CommunityUpdatesPage() {
  const [filter, setFilter] = useState<'all' | 'news' | 'conference' | 'award' | 'competition'>('all');

  const filteredUpdates = React.useMemo(() => {
    return filter === 'all' 
      ? COMMUNITY_UPDATES 
      : COMMUNITY_UPDATES.filter(u => u.type === filter);
  }, [filter]);

  const featured = COMMUNITY_UPDATES[0];

  return (
    <div className="community-updates-viewport">
      <div className="cosmic-spotlight"></div>
      
      <div className="page-minimal" style={{ background: 'transparent', position: 'relative', zIndex: 10 }}>
        {/* Cinematic Header Block */}
        <div className="updates-hero">
          <div className="hero-kicker">RESEARCH ECOSYSTEM</div>
          <h1 className="hero-main-title">Community Updates</h1>
          <p className="hero-lead">Synchronize with upcoming conferences, awards, and global research breakthroughs.</p>
        </div>

        {/* Featured Breakthrough - Fixed Architectural Element */}
        <section className="featured-horizon">
          <div className="featured-glass-card">
            <div className="featured-info">
              <span className="featured-label">STREAMS // FEATURED</span>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <div className="featured-footer">
                <span className="source-meta">{featured.source}</span>
                <a href={featured.link} className="btn-premium-minimal" style={{ background: 'var(--gradient-primary)', border: 'none', color: '#fff', padding: '0 24px', textDecoration: 'none', fontSize: '12px' }}>
                  EXPLORE DISCOVERY
                </a>
              </div>
            </div>
            <div className="featured-graphic">
              <div className="galactic-ring"></div>
              <div className="galactic-core"></div>
            </div>
          </div>
        </section>

        {/* Persistent Navigation Island */}
        <nav className="updates-nav-island">
          <div className="nav-blur-bg"></div>
          {['all', 'news', 'conference', 'award', 'competition'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`nav-mode-btn ${filter === f ? 'is-active' : ''}`}
            >
              {f}
            </button>
          ))}
        </nav>

        {/* Stable Results Grid */}
        <div className="updates-stable-grid">
          {filteredUpdates.map((update) => (
            <article key={update.id} className="update-entry-card fade-in">
              <div className="entry-head">
                <span className="entry-tag" data-tag={update.type}>{update.type}</span>
                <span className="entry-date">{update.date}</span>
              </div>
              <h3 className="entry-title">{update.title}</h3>
              <p className="entry-desc">{update.description}</p>
              <div className="entry-footer">
                <span className="entry-source">{update.source}</span>
                <a href={update.link} className="entry-link">SYNC →</a>
              </div>
            </article>
          ))}
        </div>
      </div>

    </div>
  );
}
