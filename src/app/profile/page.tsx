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
                width: '80px', 
                height: '80px', 
                background: 'var(--gradient-primary)', 
                color: '#fff', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '32px', 
                fontWeight: '700',
                boxShadow: '0 0 30px rgba(220, 105, 168, 0.4)'
              }}>
                {profile.full_name.charAt(0)}
              </div>
              <div>
                <h1 className="section-title-minimal" style={{ fontSize: '36px', marginBottom: '4px' }}>{profile.full_name}</h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px', letterSpacing: '0.1em' }}>@{profile.username}</div>
              </div>
              <button
                className="btn-premium-minimal secondary"
                style={{ marginLeft: 'auto', border: '1px solid #DC69A8', color: '#DC69A8' }}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            <p className="section-subtitle-minimal" style={{ maxWidth: '600px', lineHeight: '1.6', color: '#888' }}>{profile.bio}</p>
          </div>

          {/* Edit Form Island */}
          {isEditing && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '16px', padding: '32px', marginBottom: '48px' }}>
              <h3 className="section-title-minimal" style={{ fontSize: '18px', marginBottom: '24px' }}>Update Identity</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Name</label>
                  <input className="search-input-modern" style={{ height: '40px', background: 'var(--bg-primary)', border: '1px solid #333' }} defaultValue={profile.full_name} />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Handle</label>
                  <input className="search-input-modern" style={{ height: '40px', background: 'var(--bg-primary)', border: '1px solid #333' }} defaultValue={profile.username} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Biography</label>
                <textarea className="search-input-modern" style={{ height: '80px', background: 'var(--bg-primary)', border: '1px solid #333', paddingTop: '10px' }} defaultValue={profile.bio} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="btn-premium-minimal" style={{ background: 'var(--gradient-primary)' }} onClick={() => setIsEditing(false)}>Save Identity</button>
                <button className="btn-premium-minimal secondary" onClick={() => setIsEditing(false)}>Discard</button>
              </div>
            </div>
          )}

          {/* Tabs Navigation */}
          <div style={{ marginBottom: '48px' }}>
            <div className="tab-container-minimal">
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={`tab-btn-minimal ${activeTab === 'bookmarks' ? 'active' : ''}`}
              >
                Bookmarks
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`tab-btn-minimal ${activeTab === 'subscriptions' ? 'active' : ''}`}
              >
                Subscriptions
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`tab-btn-minimal ${activeTab === 'groups' ? 'active' : ''}`}
              >
                Collaboration
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: '400px' }}>
            {activeTab === 'bookmarks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {DEMO_BOOKMARKS.map((bm) => (
                  <div key={bm.arxiv_id} className="paper-card-minimal">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link href={`/papers/${bm.arxiv_id}`} className="paper-title-minimal" style={{ fontSize: '15px' }}>{bm.title}</Link>
                      <button style={{ background: 'none', border: 'none', color: '#DC69A8', fontSize: '18px', cursor: 'pointer' }}>★</button>
                    </div>
                    <div className="paper-meta-minimal">
                      <span>{bm.authors}</span>
                      <span style={{ color: '#444' }}>·</span>
                      <span style={{ color: '#666' }}>Saved {new Date(bm.saved_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {profile.research_interests.map((cat) => (
                  <div key={cat} className="paper-card-minimal" style={{ padding: '24px', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{formatCategory(cat, true)}</div>
                    <div style={{ fontSize: '10px', color: '#DC69A8', textTransform: 'uppercase' }}>Subscribed</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'groups' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', border: '1px dashed #222', borderRadius: '16px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>No research clusters joined</div>
                <Link href="/groups" className="btn-premium-minimal active" style={{ background: 'var(--gradient-primary)', color: '#fff', padding: '10px 24px', fontSize: '13px', textDecoration: 'none' }}>
                  Explore Clusters
                </Link>
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
                  style={{ textDecoration: 'none', borderColor: '#333' }}
                >
                  {formatCategory(interest, true)}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '16px', color: '#ffffff' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '12px', color: '#DC69A8' }}>Network Synchronization</h4>
            <p style={{ fontSize: '12px', lineHeight: '1.5', marginBottom: '16px', color: '#888' }}>Connect with peers orbiting similar research interests.</p>
            <Link href="/connect" className="btn-premium-minimal" style={{ width: '100%', marginTop: '8px', display: 'block', textAlign: 'center', background: 'var(--gradient-primary)' }}>
              Open Connect
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
