export default function SkeletonCard({ index = 0 }) {
  return (
    <div style={{
      background: 'rgba(12,12,24,0.7)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '18px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      animationDelay: `${index * 0.06}s`,
      backdropFilter: 'blur(12px)',
    }}>
      <div className="skeleton-line" style={{ height: '11px', width: '40%', borderRadius: '6px' }} />
      <div className="skeleton-line" style={{ height: '16px', width: '90%', borderRadius: '6px' }} />
      <div className="skeleton-line" style={{ height: '16px', width: '68%', borderRadius: '6px' }} />
      <div style={{ display: 'flex', gap: '7px', marginTop: '2px' }}>
        <div className="skeleton-line" style={{ height: '24px', width: '70px', borderRadius: '7px' }} />
        <div className="skeleton-line" style={{ height: '24px', width: '90px', borderRadius: '7px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="skeleton-line" style={{ height: '10px', width: '44px', borderRadius: '5px' }} />
        <div className="skeleton-line" style={{ height: '10px', width: '90px', borderRadius: '5px' }} />
      </div>
    </div>
  )
}
