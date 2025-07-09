import { useEffect, useState } from 'react';

export default function Home() {
  const [isRecovery, setIsRecovery] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get('type');
    const token = params.get('access_token');

    if (type === 'recovery' && token) {
      setIsRecovery(true);
      setAccessToken(token);
    }
  }, []);

  const handlePasswordReset = async () => {
    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    try {
      const res = await fetch('https://satybfotfjmvhzfbxdzj.supabase.co/auth/v1/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#fff',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      {!isRecovery && (
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉 Email Confirmed</h1>
          <p style={{ fontSize: '1.2rem' }}>
            Thank you for confirming your email.<br />
            You can now log in to your <strong>Plynk</strong> account!
          </p>
        </div>
      )}

      {isRecovery && !submitted && (
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐 Reset Your Password</h1>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              padding: '12px',
              width: '100%',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginBottom: '10px'
            }}
          />
          <button
            onClick={handlePasswordReset}
            style={{
              padding: '12px 20px',
              backgroundColor: '#7DA7C1',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
          {error && <p style={{ color: '#FF6B6B', marginTop: '10px' }}>{error}</p>}
        </div>
      )}

      {isRecovery && submitted && (
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>✅ Password Updated</h1>
          <p>You can now log in to your Plynk account with your new password.</p>
        </div>
      )}
    </div>
  );
}

