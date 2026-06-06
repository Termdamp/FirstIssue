import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"

export default function Navbar({ activeTab, onTabChange, bookmarkCount, user, onLogin, onLogout }) {
  const [scrolled, setScrolled] = useState(false)
  const { authLoading } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      borderBottom: scrolled ? '1px solid rgba(30,90,180,0.18)' : '1px solid transparent',
      padding: '0 1.5rem',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: scrolled ? 'rgba(4,6,20,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
      transition: 'all 0.35s ease',
      boxShadow: scrolled ? '0 4px 40px rgba(0,60,180,0.15)' : 'none',
    }}>
      {/* Logo */}
      <button
        onClick={() => onTabChange('browse')}
        style={{
          display: 'flex', alignItems: 'center', gap: '11px',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <div style={{
          width: '34px', height: '34px',
          background: 'linear-gradient(160deg, #1877f2 0%, #0d6efd 60%, #06b6d4 100%)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          boxShadow: '0 0 22px rgba(24,119,242,0.55), 0 0 0 1px rgba(6,182,212,0.25)',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'rgba(255,255,255,0.08)', borderRadius: '10px 10px 0 0' }} />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: '800',
            fontSize: '20px',
            color: '#fff',
            letterSpacing: '-0.05em',
            lineHeight: 1,
            zIndex: 1,
            textShadow: '0 1px 4px rgba(0,0,50,0.3)',
          }}>F</span>
        </div>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: '700', fontSize: '15px',
          letterSpacing: '-0.03em', color: '#f0f0f8',
        }}>FirstIssue</span>
      </button>

      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(13,80,220,0.25) 0%, rgba(6,182,212,0.18) 50%, rgba(13,80,220,0.22) 100%)',
          border: '1px solid rgba(13,110,253,0.35)',
          borderRadius: '16px',
          padding: '5px 6px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 30px rgba(13,110,253,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: '3px',
        }}>
          {[
            { key: 'browse', label: 'Browse', icon: '⊞' },
            { key: 'saved',  label: 'Saved',  icon: '◇', count: bookmarkCount },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              style={{
                background: activeTab === tab.key
                  ? 'linear-gradient(135deg, rgba(13,80,220,0.5), rgba(6,182,212,0.35))'
                  : 'transparent',
                border: activeTab === tab.key
                  ? '1px solid rgba(6,182,212,0.45)'
                  : '1px solid transparent',
                color: activeTab === tab.key ? '#e0f2fe' : 'rgba(180,210,255,0.65)',
                padding: '7px 18px',
                borderRadius: '11px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '13px', fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '6px',
                letterSpacing: '-0.01em',
                boxShadow: activeTab === tab.key ? '0 0 16px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
              }}
              onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
              onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = 'rgba(180,210,255,0.65)' }}
            >
              <span style={{ fontSize: '11px', opacity: 0.7 }}>{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  color: '#1a1000',
                  fontSize: '9px', padding: '2px 6px',
                  borderRadius: '99px', fontWeight: '800',
                  lineHeight: '1.5',
                  boxShadow: '0 0 10px rgba(245,158,11,0.6)',
                }} className="pulse-badge">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a
          href="https://github.com/Termdamp/FirstIssue"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '12px', color: 'rgba(180,210,255,0.45)', textDecoration: 'none',
            fontFamily: "'JetBrains Mono', monospace",
            padding: '7px 12px',
            border: '1px solid rgba(13,110,253,0.18)', borderRadius: '9px',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'rgba(13,110,253,0.05)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'; e.currentTarget.style.background = 'rgba(13,110,253,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(180,210,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(13,110,253,0.18)'; e.currentTarget.style.background = 'rgba(13,110,253,0.05)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub ↗
        </a>

        <div style={{ width: '1px', height: '20px', background: 'rgba(13,110,253,0.2)' }} />

        {!authLoading && (
          user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <button
                onClick={() => onTabChange('profile')}
                title="View profile"
                style={{
                  background: 'none', padding: 0, cursor: 'pointer',
                  borderRadius: '50%', overflow: 'hidden',
                  width: '36px', height: '36px', flexShrink: 0,
                  border: activeTab === 'profile'
                    ? '2px solid rgba(6,182,212,0.7)'
                    : '2px solid rgba(13,110,253,0.3)',
                  transition: 'border-color 0.2s',
                  boxShadow: activeTab === 'profile' ? '0 0 16px rgba(6,182,212,0.5)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = activeTab === 'profile' ? 'rgba(6,182,212,0.7)' : 'rgba(13,110,253,0.3)'}
              >
                <img
                  src={user.chosenAvatar?.seed
                    ? `https://api.dicebear.com/7.x/${user.chosenAvatar.style}/svg?seed=${user.chosenAvatar.seed}`
                    : user.githubAvatar}
                  alt={user.username}
                  style={{ width: '100%', height: '100%', display: 'block', borderRadius: '50%' }}
                />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              style={{
                padding: '9px 18px', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'linear-gradient(135deg, #0d50dc 0%, #0d6efd 50%, #06b6d4 100%)',
                border: '1px solid rgba(6,182,212,0.4)',
                borderRadius: '10px',
                color: '#fff', cursor: 'pointer',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: '600', letterSpacing: '-0.01em',
                boxShadow: '0 0 20px rgba(13,110,253,0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(6,182,212,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(13,110,253,0.4)'; e.currentTarget.style.transform = 'none'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              Sign in with GitHub
            </button>
          )
        )}
      </div>
    </nav>
  )
}
