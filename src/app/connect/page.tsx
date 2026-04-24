'use client';

import React, { useState } from 'react';
import CronosLogo from '@/components/CronosLogo';

interface Researcher {
  id: string;
  name: string;
  avatar: string;
  abstracts: string[];
  orbitSpeed: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  startAngle: number;
  phase: number;
}

const DEMO_RESEARCHERS: Researcher[] = [
  {
    id: '1',
    name: 'Dr. Elena Vance',
    avatar: 'EV',
    orbitRadiusX: 350,
    orbitRadiusY: 120,
    orbitSpeed: 50,
    startAngle: 0,
    phase: 15,
    abstracts: [
      "This paper explores the integration of neural-symbolic systems to enhance the interpretability of large language models in scientific reasoning contexts.",
      "A proposed framework for distributed consensus mechanisms designed specifically for high-latency interstellar communication networks."
    ]
  },
  {
    id: '2',
    name: 'Prof. Marcus Thorne',
    avatar: 'MT',
    orbitRadiusX: 550,
    orbitRadiusY: 180,
    orbitSpeed: 70,
    startAngle: 120,
    phase: -10,
    abstracts: [
      "A comprehensive study on quantifying epistemic uncertainty in transformer architectures when processing novel biological sequences.",
      "Investigating the topological properties of latent manifolds to improve zero-shot transfer learning across disparate physics domains."
    ]
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    avatar: 'SJ',
    orbitRadiusX: 750,
    orbitRadiusY: 250,
    orbitSpeed: 90,
    startAngle: 240,
    phase: 25,
    abstracts: [
      "Novel parameter-efficient fine-tuning strategies for multi-modal foundational models used in climate modeling and prediction.",
      "Bridging the linguistic gap: cross-lingual transfer methodologies for extracting structured knowledge from multi-lingual arXiv datasets."
    ]
  },
  {
    id: '4',
    name: 'Leo Maxwell',
    avatar: 'LM',
    orbitRadiusX: 450,
    orbitRadiusY: 150,
    orbitSpeed: 60,
    startAngle: 180,
    phase: -20,
    abstracts: [
      "Deep reinforcement learning agents optimized for autonomous laboratory experiments with safety-constrained exploration policies.",
      "Modeling human-researcher feedback loops to improve the relevance of AI-generated literature summaries."
    ]
  }
];

export default function ConnectPage() {
  const [selectedResearcher, setSelectedResearcher] = useState<Researcher | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnecting(null);
      setSelectedResearcher(null);
    }, 1500);
  };

  return (
    <div className="connect-galaxy-wrapper">
      {/* Clean Faint Starfield */}
      <div className="clean-starfield"></div>
      
      {/* Central Hub */}
      <div className="galaxy-center">
        <div className="center-glow"></div>
        <div className="saturn-hub">
          <CronosLogo size={150} />
          <div className="user-hub-tag">CRONOS HUB</div>
        </div>
      </div>

      {/* Spaced Out Orbits */}
      <div className="orbits-container">
        {DEMO_RESEARCHERS.map((res) => (
          <div 
            key={res.id} 
            className="orbit-ring" 
            style={{ 
              width: res.orbitRadiusX * 2, 
              height: res.orbitRadiusY * 2,
              transform: `translate(-50%, -50%) rotate(${res.phase}deg)`
            }}
          >
            <div 
              className="planet-wrapper" 
              style={{ 
                animationDuration: `${res.orbitSpeed}s`,
                animationDelay: `-${(res.startAngle / 360) * res.orbitSpeed}s`,
                transformOrigin: `20px calc(${res.orbitRadiusY}px + 20px)`
              } as React.CSSProperties}
            >
              <div 
                className="profile-planet"
                onDoubleClick={() => setSelectedResearcher(res)}
              >
                <div className="planet-initials">{res.avatar}</div>
                <div className="planet-hover-label">{res.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Structural Modal Details */}
      {selectedResearcher && (
        <div className="modal-overlay" onClick={() => setSelectedResearcher(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
              <div className="avatar-circle">{selectedResearcher.avatar}</div>
              <div className="header-text">
                <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>{selectedResearcher.name}</h2>
                <div style={{ color: '#DC69A8', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Academic Peer</div>
              </div>
            </div>
            
            <div className="modal-content-area">
              <h3 style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>Research Abstracts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {selectedResearcher.abstracts.map((abs, idx) => (
                  <div key={idx} style={{ paddingLeft: '20px', borderLeft: '2px solid #301852' }}>
                    <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.7', fontStyle: 'italic' }}>
                      "{abs}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
              <button 
                className="btn-premium-minimal secondary"
                style={{ flex: 1, padding: '16px', fontSize: '13px', border: '1px solid #333', background: 'transparent', color: '#fff', borderRadius: '12px' }}
                onClick={() => setSelectedResearcher(null)}
              >
                Discard
              </button>
              <button 
                className="btn-premium-minimal active" 
                style={{ flex: 2, padding: '16px', fontSize: '13px', background: 'var(--gradient-primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700' }}
                onClick={() => handleConnect(selectedResearcher.id)}
                disabled={connecting === selectedResearcher.id}
              >
                {connecting === selectedResearcher.id ? 'SYNCHRONIZING...' : 'CONNECT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
