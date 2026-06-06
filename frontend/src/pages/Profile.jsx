import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth.jsx"
import { fetchContributions } from "../services/github"

const BADGE_META = {
  first_look:     { icon: "👀", label: "First Look",     desc: "Viewed your first issue",  color: "#818cf8", glow: "rgba(129,140,248,0.35)" },
  explorer:       { icon: "🧭", label: "Explorer",       desc: "Viewed 5 issues",           color: "#8b5cf6", glow: "rgba(139,92,246,0.35)" },
  curious:        { icon: "🔍", label: "Curious",        desc: "Viewed 10 issues",          color: "#06b6d4", glow: "rgba(6,182,212,0.35)" },
  contributor:    { icon: "⚡", label: "Contributor",    desc: "Viewed 25 issues",          color: "#f59e0b", glow: "rgba(245,158,11,0.35)" },
  dedicated:      { icon: "🔥", label: "Dedicated",      desc: "Viewed 50 issues",          color: "#ef4444", glow: "rgba(239,68,68,0.35)" },
  open_sourcerer: { icon: "🧙", label: "Open Sourcerer", desc: "Viewed 100 issues",         color: "#4ade80", glow: "rgba(74,222,128,0.35)" },
}
const ALL_BADGES = Object.keys(BADGE_META)

const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", Java: "#b07219", "C++": "#f34b7d", Ruby: "#701516",
}

