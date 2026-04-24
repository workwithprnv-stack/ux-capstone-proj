'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CronosLogo from './CronosLogo';

export default function Navbar() {
  const pathname = usePathname();

  // Helper to generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    if (pathname === '/') return { parts: ['cronos', 'home'], current: 'home' };
    
    // Split pathname: /papers/123 -> ['papers', '123']
    const pathParts = pathname.split('/').filter(Boolean);
    return {
      parts: ['cronos', ...pathParts],
      current: pathParts[pathParts.length - 1] || 'cronos'
    };
  };

  const { parts, current } = getBreadcrumbs();

  return (
    <header className={`home-header ${pathname === '/' ? 'is-home' : ''}`}>
      <Link href="/" className="logo-island" style={{ gap: '16px' }}>
        <div className="logo-icon" style={{ background: 'none', padding: 0 }}>
          <CronosLogo size={42} />
        </div>
        <span style={{ letterSpacing: '0.4em', fontWeight: 600, fontSize: '14px', marginLeft: '-4px' }}>CRONOS</span>
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
        <Link href="/community-updates" className={`nav-link-minimal ${pathname === '/community-updates' ? 'active' : ''}`}>Updates</Link>
        <Link href="/connect" className={`nav-link-minimal ${pathname === '/connect' ? 'active' : ''}`}>Connect</Link>
        <Link href="/profile" className={`nav-link-minimal ${pathname === '/profile' ? 'active' : ''}`}>Profile</Link>
      </div>
    </header>
  );
}
