'use client';

import { useState } from 'react';

interface BookmarkButtonProps {
  paperId: string;
  paperTitle: string;
}

export default function BookmarkButton({ paperId, paperTitle }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    setIsBookmarked(!isBookmarked);

    // In production, this would call Supabase
    // For now, we use local state
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
      onClick={handleToggle}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark paper'}
      id={`bookmark-${paperId}`}
      style={{
        transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
        transition: 'all 200ms ease',
      }}
    >
      {isBookmarked ? '★' : '☆'}
    </button>
  );
}
