'use client';

import React from 'react';
import Link from 'next/link';
import CronosLogo from '@/components/CronosLogo';

export default function AboutPage() {
  return (
    <div className="page-minimal" id="about-page">
      <Link href="/" className="nav-link-minimal" style={{ marginBottom: '48px', display: 'inline-block' }}>
        ← Back to home
      </Link>

      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
          <CronosLogo size={64} />
          <h1 className="section-title-minimal" style={{ fontSize: '48px', letterSpacing: '-0.02em' }}>About CRONOS</h1>
        </div>

        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px' }}>
            Our Philosophy
          </h2>
          <p style={{ fontSize: '20px', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: '400', marginBottom: '32px' }}>
            The name <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>CRONOS</span> was chosen to remind us of the profound connectivity inherent in human knowledge. 
            Just as celestial bodies are bound by gravity, our ideas orbit around our minds, constantly interacting, influencing, and evolving.
          </p>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            We believe that brilliance isn't born in isolation. It is the result of thousands of intellectual orbits colliding in a shared space. 
            Our platform is designed to be that space—a gravity well for the world's most ambitious research.
          </p>
        </section>

        <section style={{ marginBottom: '80px', padding: '40px', background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px' }}>
            Our Mission
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '12px' }}>Dedicated to Researchers</h3>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.6' }}>
                We are building the first platform truly optimized for the modern researcher's workflow. 
                Integrating arXiv's vast library with real-time collaboration and intuitive discovery tools.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '12px' }}>Accelerating Discovery</h3>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: '1.6' }}>
                By reducing the friction between finding a paper and discussing its implications, 
                we aim to shorten the cycle from hypothesis to breakthrough.
              </p>
            </div>
          </div>
        </section>

        <section style={{ textAlign: 'center', paddingTop: '40px' }}>
          <p style={{ color: '#444', fontSize: '14px', marginBottom: '24px' }}>Ready to start your next research journey?</p>
          <Link href="/papers" className="filter-chip-minimal active" style={{ padding: '12px 32px', fontSize: '15px' }}>
            Explore the Galaxy of Knowledge
          </Link>
        </section>
      </div>
    </div>
  );
}
