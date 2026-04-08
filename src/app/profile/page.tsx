'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCategory } from '@/lib/types';

interface BookmarkItem {
  arxiv_id: string;
  title: string;
  authors: string;
  saved_at: string;
}

// Demo data for UI showcase
const DEMO_BOOKMARKS: BookmarkItem[] = [
  {
    arxiv_id: '2301.00001',
    title: 'Attention Is All You Need: Revisited',
    authors: 'A. Vaswani, N. Shazeer, et al.',
    saved_at: '2026-03-20',
  },
  {
    arxiv_id: '2301.00002',
    title: 'Scaling Laws for Neural Language Models',
    authors: 'J. Kaplan, S. McCandlish, et al.',
    saved_at: '2026-03-18',
  },
  {
    arxiv_id: '2301.00003',
    title: 'Constitutional AI: Harmlessness from AI Feedback',
    authors: 'Y. Bai, S. Kadavath, et al.',
    saved_at: '2026-03-15',
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'subscriptions' | 'groups'>('bookmarks');
  const [isEditing, setIsEditing] = useState(false);

  // Demo profile data
  const profile = {
    username: 'researcher',
    full_name: 'Alex Researcher',
    bio: 'Machine Learning researcher passionate about transformers, NLP, and AI alignment. Currently exploring the intersection of language models and scientific discovery.',
    research_interests: ['cs.AI', 'cs.CL', 'cs.LG', 'stat.ML'],
  };

  return (
    <div className="page-minimal" id="profile-page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '60px' }}>
        {/* Main Content Area */}
        <div>
          {/* Profile Header Block */}
          <div className="page-header-minimal" style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: '#fff', 
                color: '#000', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '24px', 
                fontWeight: '700' 
              }}>
                {profile.full_name.charAt(0)}
              </div>
              <div>
                <h1 className="section-title-minimal" style={{ fontSize: '32px', marginBottom: '4px' }}>{profile.full_name}</h1>
                <div style={{ color: '#666', fontSize: '14px' }}>@{profile.username}</div>
              </div>
              <button
                className="btn-premium-minimal secondary"
                style={{ marginLeft: 'auto' }}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <p className="section-subtitle-minimal" style={{ maxWidth: '600px', lineHeight: '1.6' }}>{profile.bio}</p>
          </div>

          {/* Edit Form Island */}
          {isEditing && (
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px', marginBottom: '48px' }}>
              <h3 className="section-title-minimal" style={{ fontSize: '18px', marginBottom: '24px' }}>Update Identity</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Name</label>
                  <input className="search-input-modern" style={{ height: '40px', background: '#000', border: '1px solid #222' }} defaultValue={profile.full_name} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Handle</label>
                  <input className="search-input-modern" style={{ height: '40px', background: '#000', border: '1px solid #222' }} defaultValue={profile.username} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Biography</label>
                <textarea className="search-input-modern" style={{ height: '80px', background: '#000', border: '1px solid #222', paddingTop: '10px' }} defaultValue={profile.bio} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="btn-premium-minimal" onClick={() => setIsEditing(false)}>Save Identity</button>
                <button className="btn-premium-minimal secondary" onClick={() => setIsEditing(false)}>Discard</button>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #1a1a1a', marginBottom: '40px' }}>
            <button
              onClick={() => setActiveTab('bookmarks')}
              style={{ 
                padding: '12px 0', 
                fontSize: '14px', 
                color: activeTab === 'bookmarks' ? '#fff' : '#444', 
                borderBottom: `2px solid ${activeTab === 'bookmarks' ? '#fff' : 'transparent'}`,
                background: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Bookmarks
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              style={{ 
                padding: '12px 0', 
                fontSize: '14px', 
                color: activeTab === 'subscriptions' ? '#fff' : '#444', 
                borderBottom: `2px solid ${activeTab === 'subscriptions' ? '#fff' : 'transparent'}`,
                background: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              style={{ 
                padding: '12px 0', 
                fontSize: '14px', 
                color: activeTab === 'groups' ? '#fff' : '#444', 
                borderBottom: `2px solid ${activeTab === 'groups' ? '#fff' : 'transparent'}`,
                background: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Collaboration
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: '400px' }}>
            {activeTab === 'bookmarks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {DEMO_BOOKMARKS.map((bm) => (
                  <div key={bm.arxiv_id} className="paper-card-minimal">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link href={`/papers/${bm.arxiv_id}`} className="paper-title-minimal" style={{ fontSize: '15px' }}>{bm.title}</Link>
                      <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>★</button>
                    </div>
                    <div className="paper-meta-minimal">
                      <span>{bm.authors}</span>
                      <span style={{ color: '#333' }}>·</span>
                      <span style={{ color: '#666' }}>Saved {new Date(bm.saved_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {profile.research_interests.map((cat) => (
                  <div key={cat} className="paper-card-minimal" style={{ padding: '20px', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>{formatCategory(cat)}</div>
                    <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase' }}>Subscribed</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'groups' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', border: '1px dashed #222', borderRadius: '16px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>No research clusters joined</div>
                <Link href="/groups" className="filter-chip-minimal active">Explore Clusters</Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <h3 style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Research Focus
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.research_interests.map((interest) => (
                <Link
                  key={interest}
                  href={`/papers?category=${interest}`}
                  className="filter-chip-minimal"
                  style={{ textDecoration: 'none' }}
                >
                  {formatCategory(interest)}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', color: '#000' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px' }}>Pro Upgrade</h4>
            <p style={{ fontSize: '12px', lineHeight: '1.5', marginBottom: '16px', opacity: 0.8 }}>Access deeper citation graphs and collaboration tools.</p>
            <button className="btn-premium-minimal dark" style={{ width: '100%', marginTop: '8px' }}>
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
