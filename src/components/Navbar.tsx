'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Helper to generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    if (pathname === '/') return { parts: ['regex', 'home'], current: 'home' };
    
    // Split pathname: /papers/123 -> ['papers', '123']
    const pathParts = pathname.split('/').filter(Boolean);
    return {
      parts: ['regex', ...pathParts],
      current: pathParts[pathParts.length - 1] || 'regex'
    };
  };

  const { parts, current } = getBreadcrumbs();

  return (
    <header className={`home-header ${pathname === '/' ? 'is-home' : ''}`}>
      <Link href="/" className="logo-island">
        <div className="logo-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        </div>
        Research GPT
      </Link>
      
      <div className="breadcrumb-island">
        {parts.map((part, i) => (
          <span key={part + i} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: part === current && i === parts.length - 1 ? '#FFFFFF' : '#666666' }}>
              {part}
            </span>
            {i < parts.length - 1 && (
              <span style={{ color: '#666666', margin: '0 12px' }}>/</span>
            )}
          </span>
        ))}
      </div>
      
      <div className="navbar-auth" style={{ display: 'flex', gap: '20px' }}>
        <Link href="/papers" className={`nav-link-minimal ${pathname.startsWith('/papers') ? 'active' : ''}`}>Papers</Link>
        <Link href="/feed" className={`nav-link-minimal ${pathname === '/feed' ? 'active' : ''}`}>Feed</Link>
        <Link href="/profile" className={`nav-link-minimal ${pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
      </div>
    </header>
  );
}
