'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Paper, ARXIV_CATEGORIES, formatCategory } from '@/lib/types';
import BookmarkButton from '@/components/BookmarkButton';
import CitationGraph from '@/components/CitationGraph';
import PaperCard from '@/components/PaperCard';

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
    <div className="page-minimal" id="paper-detail">
      {/* Back navigation */}
      <Link href="/papers" className="nav-link-minimal" style={{ marginBottom: '32px', display: 'inline-block' }}>
        ← Back to papers
      </Link>

      {/* Title */}
      <h1 className="section-title-minimal" style={{ fontSize: '42px', marginBottom: '32px' }}>{paper.title}</h1>

      {/* Authors */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '48px' }}>
        {paper.authors.map((author, i) => (
          <Link
            key={i}
            href={`/authors/${encodeURIComponent(author.name)}`}
            className="filter-chip-minimal"
          >
            {author.name}
            {author.affiliation && (
              <span style={{ color: '#444', marginLeft: '6px' }}>— {author.affiliation}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Metadata & Actions grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '60px', marginBottom: '60px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <h3 style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Abstract
            </h3>
            <div style={{ fontSize: '16px', lineHeight: '1.7', color: '#888' }}>
              {paper.abstract}
            </div>
          </div>
          
          {paper.comment && (
            <div>
              <h3 style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                Comment
              </h3>
              <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#666' }}>
                {paper.comment}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h3 style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#444' }}>Published</div>
                <div style={{ fontSize: '14px', color: '#fff' }}>{publishedDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#444' }}>arXiv ID</div>
                <div style={{ fontSize: '14px', color: '#fff', fontFamily: 'var(--font-mono)' }}>{paper.id}</div>
              </div>
              {paper.doi && (
                <div>
                  <div style={{ fontSize: '11px', color: '#444' }}>DOI</div>
                  <div style={{ fontSize: '14px', color: '#fff', fontFamily: 'var(--font-mono)' }}>{paper.doi}</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Categories
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {paper.categories.map((cat) => (
                <span key={cat} style={{ fontSize: '11px', color: '#666', border: '1px solid #222', padding: '2px 8px', borderRadius: '4px' }}>
                  {formatCategory(cat)}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <a
              href={paper.pdfUrl.startsWith('http') ? paper.pdfUrl : `https://arxiv.org/pdf/${paper.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="filter-chip-minimal"
              style={{ textAlign: 'center', background: '#fff', color: '#000' }}
            >
              Download PDF
            </a>
            <BookmarkButton paperId={paper.id} paperTitle={paper.title} />
          </div>
        </div>
      </div>

      {/* Citation Graph Section */}
      <div style={{ marginBottom: '80px', border: '1px solid #1a1a1a', borderRadius: '16px', overflow: 'hidden' }}>
        <CitationGraph paper={paper} />
      </div>

      {/* Related Papers */}
      {relatedPapers.length > 0 && (
        <div id="related-papers" style={{ borderTop: '1px solid #1a1a1a', paddingTop: '60px' }}>
          <h3 className="section-title-minimal" style={{ fontSize: '20px', marginBottom: '32px' }}>
            Related Discoveries
          </h3>
          <div className="papers-grid">
            {relatedPapers.map((rp) => (
              <PaperCard key={rp.id} paper={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
