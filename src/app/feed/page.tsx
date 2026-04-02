'use client';

import { useState, useEffect, useCallback } from 'react';
import { Paper, ARXIV_CATEGORIES } from '@/lib/types';
import PaperCard from '@/components/PaperCard';

const ALL_CATEGORIES = Object.entries(ARXIV_CATEGORIES);

export default function FeedPage() {
  const [subscribedTopics, setSubscribedTopics] = useState<string[]>(['cs.AI', 'cs.LG']);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);

  const fetchFeed = useCallback(async () => {
    if (subscribedTopics.length === 0) return;

    setLoading(true);
    try {
      // Fetch papers from each subscribed topic
      const allPapers: Paper[] = [];
      for (const topic of subscribedTopics.slice(0, 5)) {
        const res = await fetch(`/api/arxiv?category=${topic}&maxResults=5&sortBy=submittedDate`);
        const data = await res.json();
        if (data.papers) {
          allPapers.push(...data.papers);
        }
      }

      // Deduplicate and sort by date
      const uniquePapers = allPapers.reduce((acc: Paper[], paper) => {
        if (!acc.find(p => p.id === paper.id)) {
          acc.push(paper);
        }
        return acc;
      }, []);

      uniquePapers.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
      setPapers(uniquePapers);
    } catch (error) {
      console.error('Feed error:', error);
    } finally {
      setLoading(false);
    }
  }, [subscribedTopics]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const toggleTopic = (code: string) => {
    setSubscribedTopics(prev =>
      prev.includes(code)
        ? prev.filter(t => t !== code)
        : [...prev, code]
    );
  };

  const displayedCategories = showAllTopics ? ALL_CATEGORIES : ALL_CATEGORIES.slice(0, 12);

  return (
    <div className="feed-page" id="feed-page">
      <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 className="section-title">Your Feed</h1>
        <p className="section-subtitle">Latest papers from your subscribed topics</p>
      </div>

      <div className="feed-layout">
        {/* Main Feed */}
        <div>
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner" />
              <span className="loading-text">Loading your feed...</span>
            </div>
          )}

          {!loading && papers.length > 0 && (
            <div className="papers-grid" id="feed-papers">
              {papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}

          {!loading && papers.length === 0 && subscribedTopics.length > 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📡</div>
              <div className="empty-state-title">No papers in your feed</div>
              <div className="empty-state-text">Papers from your subscribed topics will appear here</div>
            </div>
          )}

          {subscribedTopics.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <div className="empty-state-title">Subscribe to topics</div>
              <div className="empty-state-text">Select topics from the sidebar to build your personalized research feed</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="feed-sidebar">
          <div className="sidebar-card" id="subscriptions-sidebar">
            <div className="sidebar-card-title">
              📡 Your Subscriptions
            </div>
            <div className="topic-list">
              {subscribedTopics.map((code) => (
                <div key={code} className="topic-item">
                  <span className="topic-item-code">{code}</span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => toggleTopic(code)}
                    style={{ color: 'var(--danger)', padding: '2px 8px', fontSize: '0.75rem' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {subscribedTopics.length === 0 && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', padding: 'var(--space-sm)' }}>
                  No subscriptions yet
                </div>
              )}
            </div>
          </div>

          <div className="sidebar-card" id="topics-browser">
            <div className="sidebar-card-title">
              🏷️ Browse Topics
            </div>
            <div className="topic-list">
              {displayedCategories.map(([code, name]) => {
                const isSubscribed = subscribedTopics.includes(code);
                return (
                  <div
                    key={code}
                    className="topic-item"
                    onClick={() => toggleTopic(code)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <span className="topic-item-code">{code}</span>
                      <span className="topic-item-label" style={{ marginLeft: '8px' }}>{name}</span>
                    </div>
                    <span style={{
                      color: isSubscribed ? 'var(--success)' : 'var(--text-tertiary)',
                      fontSize: '0.875rem',
                    }}>
                      {isSubscribed ? '✓' : '+'}
                    </span>
                  </div>
                );
              })}
            </div>
            {!showAllTopics && ALL_CATEGORIES.length > 12 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowAllTopics(true)}
                style={{ width: '100%', marginTop: 'var(--space-sm)' }}
              >
                Show all {ALL_CATEGORIES.length} topics →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
