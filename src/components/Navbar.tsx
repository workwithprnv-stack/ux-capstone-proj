'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/papers', label: 'Papers' },
    { href: '/feed', label: 'Feed' },
    { href: '/groups', label: 'Groups' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="navbar-brand-icon">🔬</span>
          regex
        </Link>

        <ul className="navbar-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-auth">
          <Link href="/auth/signin" className="btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link href="/auth/signup" className="btn btn-primary btn-sm">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