export default function Profile({ onBack, onEditAvatar }) {
  const { user, logout } = useAuth()
  const [contributions, setContributions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const [hoveredBadge, setHoveredBadge] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("fi_token")
    if (!token) { setLoading(false); return }
    fetchContributions(token)
      .then(data => { setContributions(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (!user) return null

  const avatarUrl = user.chosenAvatar?.seed
    ? `https://api.dicebear.com/7.x/${user.chosenAvatar.style}/svg?seed=${user.chosenAvatar.seed}`
    : user.githubAvatar

  const earnedBadges = user.badges || []

  const languageMap = {}
  contributions.forEach(c => {
    if (c.language) languageMap[c.language] = (languageMap[c.language] || 0) + 1
  })
  const topLanguages = Object.entries(languageMap).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px 80px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Back */}
      <button onClick={onBack} className="btn-back profile-enter" style={{ marginBottom: '28px' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to feed
      </button>

      {/* Profile card */}
      <div className="profile-enter-delay-1" style={{
        background: 'rgba(12,12,24,0.8)',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: '24px',
        padding: '32px 36px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 0 1px rgba(124,58,237,0.1), 0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* top line glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(6,182,212,0.4), transparent)',
        }} />
        {/* bg orb */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap', position: 'relative' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '88px', height: '88px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              padding: '2px',
              boxShadow: '0 0 30px rgba(124,58,237,0.4)',
            }}>
              <img
                src={avatarUrl} alt={user.username}
                style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block', background: '#060610' }}
              />
            </div>

            {/* earned badges on avatar */}
            {earnedBadges.length > 0 && (
              <div style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                display: 'flex', gap: '2px',
              }}>
                {earnedBadges.slice(0, 3).map(b => (
                  <div key={b} title={BADGE_META[b]?.label} style={{
                    width: '22px', height: '22px',
                    background: 'rgba(12,12,24,0.95)',
                    border: `1px solid ${BADGE_META[b]?.color}55`,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px',
                    boxShadow: `0 0 8px ${BADGE_META[b]?.glow}`,
                  }}>{BADGE_META[b]?.icon}</div>
                ))}
              </div>
            )}

            <button
              onClick={onEditAvatar}
              title="Edit avatar"
              style={{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '26px', height: '26px',
                background: 'rgba(12,12,24,0.9)', border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '50%', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: '#a78bfa',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(124,58,237,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(12,12,24,0.9)'; e.currentTarget.style.boxShadow = 'none'; }}
            >✎</button>
          </div>

          {/* Name + stats */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '24px', fontWeight: '700',
              color: '#f0f0f8', marginBottom: '3px',
              letterSpacing: '-0.03em',
            }}>{user.displayName || user.username}</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px', color: '#7c6af0', marginBottom: '20px',
            }}>@{user.username}</div>

            <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
              {[
                { label: 'Issues viewed', value: contributions.length },
                { label: 'Badges earned', value: earnedBadges.length },
                { label: 'Languages', value: topLanguages.length },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '26px', fontWeight: '700',
                    color: '#f0f0f8', letterSpacing: '-0.04em',
                    background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>{stat.value}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px', color: 'rgba(255,255,255,0.25)',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => { logout(); onBack(); }}
            style={{
              flexShrink: 0, alignSelf: 'flex-start',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '11px',
              padding: '10px 16px',
              color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
              fontSize: '12px',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '6px',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="profile-enter-delay-2" style={{
        display: 'flex', gap: '3px', marginBottom: '20px',
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '13px', padding: '4px', width: 'fit-content',
        backdropFilter: 'blur(10px)',
      }}>
        {['overview', 'badges', 'history'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              background: activeSection === section ? 'rgba(124,58,237,0.15)' : 'transparent',
              border: activeSection === section ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
              color: activeSection === section ? '#c4b5fd' : 'rgba(255,255,255,0.3)',
              padding: '8px 20px', borderRadius: '9px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s',
              textTransform: 'capitalize', letterSpacing: '-0.01em',
              boxShadow: activeSection === section ? '0 0 16px rgba(124,58,237,0.15)' : 'none',
            }}
            onMouseEnter={e => { if (activeSection !== section) e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            onMouseLeave={e => { if (activeSection !== section) e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
          >{section}</button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeSection === "overview" && (
        <div className="profile-enter-delay-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Top languages */}
          <div style={{
            background: 'rgba(12,12,24,0.7)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '18px', padding: '24px', backdropFilter: 'blur(12px)',
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px', color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>Top Languages</div>
            {topLanguages.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>
                No data yet — view some issues!
              </p>
            ) : topLanguages.map(([lang, count]) => (
              <div key={lang} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: '500' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: LANGUAGE_COLORS[lang] || '#777', flexShrink: 0, boxShadow: `0 0 8px ${LANGUAGE_COLORS[lang] || '#777'}80` }} />
                    {lang}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>{count}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                  <div style={{
                    height: '100%',
                    width: `${(count / contributions.length) * 100}%`,
                    background: `linear-gradient(90deg, ${LANGUAGE_COLORS[lang] || '#7c3aed'}, ${LANGUAGE_COLORS[lang] || '#7c3aed'}88)`,
                    borderRadius: '2px',
                    boxShadow: `0 0 8px ${LANGUAGE_COLORS[lang] || '#7c3aed'}60`,
                    transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent badges */}
          <div style={{
            background: 'rgba(12,12,24,0.7)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '18px', padding: '24px', backdropFilter: 'blur(12px)',
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px', color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>Recent Badges</div>
            {earnedBadges.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>
                View issues to earn badges
              </p>
            ) : earnedBadges.slice(0, 3).map(badge => {
              const meta = BADGE_META[badge]
              if (!meta) return null
              return (
                <div key={badge} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginBottom: '12px', padding: '10px 14px',
                  background: `${meta.color}08`,
                  borderRadius: '12px',
                  border: `1px solid ${meta.color}22`,
                  boxShadow: `0 0 16px ${meta.glow}20`,
                }}>
                  <span style={{ fontSize: '24px', lineHeight: 1 }}>{meta.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', color: meta.color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: '600' }}>{meta.label}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{meta.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Badges ── */}
      {activeSection === "badges" && (
        <div className="profile-enter-delay-3">
          {/* earned count banner */}
          <div style={{
            marginBottom: '20px', padding: '14px 20px',
            background: 'rgba(124,58,237,0.06)', borderRadius: '12px',
            border: '1px solid rgba(124,58,237,0.15)',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px', color: 'rgba(255,255,255,0.6)',
          }}>
            <span style={{ color: '#a78bfa', fontWeight: '700' }}>{earnedBadges.length}</span> of <span style={{ color: '#a78bfa', fontWeight: '700' }}>{ALL_BADGES.length}</span> badges earned
            <span style={{ float: 'right', fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>hover to see all</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '12px',
          }}>
            {ALL_BADGES.map((badge, i) => {
              const meta = BADGE_META[badge]
              const earned = earnedBadges.includes(badge)
              const isHovered = hoveredBadge === badge
              return (
                <div
                  key={badge}
                  className={`badge-card ${earned ? 'earned' : ''}`}
                  onMouseEnter={() => setHoveredBadge(badge)}
                  onMouseLeave={() => setHoveredBadge(null)}
                  style={{
                    background: earned
                      ? `radial-gradient(circle at top left, ${meta.color}12 0%, rgba(12,12,24,0.9) 60%)`
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${earned ? meta.color + '30' : 'rgba(255,255,255,0.05)'}`,
                    opacity: earned ? 1 : 0.45,
                    animationDelay: `${i * 0.04}s`,
                    transform: (earned && isHovered) ? 'translateY(-5px) scale(1.02)' : 'none',
                    boxShadow: (earned && isHovered) ? `0 12px 40px ${meta.glow}, 0 0 0 1px ${meta.color}40` : 'none',
                    backdropFilter: 'blur(12px)',
                    transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, opacity 0.2s',
                  }}
                >
                  <span
                    className="badge-icon"
                    style={{
                      fontSize: '36px', lineHeight: 1, marginBottom: '14px', display: 'block',
                      transform: (earned && isHovered) ? 'scale(1.25) rotate(-5deg)' : 'none',
                      transition: 'transform 0.3s ease',
                      filter: (earned && isHovered) ? `drop-shadow(0 0 12px ${meta.color})` : 'none',
                    }}
                  >{meta.icon}</span>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', fontWeight: '700',
                    color: earned ? meta.color : 'rgba(255,255,255,0.2)',
                    marginBottom: '5px', letterSpacing: '-0.01em',
                  }}>{meta.label}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                    color: earned ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                    marginBottom: earned ? '14px' : 0,
                  }}>{meta.desc}</div>
                  {earned && (
                    <span style={{
                      fontSize: '10px', fontFamily: "'JetBrains Mono', monospace",
                      color: meta.color,
                      background: meta.color + '18',
                      border: `1px solid ${meta.color}35`,
                      padding: '3px 10px', borderRadius: '20px', display: 'inline-block',
                      letterSpacing: '0.04em',
                    }}>✓ earned</span>
                  )}
                  {!earned && (
                    <span style={{
                      fontSize: '10px', fontFamily: "'JetBrains Mono', monospace",
                      color: 'rgba(255,255,255,0.2)',
                      padding: '3px 0', display: 'inline-block',
                    }}>locked</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── History ── */}
      {activeSection === "history" && (
        <div className="profile-enter-delay-3" style={{
          background: 'rgba(12,12,24,0.7)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '18px', overflow: 'hidden', backdropFilter: 'blur(12px)',
        }}>
          {loading ? (
            <div style={{ padding: '52px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
              loading history…
            </div>
          ) : contributions.length === 0 ? (
            <div style={{ padding: '52px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
              No contributions yet — start exploring issues
            </div>
          ) : contributions.map((c, i) => (
            <div
              key={c._id}
              style={{
                padding: '16px 24px',
                borderBottom: i < contributions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: '14px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: '500',
                  color: 'rgba(255,255,255,0.7)', marginBottom: '3px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                }}>{c.issueTitle}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7c6af0' }}>{c.repoName}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px', flexShrink: 0 }}>
                {c.language && (
                  <span style={{
                    fontSize: '10px', padding: '2px 9px', borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{c.language}</span>
                )}
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {new Date(c.viewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
