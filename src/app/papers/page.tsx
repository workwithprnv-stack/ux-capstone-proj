'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Paper, ARXIV_CATEGORIES } from '@/lib/types';
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
    <div className="search-page" id="papers-page">
      <div className="search-page-header">
        <h1 className="section-title">
          {query ? `Results for "${query}"` : activeCategory ? `Papers in ${ARXIV_CATEGORIES[activeCategory] || activeCategory}` : 'Search Papers'}
        </h1>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-xl)' }}>
          Search millions of arXiv papers across all research fields
        </p>
        <SearchBar defaultValue={query} />
      </div>

      {/* Category Filters */}
      <div className="search-filters" id="category-filters">
        <button
          className={`filter-chip ${!activeCategory ? 'active' : ''}`}
          onClick={() => { setActiveCategory(''); setPage(0); }}
        >
          All
        </button>
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => { setActiveCategory(cat); setPage(0); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Info */}
      {(query || activeCategory) && !loading && (
        <div className="search-results-info">
          <span>{totalResults.toLocaleString()} results found</span>
          <select
            className="sort-select"
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

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner" />
          <span className="loading-text">Searching arXiv...</span>
        </div>
      )}

      {/* Results */}
      {!loading && papers.length > 0 && (
        <div className="papers-grid" id="papers-list">
          {papers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && papers.length === 0 && (query || activeCategory) && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No papers found</div>
          <div className="empty-state-text">Try adjusting your search terms or filters</div>
        </div>
      )}

      {/* Initial State */}
      {!loading && papers.length === 0 && !query && !activeCategory && (
        <div className="empty-state">
          <div className="empty-state-icon">🔬</div>
          <div className="empty-state-title">Start Exploring</div>
          <div className="empty-state-text">Search for a topic or select a category above to discover papers</div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" id="pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            ← Previous
          </button>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', alignSelf: 'center' }}>
            Page {page + 1} of {Math.min(totalPages, 100)}
          </span>
          <button
            className="btn btn-secondary btn-sm"
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
