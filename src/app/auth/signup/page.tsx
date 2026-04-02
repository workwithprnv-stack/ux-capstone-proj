'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In production, this would call Supabase auth
    // const { error } = await supabase.auth.signUp({
    //   email, password,
    //   options: { data: { full_name: fullName, username: email.split('@')[0] } }
    // })
    setTimeout(() => {
      setLoading(false);
      setError('Connect Supabase to enable authentication. See .env.local for setup.');
    }, 1000);
  };

  return (
    <div className="auth-page" id="signup-page">
      <div className="auth-card">
        <Link href="/" className="navbar-brand" style={{ justifyContent: 'center', marginBottom: 'var(--space-2xl)' }}>
          <span className="navbar-brand-icon">🔬</span>
          ResearchHub
        </Link>

        <h1 className="auth-card-title">Create account</h1>
        <p className="auth-card-subtitle">Start your research collaboration journey</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              className="form-input"
              placeholder="Dr. Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              className="form-input"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <div className="form-hint">At least 6 characters</div>
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: 'var(--space-xl)',
          fontSize: '0.875rem',
          color: 'var(--text-tertiary)',
        }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
