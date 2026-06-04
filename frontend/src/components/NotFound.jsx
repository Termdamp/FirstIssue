export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{
        fontSize: '72px', fontWeight: '800',
        fontFamily: "'Syne', sans-serif",
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        marginBottom: '16px',
      }}>404</div>
      <p style={{ color: '#334155', fontSize: '13px', marginBottom: '24px' }}>
        page not found
      </p>
      <a href="/" style={{
        color: '#3b82f6',
        fontSize: '12px',
        textDecoration: 'none',
        border: '1px solid rgba(59,130,246,0.3)',
        padding: '8px 20px',
        borderRadius: '8px',
      }}>
        ← back to home
      </a>
    </div>
  )
}