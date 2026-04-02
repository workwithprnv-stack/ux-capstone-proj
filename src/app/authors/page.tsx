'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Author } from '@/lib/types';
import { getGravatarUrl, getFallbackAvatarUrl } from '@/lib/gravatar';
import SearchBar from '@/components/SearchBar';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch('/api/authors');
        if (res.ok) {
          const data = await res.json();
          setAuthors(data.authors || []);
        }
      } catch (error) {
        console.error('Error fetching authors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (author.affiliation && author.affiliation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="authors-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <span className="loading-text">Loading authors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="authors-page">
      <div className="page-header">
        <h1 className="page-title">Authors</h1>
        <p className="page-subtitle">Explore research papers by author</p>
        <div className="search-container">
          <SearchBar 
            defaultValue={searchQuery}
            placeholder="Search authors by name or affiliation..."
          />
        </div>
      </div>

      {filteredAuthors.length > 0 ? (
        <div className="authors-grid">
          {filteredAuthors.map((author) => (
            <div key={author.name} className="author-card">
              <div className="author-card-avatar">
                <Image
                  src={author.email ? getGravatarUrl(author.email, 60) : getFallbackAvatarUrl(author.name, 60)}
                  alt={author.name}
                  width={60}
                  height={60}
                  className="author-card-img"
                  unoptimized
                />
              </div>
              <div className="author-card-info">
                <h3 className="author-card-name">{author.name}</h3>
                {author.affiliation && (
                  <p className="author-card-affiliation">{author.affiliation}</p>
                )}
                <a 
                  href={`/authors/${encodeURIComponent(author.name)}`}
                  className="author-card-link"
                >
                  View papers →
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <div className="empty-state-title">
            {searchQuery ? 'No authors found' : 'No authors available'}
          </div>
          <div className="empty-state-text">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'Start by searching for papers to discover authors.'
            }
          </div>
        </div>
      )}
    </div>
  );
}
