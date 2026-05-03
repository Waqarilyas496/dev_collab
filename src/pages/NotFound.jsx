export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#070d1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ fontSize: '64px' }}>🔍</div>
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#f8fafc',
      }}>
        Page Not Found
      </div>
      <div style={{ fontSize: '14px', color: '#475569' }}>
        This page does not exist.
      </div>
      <a href="/dashboard" style={{
        padding: '10px 24px',
        background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        borderRadius: '10px',
        color: 'white',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '600',
      }}>
        Go to Dashboard
      </a>
    </div>
  );
}