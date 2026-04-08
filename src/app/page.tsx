'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AsciiSphere from '@/components/AsciiSphere';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/papers?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="home-minimal" id="home-page">
      {/* Background/Visual Decorations */}
      <AsciiSphere />
      
      {/* Main Content Area */}
      <main className="home-main">
        <form onSubmit={handleSubmit} className="search-section">
          <div className="search-wrapper-modern">
            <span className="search-icon-modern">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              className="search-input-modern" 
              placeholder="Search" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <span className="shortcut-hint">⌘ /</span>
          </div>
        </form>
      </main>

      {/* Footer Area */}
      <footer className="home-footer-minimal">
        <div className="copyright">
          © 2026 Nano
        </div>
        
        <nav className="footer-nav">
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </footer>

      <style jsx global>{`
        .footer {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
