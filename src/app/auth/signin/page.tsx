'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In production, this would call Supabase auth
    // const { error } = await supabase.auth.signInWithPassword({ email, password })
    setTimeout(() => {
      setLoading(false);
      setError('Connect Supabase to enable authentication. See .env.local for setup.');
    }, 1000);
  };

  return (
    <div className="auth-page" id="signin-page">
      <div className="auth-card">
        <Link href="/" className="navbar-brand" style={{ justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
          <span className="navbar-brand-icon">🔬</span>
          ResearchHub
        </Link>

        <h1 className="auth-card-title">Welcome back</h1>
        <p className="auth-card-subtitle">Sign in to your research account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              className="form-input"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: 'var(--space-sm) var(--space-md)',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--warning)',
              fontSize: '0.8125rem',
              marginBottom: 'var(--space-lg)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: 'var(--space-xl)',
          fontSize: '0.875rem',
          color: 'var(--text-tertiary)',
        }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
