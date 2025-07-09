import { useState } from 'react';
import Head from 'next/head';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);

    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.replace('#', '?')).get('access_token');

    if (!accessToken) {
      setError('Invalid or missing token.');
      return;
    }

    const res = await fetch('https://satybfotfjmvhzfbxdzj.supabase.co/auth/v1/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const result = await res.json();
      setError(result?.message || 'An error occurred.');
    }
  };

  return (
    <>
      <Head>
        <title>Reset Your Password – Plynk</title>
      </Head>
      <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          <h1 style={{ fontSize: 24, marginBottom: 20 }}>Reset Your Password</h1>
          {submitted ? (
            <p>Your password has been updated. You can now log in to Plynk.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 5, border: 'none' }}
              />
              <button
                type="submit"
                style={{ width: '100%', padding: 12, backgroundColor: '#7DA7C1', border: 'none', color: '#fff', borderRadius: 5 }}
              >
                Set New Password
              </button>
              {error && <p style={{ color: 'tomato', marginTop: 10 }}>{error}</p>}
            </form>
          )}
        </div>
      </div>
    </>
  );
}

