export default function Navbar({ activeTab, onTabChange, bookmarkCount }) {
  return (
    <nav style={{
      borderBottom: '1px solid #1e2a3a',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 14, 26, 0.92)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px', height: '28px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: '800',
          fontFamily: "'Syne', sans-serif",
          color: '#fff',
        }}>F</div>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: '700',
          fontSize: '16px',
          letterSpacing: '0.05em',
          color: '#f1f5f9',
        }}>FIRSTISSUE</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[
          { key: 'browse', label: 'Browse' },
          { key: 'saved', label: 'Saved', count: bookmarkCount },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              background: activeTab === tab.key ? '#1e2a3a' : 'transparent',
              border: activeTab === tab.key ? '1px solid #334155' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              color: activeTab === tab.key ? '#e2e8f0' : '#475569',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.color = '#94a3b8'
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.color = '#475569'
              }
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: '#fff',
                fontSize: '10px',
                padding: '1px 6px',
                borderRadius: '20px',
                fontWeight: '600',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}

        <div style={{ width: '1px', height: '20px', background: '#1e2a3a', margin: '0 6px' }} />

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px',
            color: '#64748b',
            textDecoration: 'none',
            fontFamily: "'JetBrains Mono', monospace",
            padding: '6px 12px',
            border: '1px solid #1e2a3a',
            borderRadius: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#94a3b8'
            e.currentTarget.style.borderColor = '#334155'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#64748b'
            e.currentTarget.style.borderColor = '#1e2a3a'
          }}
        >
          GitHub ↗
        </a>
      </div>
    </nav>
  )
}