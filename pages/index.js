import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_PUBLIC_ANON_KEY'
);

export default function Home() {
  const [mode, setMode] = useState('confirm'); // 'confirm' or 'recovery'
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const type = params.get('type');
    const access_token = params.get('access_token');

    if (type === 'recovery' && access_token) {
      setMode('recovery');
      setToken(access_token);
    }
  }, []);

  const handleReset = async () => {
    setStatus('Resetting password...');
    try {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '', // not needed for password reset
      });

      if (sessionError) {
        console.error('Session error:', sessionError);
        setStatus('Failed to authenticate session.');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Password reset error:', error);
        setStatus('Password reset failed: ' + error.message);
      } else {
        setStatus('✅ Password updated! You can now log in to your Plynk account.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setStatus('Something went wrong.');
    }
  };

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: 20
    }}>
      {mode === 'recovery' ? (
        <>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>Reset Your Password</h1>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={{
              padding: 10,
              fontSize: 16,
              borderRadius: 8,
              marginBottom: 12,
              width: 280,
            }}
          />
          <button onClick={handleReset} style={{
            padding: '10px 20px',
            fontSize: 16,
            backgroundColor: '#7DA7C1',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            color: '#fff',
          }}>
            Submit
          </button>
          <p style={{ marginTop: 20 }}>{status}</p>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>Thank you for confirming your email.</h1>
          <p style={{ fontSize: 18 }}>You can now log in to your Plynk account.</p>
        </>
      )}
    </div>
  );
}
