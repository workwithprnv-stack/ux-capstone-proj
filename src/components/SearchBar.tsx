'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  size?: 'default' | 'large';
}

export default function SearchBar({ defaultValue = '', placeholder = 'Search papers, authors, topics...', size = 'default' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/papers?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-wrapper-modern" id="search-bar" style={{ maxWidth: size === 'large' ? '800px' : '500px' }}>
      <span className="search-icon-modern">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>
      <input
        type="text"
        className="search-input-modern"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        id="search-input"
      />
      <span className="shortcut-hint">⌘ /</span>
    </form>
  );
}
