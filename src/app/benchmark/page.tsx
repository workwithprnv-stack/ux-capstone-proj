'use client';

import { useState, useEffect } from 'react';
import type { BenchmarkResult } from '@/lib/benchmark';

export default function BenchmarkPage() {
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [running, setRunning] = useState(false);

  const startBenchmarks = async () => {
    setRunning(true);
    setResults([]);
    try {
      const res = await fetch('/api/benchmark');
      if (!res.ok) throw new Error('Benchmark failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Benchmark error:', error);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="benchmark-page" style={{ padding: 'var(--space-2xl) 0' }}>
      <div className="page-header" style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 className="page-title">Performance Benchmarking</h1>
        <p className="page-subtitle">Measuring arXiv API integration efficiency</p>
        
        <button 
          className="btn btn-primary" 
          onClick={startBenchmarks}
          disabled={running}
          style={{ marginTop: 'var(--space-lg)' }}
        >
          {running ? 'Running Benchmarks...' : 'Run Performance Test'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="benchmark-results">
          <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--surface-raised)', borderRadius: 'var(--radius-lg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: 'var(--space-md)', color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Operation</th>
                  <th style={{ padding: 'var(--space-md)', color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Target/Query</th>
                  <th style={{ padding: 'var(--space-md)', color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: 'var(--space-md)', color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Time (ms)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--space-md)', fontWeight: '500' }}>{result.name}</td>
                    <td style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{result.query}</td>
                    <td style={{ padding: 'var(--space-md)' }}>
                      {result.error ? (
                        <span style={{ color: 'var(--status-error)', fontSize: '0.75rem' }}>Error: {result.error}</span>
                      ) : (
                        <span style={{ color: 'var(--status-success)', fontSize: '0.75rem' }}>Success ({result.results} results)</span>
                      )}
                    </td>
                    <td style={{ padding: 'var(--space-md)', textAlign: 'right', fontFamily: 'var(--font-mono)', color: result.time > 1000 ? 'var(--status-warning)' : 'var(--text-primary)' }}>
                      {result.time.toFixed(2)}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: 'var(--space-xl)', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            <p>Note: Fetch times include network latency to the arXiv API. Parsing times are negligible for XML responses of this size.</p>
          </div>
        </div>
      )}

      {running && (
        <div className="loading-container" style={{ padding: 'var(--space-2xl) 0' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: 'var(--space-md)', color: 'var(--text-secondary)' }}>Benchmarking arXiv API...</p>
        </div>
      )}
    </div>
  );
}
