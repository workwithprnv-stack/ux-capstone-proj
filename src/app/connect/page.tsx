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
                animationDelay: `-${(res.startAngle / 360) * res.orbitSpeed}s`
              }}
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
            <div className="modal-header">
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
                style={{ flex: 1, padding: '16px', fontSize: '13px', border: '1px solid #333' }}
                onClick={() => setSelectedResearcher(null)}
              >
                Discard
              </button>
              <button 
                className="btn-premium-minimal active" 
                style={{ flex: 2, padding: '16px', fontSize: '13px', background: 'var(--gradient-primary)', color: '#fff' }}
                onClick={() => handleConnect(selectedResearcher.id)}
                disabled={connecting === selectedResearcher.id}
              >
                {connecting === selectedResearcher.id ? 'SYNCHRONIZING...' : 'CONNECT'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .connect-galaxy-wrapper {
          position: relative;
          background: #000;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        .clean-starfield {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(1px 1px at 10% 20%, #fff 100%, transparent),
            radial-gradient(1px 1px at 15% 70%, #fff 80%, transparent),
            radial-gradient(1.5px 1.5px at 30% 40%, rgba(255,255,255,0.8) 100%, transparent),
            radial-gradient(1px 1px at 50% 50%, #fff 100%, transparent),
            radial-gradient(1px 1px at 70% 30%, #fff 70%, transparent),
            radial-gradient(1.2px 1.2px at 85% 85%, #fff 100%, transparent);
          background-size: 350px 350px;
          opacity: 0.15;
        }

        .galaxy-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
        }

        .center-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(220, 105, 168, 0.1) 0%, transparent 70%);
          transform: translate(-50%, -50%);
        }

        .saturn-hub {
          position: relative;
          filter: drop-shadow(0 0 30px rgba(220, 105, 168, 0.3));
        }

        .user-hub-tag {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          letter-spacing: 0.5em;
          color: #DC69A8;
          font-weight: 700;
        }

        .orbits-container {
          position: absolute;
          inset: 0;
          z-index: 10;
        }

        .orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.12); /* More visible */
          border-radius: 50%;
          pointer-events: none;
        }

        .planet-wrapper {
          position: absolute;
          top: -20px;
          left: 50%;
          width: 40px;
          height: 40px;
          margin-left: -20px;
          pointer-events: auto;
          animation: orbitRotate linear infinite;
        }

        .orbit-ring:nth-child(1) .planet-wrapper { transform-origin: 20px calc(120px + 20px); }
        .orbit-ring:nth-child(2) .planet-wrapper { transform-origin: 20px calc(180px + 20px); }
        .orbit-ring:nth-child(3) .planet-wrapper { transform-origin: 20px calc(250px + 20px); }
        .orbit-ring:nth-child(4) .planet-wrapper { transform-origin: 20px calc(150px + 20px); }

        @keyframes orbitRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .profile-planet {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 12px;
          cursor: pointer;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }

        .profile-planet:hover {
          transform: scale(1.4);
          box-shadow: 0 0 30px rgba(220, 105, 168, 0.4);
          z-index: 100;
        }

        .planet-hover-label {
          position: absolute;
          top: 50px;
          white-space: nowrap;
          background: #000;
          color: #fff;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .profile-planet:hover .planet-hover-label {
          opacity: 1;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-card {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          width: 90%;
          max-width: 500px;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 30px 100px rgba(0,0,0,1);
        }

        .avatar-circle {
          width: 60px;
          height: 60px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 20px;
        }

        /* Re-using premium minimal button styles */
        .btn-premium-minimal {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .btn-premium-minimal:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }

        .btn-premium-minimal:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      `}</style>
    </div>
  );
}
