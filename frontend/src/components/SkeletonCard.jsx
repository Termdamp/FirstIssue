export default function SkeletonCard() {
  return (
    <div style={{
      background: '#0f1623',
      border: '1px solid #1e2a3a',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ height: '11px', background: '#1e2a3a', borderRadius: '4px', width: '40%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '15px', background: '#1e2a3a', borderRadius: '4px', width: '90%', animation: 'pulse 1.5s ease-in-out infinite 0.1s' }} />
      <div style={{ height: '15px', background: '#1e2a3a', borderRadius: '4px', width: '70%', animation: 'pulse 1.5s ease-in-out infinite 0.2s' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <div style={{ height: '22px', background: '#1e2a3a', borderRadius: '20px', width: '70px', animation: 'pulse 1.5s ease-in-out infinite 0.3s' }} />
        <div style={{ height: '22px', background: '#1e2a3a', borderRadius: '20px', width: '90px', animation: 'pulse 1.5s ease-in-out infinite 0.4s' }} />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}