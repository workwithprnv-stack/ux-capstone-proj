'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Paper, Author } from '@/lib/types';
import PaperCard from '@/components/PaperCard';
import { getGravatarUrl, getFallbackAvatarUrl } from '@/lib/gravatar';
import SearchBar from '@/components/SearchBar';

interface AuthorDetails extends Author {
  paperCount?: number;
  hIndex?: number;
  firstPaper?: string;
  totalCitations?: number;
}

function AuthorContent() {
  const params = useParams();
  const authorId = params.authorId as string;
  
  const [author, setAuthor] = useState<AuthorDetails | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        // Fetch author details
        const authorRes = await fetch(`/api/authors/${encodeURIComponent(authorId)}`);
        
        if (authorRes.ok) {
          const authorData = await authorRes.json();
          setAuthor(authorData);
        } else {
          console.error('Author response not ok:', authorRes.status, authorRes.statusText);
          // Create fallback author data
          setAuthor({
            name: authorId,
            affiliation: 'Unknown Institution',
            paperCount: 0,
            totalCitations: 0,
            hIndex: 0
          });
        }

        // Fetch author's papers
        const papersRes = await fetch(`/api/authors/${encodeURIComponent(authorId)}/papers`);
        
        if (papersRes.ok) {
          const papersData = await papersRes.json();
          setPapers(papersData.papers || []);
        } else {
          console.error('Papers response not ok:', papersRes.statusText);
        }
      } catch (error) {
        console.error('Error fetching author data:', error);
        // Set fallback data on error
        setAuthor({
          name: authorId,
          affiliation: 'Unknown Institution',
          paperCount: 0,
          totalCitations: 0,
          hIndex: 0
        });
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchAuthorData();
    }
  }, [authorId]);

  // Client-side filtering for search
  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="author-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <span className="loading-text">Loading author details...</span>
        </div>
      </div>
    );
  }

  // Ensure we always have author data
  const displayAuthor = author || {
    name: authorId,
    affiliation: 'Unknown Institution',
    paperCount: 0,
    totalCitations: 0,
    hIndex: 0
  };

  return (
    <div className="author-page">
      {/* Author Header */}
      <div className="author-header">
        <div className="author-avatar-large">
          <Image
            src={displayAuthor.email ? getGravatarUrl(displayAuthor.email, 120) : getFallbackAvatarUrl(displayAuthor.name, 120)}
            alt={displayAuthor.name}
            width={120}
            height={120}
            className="author-avatar-img"
            unoptimized
          />
        </div>
        
        <div className="author-info">
          <h1 className="author-name-large">{displayAuthor.name}</h1>
          {displayAuthor.affiliation && (
            <p className="author-affiliation">{displayAuthor.affiliation}</p>
          )}
          
          <div className="author-stats">
            {displayAuthor.paperCount && (
              <div className="stat-item">
                <span className="stat-value">{displayAuthor.paperCount}</span>
                <span className="stat-label">Papers</span>
              </div>
            )}
            {displayAuthor.totalCitations && (
              <div className="stat-item">
                <span className="stat-value">{displayAuthor.totalCitations.toLocaleString()}</span>
                <span className="stat-label">Citations</span>
              </div>
            )}
            {displayAuthor.hIndex && (
              <div className="stat-item">
                <span className="stat-value">{displayAuthor.hIndex}</span>
                <span className="stat-label">h-index</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Papers Section */}
      <div className="author-papers-section">
        <div className="section-header">
          <h2 className="section-title">Papers ({papers.length})</h2>
          <div className="search-bar-container">
            <SearchBar 
              defaultValue=""
              placeholder="Search author's papers..."
            />
          </div>
        </div>

        {papers.length > 0 ? (
          <div className="papers-grid">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <div className="empty-state-title">No papers available</div>
            <div className="empty-state-text">
              This author hasn't published any papers yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthorPage() {
  return (
    <Suspense
      fallback={
        <div className="author-page">
          <div className="loading-container">
            <div className="loading-spinner" />
            <span className="loading-text">Loading...</span>
          </div>
        </div>
      }
    >
      <AuthorContent />
    </Suspense>
  );
}
