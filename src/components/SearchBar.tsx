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
    <form onSubmit={handleSubmit} className="search-container" id="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search-input"
        />
        <button type="submit" className="btn btn-primary btn-sm search-btn" id="search-submit-btn">
          Search
        </button>
      </div>
    </form>
  );
}
