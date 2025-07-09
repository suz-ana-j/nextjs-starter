import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');
  const [password, setPassword] = useState('');
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.replace('#', '?')).get('access_token');
    if (token) setAccessToken(token);
  }, []);

  const handleReset = async () => {
    setResetting(true);
    setError('');
    try {
      const res = await fetch('https://satybfotfjmvhzfbxdzj.supabase.co/auth/v1/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdHliZm90Zmptdmh6ZmJ4ZHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTQ2MDgsImV4cCI6MjA2MjAzMDYwOH0.-N7bD7lHXp2SCqncCk1U4YytRZZLnJhVi68tM6dn0ZQ',
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || 'Reset failed');
      }

      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: 400, padding: 24 }}>
        {done ? (
          <h2>Password reset successful. You can now log in to your Plynk account.</h2>
        ) : (
          <>
            <h1 style={{ marginBottom: 16 }}>Reset Your Password</h1>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 4 }}
            />
            <button
              onClick={handleReset}
              disabled={resetting}
              style={{ padding: 10, width: '100%', backgroundColor: '#7DA7C1', color: 'white', border: 'none', borderRadius: 4 }}
            >
              {resetting ? 'Resetting...' : 'Set New Password'}
            </button>
            {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}

