'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="groups-page" id="groups-page">
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="section-title">Research Groups</h1>
            <p className="section-subtitle">Join a group to collaborate, share papers, and discuss research</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
            id="create-group-btn"
          >
            + Create Group
          </button>
        </div>
      </div>

      {/* Search/Filter */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <input
          className="form-input"
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '400px' }}
          id="groups-search"
        />
      </div>

      {/* Groups Grid */}
      <div className="groups-grid" id="groups-list">
        {filteredGroups.map((group) => (
          <div key={group.id} className="group-card">
            <h3 className="group-card-title">{group.name}</h3>
            <p className="group-card-desc">{group.description}</p>
            <div className="group-card-footer">
              <span>👥 {group.member_count} members</span>
              <span>Created by {group.creator_name}</span>
            </div>
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Join Group
              </button>
              <button className="btn btn-secondary btn-sm">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No groups found</div>
          <div className="empty-state-text">Try adjusting your search or create a new group</div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} id="create-group-modal">
            <h2 className="modal-title">Create Research Group</h2>
            <div className="form-group">
              <label className="form-label">Group Name</label>
              <input className="form-input" placeholder="e.g., Quantum Machine Learning" id="group-name-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                placeholder="Describe the focus and goals of your research group..."
                rows={4}
                id="group-desc-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Topics (optional)</label>
              <input
                className="form-input"
                placeholder="e.g., cs.AI, quant-ph"
                id="group-topics-input"
              />
              <div className="form-hint">Comma-separated arXiv categories</div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(false)}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
