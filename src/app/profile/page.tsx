'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="profile-page" id="profile-page">
      {/* Profile Header */}
      <div className="profile-header" id="profile-header">
        <div className="profile-avatar">
          {profile.full_name.charAt(0)}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{profile.full_name}</h1>
          <div className="profile-username">@{profile.username}</div>
          <p className="profile-bio">{profile.bio}</p>
          <div className="profile-interests">
            {profile.research_interests.map((interest) => (
              <Link
                key={interest}
                href={`/papers?category=${interest}`}
                className="badge badge-category"
                style={{ textDecoration: 'none' }}
              >
                {interest}
              </Link>
            ))}
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : '✏️ Edit'}
        </button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="sidebar-card" style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 className="modal-title">Edit Profile</h3>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" defaultValue={profile.full_name} id="edit-fullname" />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" defaultValue={profile.username} id="edit-username" />
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea className="form-input" defaultValue={profile.bio} rows={3} id="edit-bio" />
          </div>
          <div className="form-group">
            <label className="form-label">Research Interests (comma-separated arXiv categories)</label>
            <input
              className="form-input"
              defaultValue={profile.research_interests.join(', ')}
              placeholder="cs.AI, cs.LG, stat.ML"
              id="edit-interests"
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setIsEditing(false)}>
              Save Changes
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs" id="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          📑 Bookmarks ({DEMO_BOOKMARKS.length})
        </button>
        <button
          className={`profile-tab ${activeTab === 'subscriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          📡 Subscriptions ({profile.research_interests.length})
        </button>
        <button
          className={`profile-tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          👥 Groups
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="papers-grid" id="bookmarks-list">
          {DEMO_BOOKMARKS.map((bm) => (
            <div key={bm.arxiv_id} className="paper-card">
              <div className="paper-card-header">
                <Link
                  href={`/papers/${encodeURIComponent(bm.arxiv_id)}`}
                  className="paper-title"
                  style={{ textDecoration: 'none' }}
                >
                  {bm.title}
                </Link>
                <button className="bookmark-btn active" title="Remove bookmark">★</button>
              </div>
              <div className="paper-meta">
                <span className="paper-authors">{bm.authors}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>·</span>
                <span className="paper-date">Saved {new Date(bm.saved_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="categories-grid">
          {profile.research_interests.map((cat) => (
            <Link
              key={cat}
              href={`/papers?category=${cat}`}
              className="category-card"
              style={{ textDecoration: 'none' }}
            >
              <div className="category-code">{cat}</div>
              <div className="category-name">Subscribed</div>
            </Link>
          ))}
          <Link
            href="/feed"
            className="category-card"
            style={{
              textDecoration: 'none',
              borderStyle: 'dashed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
            }}
          >
            + Manage topics
          </Link>
        </div>
      )}

      {activeTab === 'groups' && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-title">No groups yet</div>
          <div className="empty-state-text">Join or create a research group to collaborate with peers</div>
          <Link href="/groups" className="btn btn-primary">
            Browse Groups
          </Link>
        </div>
      )}
    </div>
  );
}
