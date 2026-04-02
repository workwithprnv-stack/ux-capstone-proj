import Link from 'next/link';
import Image from 'next/image';
import { Paper } from '@/lib/types';
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
    <div className="paper-card" id={`paper-card-${paper.id}`}>
      <div className="paper-card-header">
        <Link href={`/papers/${encodeURIComponent(paper.id)}`} className="paper-title" style={{ textDecoration: 'none' }}>
          {paper.title}
        </Link>
        <BookmarkButton paperId={paper.id} paperTitle={paper.title} />
      </div>

      <div className="paper-meta">
        <div className="paper-authors">
          {paper.authors.slice(0, 4).map((author, index) => (
            <div key={index} className="author-item">
              <Image
                src={author.email ? getGravatarUrl(author.email, 20) : getFallbackAvatarUrl(author.name, 20)}
                alt={author.name}
                width={20}
                height={20}
                className="author-avatar"
                unoptimized
              />
              <Link 
                href={`/authors/${encodeURIComponent(author.name)}`}
                className="author-name-link"
              >
                {author.name}
              </Link>
            </div>
          ))}
          {hasMore && (
            <span className="more-authors">+{paper.authors.length - 4} more</span>
          )}
        </div>
        <span style={{ color: 'var(--text-tertiary)' }}>·</span>
        <span className="paper-date">{formattedDate}</span>
      </div>

      <p className="paper-abstract">{paper.abstract}</p>

      <div className="paper-footer">
        <div className="paper-categories">
          {paper.categories.slice(0, 3).map((cat) => (
            <span key={cat} className="badge badge-category">{cat}</span>
          ))}
          {paper.categories.length > 3 && (
            <span className="badge badge-category">+{paper.categories.length - 3}</span>
          )}
        </div>
        <div className="paper-actions">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            onClick={(e) => e.stopPropagation()}
          >
            📄 PDF
          </a>
          <Link
            href={`/papers/${encodeURIComponent(paper.id)}`}
            className="btn btn-ghost btn-sm"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
