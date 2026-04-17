'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCategory } from '@/lib/types';

interface GroupItem {
  id: string;
  name: string;
  description: string;
  member_count: number;
  created_at: string;
  creator_name: string;
}

const DEMO_GROUPS: GroupItem[] = [
  {
    id: '1',
    name: 'Transformer Architectures',
    description: 'Discussing the latest transformer architectures, attention mechanisms, and their applications across NLP, vision, and multi-modal tasks.',
    member_count: 42,
    created_at: '2026-01-15',
    creator_name: 'Dr. Sarah Chen',
  },
  {
    id: '2',
    name: 'AI Safety & Alignment',
    description: 'Research group focused on AI alignment, safety techniques, RLHF, constitutional AI, and ensuring beneficial AI systems.',
    member_count: 28,
    created_at: '2026-02-01',
    creator_name: 'Prof. James Wright',
  },
  {
    id: '3',
    name: 'Computer Vision Frontiers',
    description: 'Latest advances in computer vision — diffusion models, 3D reconstruction, video understanding, and beyond.',
    member_count: 56,
    created_at: '2025-11-20',
    creator_name: 'Dr. Maria Garcia',
  },
  {
    id: '4',
    name: 'Computational Biology',
    description: 'Intersection of ML and biology — protein folding, genomics, drug discovery, and biomedical NLP.',
    member_count: 19,
    created_at: '2026-01-28',
    creator_name: 'Dr. Alex Kim',
  },
  {
    id: '5',
    name: 'Reinforcement Learning',
    description: 'Deep RL, multi-agent systems, offline RL, model-based approaches, and real-world applications.',
    member_count: 34,
    created_at: '2026-02-10',
    creator_name: 'Prof. Liu Wei',
  },
  {
    id: '6',
    name: 'Scientific Computing',
    description: 'Neural PDEs, physics-informed neural networks, numerical methods, and scientific ML applications.',
    member_count: 15,
    created_at: '2026-03-01',
    creator_name: 'Dr. Emily Park',
  },
];

export default function GroupsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groups] = useState<GroupItem[]>(DEMO_GROUPS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter(
    g => g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         g.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-minimal" id="groups-page">
      <div className="page-header-minimal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="section-title-minimal">Research Clusters</h1>
          <p className="section-subtitle-minimal">Synchronize with peers and co-search specific fields</p>
        </div>
        <button
          className="filter-chip-minimal active"
          onClick={() => setShowCreateModal(true)}
          id="create-group-btn"
        >
          Initialize Cluster
        </button>
      </div>

      {/* Search/Filter Area */}
      <div style={{ marginBottom: '60px', maxWidth: '400px' }}>
        <div className="search-wrapper-modern" style={{ height: '40px' }}>
          <span className="search-icon-modern">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            className="search-input-modern"
            placeholder="Search clusters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="groups-search"
          />
        </div>
      </div>

      {/* Groups Minimal Grid */}
      <div className="papers-grid" id="groups-list">
        {filteredGroups.map((group) => (
          <div key={group.id} className="paper-card-minimal" style={{ padding: '32px' }}>
            <h3 className="paper-title-minimal" style={{ fontSize: '18px', marginBottom: '16px' }}>{group.name}</h3>
            <p className="paper-abstract-minimal" style={{ marginBottom: '24px', WebkitLineClamp: '3' }}>{group.description}</p>
            
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {group.member_count} synchronizing
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="nav-link-minimal" style={{ fontSize: '12px', borderBottom: '1px solid var(--border-subtle)' }}>Join</button>
                <button className="nav-link-minimal" style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Open ↗</button>
              </div>
            </div>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No clusters localized</div>
            <div className="empty-state-text">Try adjusting your filters or initialize a new research cluster.</div>
          </div>
        )}
      </div>

      {/* Modern Modal Island */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(14, 14, 14, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowCreateModal(false)}>
          <div style={{ width: '480px', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '24px', padding: '40px' }} onClick={(e) => e.stopPropagation()} id="create-group-modal">
            <h2 className="section-title-minimal" style={{ fontSize: '20px', marginBottom: '32px' }}>Initialize Cluster</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Cluster Name</label>
                <input className="search-input-modern" style={{ height: '40px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }} placeholder="e.g. Neural Dynamics" />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Mission Statement</label>
                <textarea 
                  className="search-input-modern" 
                  style={{ height: '100px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', paddingTop: '12px' }} 
                  placeholder="Define the synchronization goals..." 
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Fields of Interest</label>
                <input className="search-input-modern" style={{ height: '40px', background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)' }} placeholder="cs.AI, quant-ph..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '40px', justifyContent: 'flex-end' }}>
              <button className="nav-link-minimal" onClick={() => setShowCreateModal(false)}>Discard</button>
              <button className="filter-chip-minimal active" onClick={() => setShowCreateModal(false)}>Initialize</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
