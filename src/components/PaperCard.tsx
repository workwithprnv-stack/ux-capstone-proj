import Link from 'next/link';
import Image from 'next/image';
import { Paper, formatCategory } from '@/lib/types';
import BookmarkButton from './BookmarkButton';
import { getGravatarUrl, getFallbackAvatarUrl } from '@/lib/gravatar';

interface PaperCardProps {
  paper: Paper;
}

export default function PaperCard({ paper }: PaperCardProps) {
  const formattedDate = new Date(paper.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const hasMore = paper.authors.length > 4;

  return (
    <div className="paper-card-minimal" id={`paper-card-${paper.id}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <Link href={`/papers/${encodeURIComponent(paper.id)}`} className="paper-title-minimal">
          {paper.title}
        </Link>
        <BookmarkButton paperId={paper.id} paperTitle={paper.title} />
      </div>

      <div className="paper-meta-minimal">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {paper.authors.slice(0, 2).map((author, index) => (
            <Link 
              key={index}
              href={`/authors/${encodeURIComponent(author.name)}`}
              style={{ color: '#888', textDecoration: 'none' }}
            >
              {author.name}{index < Math.min(paper.authors.length, 2) - 1 ? ',' : ''}
            </Link>
          ))}
          {paper.authors.length > 2 && (
            <span style={{ color: '#444' }}>et al.</span>
          )}
        </div>
        <span style={{ color: '#333' }}>·</span>
        <span style={{ color: '#666' }}>{formattedDate}</span>
      </div>

      <p className="paper-abstract-minimal">{paper.abstract}</p>

      <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {paper.categories.slice(0, 2).map((cat) => (
            <span key={cat} style={{ fontSize: '11px', color: '#666', border: '1px solid #222', padding: '2px 8px', borderRadius: '4px' }}>
              {formatCategory(cat)}
            </span>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', fontSize: '13px', textDecoration: 'none', borderBottom: '1px solid #333' }}
            onClick={(e) => e.stopPropagation()}
          >
            PDF
          </a>
          <Link
            href={`/papers/${encodeURIComponent(paper.id)}`}
            style={{ color: '#fff', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}
          >
            Open ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
