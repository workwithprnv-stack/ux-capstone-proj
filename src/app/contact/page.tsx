'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="contact-page-wrapper">
      {/* Milky Way Background Overlay */}
      <div className="milky-way-overlay">
        <div className="galaxy-cloud"></div>
        <div className="stars-layer-1"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
      </div>

      <div className="page-minimal" style={{ background: 'transparent', position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Link href="/" className="nav-link-minimal" style={{ position: 'absolute', top: '100px', left: '40px' }}>
          ← Back
        </Link>

        <div className="contact-card">
          <h1 className="section-title-minimal" style={{ fontSize: '42px', textAlign: 'center', marginBottom: '16px' }}>Get in touch</h1>
          <p style={{ color: '#888', textAlign: 'center', marginBottom: '48px', maxWidth: '400px' }}>
            Whether you have a discovery to share or need technical support, our team is ready to synchronize.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '40px', backdropFilter: 'blur(10px)', width: '100%', maxWidth: '500px' }}>
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>General Inquiries</label>
              <a href="mailto:hello@cronos.research" style={{ fontSize: '24px', color: '#fff', textDecoration: 'none', fontWeight: '500', borderBottom: '1px solid #333', paddingBottom: '4px' }}>
                hello@cronos.research
              </a>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>Support Orbit</label>
              <div style={{ fontSize: '16px', color: '#aaa' }}>support@cronos.research</div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #1a1a1a' }}>
              <a href="#" className="nav-link-minimal">Twitter</a>
              <a href="#" className="nav-link-minimal">Discord</a>
              <a href="#" className="nav-link-minimal">GitHub</a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-page-wrapper {
          position: relative;
          background: #000;
          overflow: hidden;
          min-height: 100vh;
        }

        .milky-way-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 70% 30%, #1a1a2e 0%, #000 70%);
          z-index: 0;
        }

        .galaxy-cloud {
          position: absolute;
          top: -20%;
          left: -10%;
          width: 140%;
          height: 140%;
          background: 
            radial-gradient(ellipse at 50% 50%, rgba(193, 116, 163, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 40%, rgba(42, 26, 76, 0.12) 0%, transparent 60%);
          filter: blur(80px);
          transform: rotate(-15deg);
        }

        .stars-layer-1, .stars-layer-2, .stars-layer-3 {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .stars-layer-1 {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, #fff, transparent),
            radial-gradient(1.5px 1.5px at 50% 70%, #fff, transparent),
            radial-gradient(1px 1px at 80% 40%, #fff, transparent),
            radial-gradient(2px 2px at 15% 85%, #fff, transparent),
            radial-gradient(1px 1px at 90% 10%, #fff, transparent),
            radial-gradient(1px 1px at 40% 20%, #fff, transparent);
          background-size: 400px 400px;
          opacity: 0.3;
        }

        .stars-layer-2 {
          background-image: 
            radial-gradient(1px 1px at 30% 60%, rgba(193, 116, 163, 0.8), transparent),
            radial-gradient(1px 1px at 70% 20%, rgba(129, 140, 248, 0.8), transparent);
          background-size: 300px 300px;
          opacity: 0.2;
          animation: float 20s linear infinite;
        }

        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-300px); }
        }

        .contact-card {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 40px;
        }
      `}</style>
    </div>
  );
}
