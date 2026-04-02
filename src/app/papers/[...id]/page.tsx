'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Paper, ARXIV_CATEGORIES } from '@/lib/types';
import BookmarkButton from '@/components/BookmarkButton';
import CitationGraph from '@/components/CitationGraph';

export default function PaperDetailPage() {
  const params = useParams();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPapers, setRelatedPapers] = useState<Paper[]>([]);

  useEffect(() => {
    async function fetchPaper() {
      if (!params.id) return;

      setLoading(true);
      try {
        const id = Array.isArray(params.id)
          ? params.id.join('/')
          : params.id;
        const decodedId = decodeURIComponent(id);
        const res = await fetch(`/api/arxiv?id=${encodeURIComponent(decodedId)}`);
        const data = await res.json();

        if (data.paper) {
          setPaper(data.paper);

          // Fetch related papers by first category
          if (data.paper.categories.length > 0) {
            const relRes = await fetch(`/api/arxiv?category=${data.paper.categories[0]}&maxResults=5&sortBy=submittedDate`);
            const relData = await relRes.json();
            if (relData.papers) {
              setRelatedPapers(relData.papers.filter((p: Paper) => p.id !== data.paper.id).slice(0, 4));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching paper:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPaper();
  }, [params.id]);

  if (loading) {
    return (
      <div className="paper-detail">
        <div className="loading-container">
          <div className="loading-spinner" />
          <span className="loading-text">Loading paper...</span>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="paper-detail">
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <div className="empty-state-title">Paper not found</div>
          <div className="empty-state-text">The requested paper could not be found on arXiv.</div>
          <Link href="/papers" className="btn btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const publishedDate = new Date(paper.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedDate = new Date(paper.updated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="paper-detail" id="paper-detail">
      {/* Back navigation */}
      <Link href="/papers" className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-xl)' }}>
        ← Back to papers
      </Link>

      {/* Title */}
      <h1 className="paper-detail-title" id="paper-title">{paper.title}</h1>

      {/* Authors */}
      <div className="paper-detail-authors" id="paper-authors">
        {paper.authors.map((author, i) => (
          <Link
            key={i}
            href={`/authors/${encodeURIComponent(author.name)}`}
            className="author-tag"
          >
            👤 {author.name}
            {author.affiliation && (
              <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                ({author.affiliation})
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="paper-detail-actions" id="paper-actions">
        <a
          href={paper.pdfUrl.startsWith('http') ? paper.pdfUrl : `https://arxiv.org/pdf/${paper.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          📄 PDF
        </a>
        <a
          href={paper.abstractUrl.startsWith('http') ? paper.abstractUrl : `https://arxiv.org/abs/${paper.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
        >
          🔗 arXiv Page
        </a>
        <BookmarkButton paperId={paper.id} paperTitle={paper.title} />
      </div>

      {/* Metadata */}
      <div className="paper-detail-meta" id="paper-meta">
        <div className="meta-item">
          <div className="meta-label">Published</div>
          <div className="meta-value">{publishedDate}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">Last Updated</div>
          <div className="meta-value">{updatedDate}</div>
        </div>
        <div className="meta-item">
          <div className="meta-label">arXiv ID</div>
          <div className="meta-value" style={{ fontFamily: 'var(--font-mono)' }}>{paper.id}</div>
        </div>
        {paper.doi && (
          <div className="meta-item">
            <div className="meta-label">DOI</div>
            <div className="meta-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>{paper.doi}</div>
          </div>
        )}
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-sm)' }}>
          Categories
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          {paper.categories.map((cat) => (
            <Link
              key={cat}
              href={`/papers?category=${cat}`}
              className="badge badge-category"
              style={{ textDecoration: 'none', padding: '4px 12px', fontSize: '0.8125rem' }}
            >
              {cat} {ARXIV_CATEGORIES[cat] ? `— ${ARXIV_CATEGORIES[cat]}` : ''}
            </Link>
          ))}
        </div>
      </div>

      {/* Citation Graph */}
      <CitationGraph paper={paper} />

      {/* Abstract */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-sm)' }}>
          Abstract
        </h3>
        <div className="paper-detail-abstract" id="paper-abstract">
          {paper.abstract}
        </div>
      </div>

      {/* Comment */}
      {paper.comment && (
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-sm)' }}>
            Comments
          </h3>
          <div className="paper-detail-abstract" style={{ fontStyle: 'italic' }}>
            {paper.comment}
          </div>
        </div>
      )}

      {/* Related Papers */}
      {relatedPapers.length > 0 && (
        <div id="related-papers">
          <h3 className="section-title" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)' }}>
            Related Papers
          </h3>
          <div className="papers-grid">
            {relatedPapers.map((rp) => (
              <Link
                key={rp.id}
                href={`/papers/${encodeURIComponent(rp.id)}`}
                className="paper-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="paper-title" style={{ marginBottom: 'var(--space-sm)' }}>{rp.title}</div>
                <div className="paper-authors" style={{ fontSize: '0.8125rem' }}>
                  {rp.authors.slice(0, 3).map(a => a.name).join(', ')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
