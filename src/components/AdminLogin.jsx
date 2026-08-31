// Minimal single-admin login gate. RLS policies require an authenticated
// session (security.md #1) — this is the simplest form of that: one
// admin account, created once in the Supabase dashboard
// (Authentication -> Add user), signed in here.
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin({ onSignedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError('Couldn\u2019t sign in \u2014 check your email and password and try again.');
    else onSignedIn(data.session);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form className="card" style={{ maxWidth: 380, width: '100%' }} onSubmit={handleSubmit}>
        <h2>Riyasat Swat — Admin Sign In</h2>
        {error && <div className="banner banner-error">{error}</div>}
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
