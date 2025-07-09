export default function Home() {
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
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎉 Email Confirmed</h1>
        <p style={{ fontSize: '1.2rem' }}>
          Thank you for confirming your email.<br />
          You can now log in to your <strong>Plynk</strong> account!
        </p>
      </div>
    </div>
  );
}

