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
    <div className="page-minimal" id="feed-page">
      <div className="page-header-minimal">
        <h1 className="section-title-minimal">Research Feed</h1>
        <p className="section-subtitle-minimal">Your personalized streams from subscribed fields</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '60px' }}>
        {/* Main Feed */}
        <div>
          {loading ? (
            <div className="loading-container" style={{ padding: '100px 0' }}>
              <div className="loading-spinner" />
              <span className="loading-text">Collecting insights...</span>
            </div>
          ) : papers.length > 0 ? (
            <div className="papers-grid" id="feed-papers">
              {papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          ) : subscribedTopics.length > 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📡</div>
              <div className="empty-state-title">No new insights</div>
              <div className="empty-state-text">Your selected topics are quiet for now.</div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🎯</div>
              <div className="empty-state-title">Build Your Feed</div>
              <div className="empty-state-text">Select topics from the sidebar to curate your research stream.</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h3 style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Subscribed
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {subscribedTopics.map((code) => (
                <div key={code} className="filter-chip-minimal active" onClick={() => toggleTopic(code)}>
                  {code} <span style={{ marginLeft: '4px', opacity: 0.5 }}>✕</span>
                </div>
              ))}
              {subscribedTopics.length === 0 && (
                <div style={{ fontSize: '13px', color: '#444' }}>None</div>
              )}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Discover Topics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {displayedCategories.map(([code, name]) => {
                const isSubscribed = subscribedTopics.includes(code);
                return (
                  <div
                    key={code}
                    onClick={() => toggleTopic(code)}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      background: isSubscribed ? '#111' : 'transparent',
                      color: isSubscribed ? '#fff' : '#666',
                      fontSize: '13px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{name}</span>
                    <span style={{ fontSize: '10px', color: isSubscribed ? '#444' : '#333' }}>{code}</span>
                  </div>
                );
              })}
            </div>
            {!showAllTopics && ALL_CATEGORIES.length > 12 && (
              <button
                className="nav-link-minimal"
                onClick={() => setShowAllTopics(true)}
                style={{ marginTop: '16px', display: 'block', padding: '12px', textAlign: 'center', width: '100%', border: '1px solid #1a1a1a', borderRadius: '8px' }}
              >
                Expand all topics
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
