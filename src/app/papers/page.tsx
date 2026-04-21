'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Paper, ARXIV_CATEGORIES, formatCategory } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import PaperCard from '@/components/PaperCard';

const FILTER_CATEGORIES = [
  'cs.AI', 'cs.LG', 'cs.CV', 'cs.CL', 'cs.NE', 'cs.SE', 'cs.CR', 'stat.ML',
];

function PapersContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const [papers, setPapers] = useState<Paper[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [activeCategory, setActiveCategory] = useState(category);

  const maxResults = 10;

  const fetchPapers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (activeCategory) params.set('category', activeCategory);
      params.set('start', String(page * maxResults));
      params.set('maxResults', String(maxResults));
      params.set('sortBy', sortBy);

      const res = await fetch(`/api/arxiv?${params.toString()}`);
      const data = await res.json();

      if (data.papers) {
        setPapers(data.papers);
        setTotalResults(data.totalResults || 0);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [query, activeCategory, page, sortBy]);

  useEffect(() => {
    if (query || activeCategory) {
      fetchPapers();
    }
  }, [fetchPapers, query, activeCategory]);

  const totalPages = Math.ceil(totalResults / maxResults);

  return (
    <div className="page-minimal" id="papers-page">
      <div className="page-header-minimal">
        <h1 className="section-title-minimal">
          {query ? `Results for "${query}"` : activeCategory ? `Papers in ${formatCategory(activeCategory, true)}` : 'Search Papers'}
        </h1>
        <p className="section-subtitle-minimal" style={{ marginBottom: '32px' }}>
          Search millions of arXiv papers across all research fields
        </p>
        <div style={{ maxWidth: '600px' }}>
          <SearchBar defaultValue={query} />
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }} id="category-filters">
        <button
          className={`filter-chip-minimal ${!activeCategory ? 'active' : ''}`}
          onClick={() => { setActiveCategory(''); setPage(0); }}
        >
          All
        </button>
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip-minimal ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => { setActiveCategory(cat); setPage(0); }}
          >
            {formatCategory(cat, true)}
          </button>
        ))}
      </div>

      {/* Results Info */}
      {(query || activeCategory) && !loading && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          <span>{totalResults.toLocaleString()} results found</span>
          <select
            className="sort-select"
            style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-medium)', borderRadius: '40px', padding: '4px 12px', outline: 'none' }}
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
            id="sort-select"
          >
            <option value="relevance">Relevance</option>
            <option value="submittedDate">Newest First</option>
            <option value="lastUpdatedDate">Recently Updated</option>
          </select>
        </div>
      )}

      {/* Results grid */}
      <div className="papers-grid" id="papers-list">
        {loading ? (
          <div className="loading-container" style={{ gridColumn: '1 / -1', padding: '100px 0' }}>
            <div className="loading-spinner" />
            <span className="loading-text">Searching arXiv...</span>
          </div>
        ) : papers.length > 0 ? (
          papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))
        ) : (query || activeCategory) && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No papers found</div>
            <div className="empty-state-text">Try adjusting your search terms or filters</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" id="pagination" style={{ marginTop: '60px', display: 'flex', justifyContent: 'center', gap: '32px' }}>
          <button
            className="filter-chip-minimal"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            ← Previous
          </button>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px', alignSelf: 'center' }}>
            Page {page + 1} of {Math.min(totalPages, 100)}
          </span>
          <button
            className="filter-chip-minimal"
            disabled={page >= totalPages - 1 || page >= 99}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default function PapersPage() {
  return (
    <Suspense
      fallback={
        <div className="search-page">
          <div className="loading-container">
            <div className="loading-spinner" />
            <span className="loading-text">Loading...</span>
          </div>
        </div>
      }
    >
      <PapersContent />
    </Suspense>
  );
}
