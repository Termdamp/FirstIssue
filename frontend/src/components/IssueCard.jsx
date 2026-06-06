import { useState, useEffect, useRef } from "react"
import { timeAgo } from "../utils/helpers"
import { trackContribution } from "../services/github"
const API = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"

const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python:     "#3572A5",
  Rust:       "#dea584",
  Go:         "#00ADD8",
  Java:       "#b07219",
  "C++":      "#f34b7d",
  Ruby:       "#701516",
}

function Modal({ issue, repoName, onClose, isBookmarked, onToggleBookmark, onNewBadges }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  const createdDate = new Date(issue.created_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })
  const [repoData, setRepoData] = useState(null)

  useEffect(() => {
    if (!issue.repository_url) return
    fetch(`${API}/api/repo?url=${encodeURIComponent(issue.repository_url)}`)
      .then(r => r.json()).then(setRepoData).catch(() => {})
  }, [issue.repository_url])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,5,20,0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'backdropIn 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, rgba(8,14,40,0.98) 0%, rgba(4,8,28,0.99) 100%)',
          border: '1px solid rgba(13,110,253,0.3)',
          borderRadius: '22px',
          width: '100%', maxWidth: '640px',
          maxHeight: '88vh', overflowY: 'auto',
          padding: '32px',
          position: 'relative',
          animation: 'modalIn 0.3s cubic-bezier(0.16,1,0.3,1)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(13,110,253,0.3) transparent',
          boxShadow: '0 30px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(245,158,11,0.1), 0 0 60px rgba(13,80,220,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), rgba(13,110,253,0.6), rgba(6,182,212,0.5), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', color: '#fbbf24',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            padding: '5px 12px', borderRadius: '8px',
            maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{repoName}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onToggleBookmark(issue)}
              style={{
                background: isBookmarked ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isBookmarked ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '10px', color: isBookmarked ? '#fbbf24' : '#666',
                width: '38px', height: '38px', cursor: 'pointer',
                fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >{isBookmarked ? '★' : '☆'}</button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', color: '#666',
                width: '38px', height: '38px', cursor: 'pointer',
                fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >✕</button>
          </div>
        </div>

        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '21px', fontWeight: '600',
          color: '#f0f0f8', margin: '0 0 24px',
          lineHeight: '1.4', letterSpacing: '-0.02em',
        }}>{issue.title}</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${repoData ? 5 : 3}, 1fr)`,
          background: 'rgba(255,255,255,0.02)', borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden',
          marginBottom: '24px',
        }}>
          {[
            { label: 'Opened', value: createdDate },
            { label: 'Comments', value: issue.comments },
            { label: 'State', value: issue.state, isState: true },
            ...(repoData ? [
              { label: 'Stars', value: `★ ${repoData.stargazers_count?.toLocaleString()}` },
              { label: 'Forks', value: `⑂ ${repoData.forks_count?.toLocaleString()}` },
            ] : []),
          ].map((item, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
              {item.isState ? (
                <span style={{ fontSize: '11px', color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', padding: '2px 8px', borderRadius: '5px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: '600' }}>{item.value}</span>
              ) : (
                <div style={{ fontSize: '12px', color: '#c0c0d8', fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '24px' }}>
          {issue.labels?.map(label => (
            <span key={label.id} style={{
              fontSize: '11px', padding: '4px 12px', borderRadius: '8px',
              background: 'rgba(124,58,237,0.08)', color: '#a78bfa',
              border: '1px solid rgba(124,58,237,0.2)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>{label.name}</span>
          ))}
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.3), rgba(6,182,212,0.2), transparent)', marginBottom: '24px' }} />

        {issue.body ? (
          <div style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8',
            marginBottom: '32px', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>{issue.body}</div>
        ) : (
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)', marginBottom: '32px', fontFamily: "'Space Grotesk', sans-serif" }}>No description provided.</p>
        )}

        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={async () => {
            const token = localStorage.getItem("fi_token")
            if (token) {
              const result = await trackContribution(issue, token)
              if (result?.newBadges?.length > 0 && onNewBadges) {
                onNewBadges(result.newBadges)
              }
            }
          }}
          className="btn-modal-cta"
          style={{
            display: 'flex', width: '100%', justifyContent: 'center',
            padding: '16px', borderRadius: '14px',
            fontSize: '15px', textDecoration: 'none',
            boxSizing: 'border-box', letterSpacing: '-0.01em',
            background: 'linear-gradient(135deg, #0d50dc 0%, #0d6efd 40%, #06b6d4 100%)',
            color: '#fff', fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: '600', border: '1px solid rgba(6,182,212,0.35)',
            boxShadow: '0 0 30px rgba(13,80,220,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
            position: 'relative', overflow: 'hidden',
            transition: 'all 0.25s',
          }}
        >
          View on GitHub
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 4 }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
      </div>
    </div>
  )
}

export default function IssueCard({ issue, isBookmarked, onToggleBookmark, index = 0, onNewBadges }) {
  const [showModal, setShowModal] = useState(false)
  const cardRef = useRef(null)
  const repoName = issue.repository_url?.split("/repos/")[1] || "Unknown repo"

  const language = issue.labels?.find(l =>
    l.name.match(/^(javascript|typescript|python|rust|go|java|c\+\+|ruby)$/i)
  )?.name

  const difficultyLabel = issue.labels?.find(l =>
    ["good first issue","help wanted","beginner friendly","easy"].includes(l.name.toLowerCase())
  )

  const createdDate = new Date(issue.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  })

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    if (cardRef.current) {
      cardRef.current.style.setProperty('--mx', `${x}%`)
      cardRef.current.style.setProperty('--my', `${y}%`)
    }
  }

  return (
    <>
      <div
        ref={cardRef}
        onClick={() => setShowModal(true)}
        onMouseMove={handleMouseMove}
        className="issue-card card-enter"
        style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Bookmark button */}
          <button
            onClick={e => { e.stopPropagation(); onToggleBookmark(issue) }}
            style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: isBookmarked ? 'rgba(245,158,11,0.12)' : 'transparent',
              border: `1px solid ${isBookmarked ? 'rgba(245,158,11,0.35)' : 'transparent'}`,
              color: isBookmarked ? '#fbbf24' : 'rgba(255,255,255,0.2)',
              fontSize: '16px', cursor: 'pointer', padding: '5px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              lineHeight: 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fbbf24'; e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; }}
            onMouseLeave={e => {
              e.currentTarget.style.color = isBookmarked ? '#fbbf24' : 'rgba(255,255,255,0.2)'
              e.currentTarget.style.background = isBookmarked ? 'rgba(245,158,11,0.12)' : 'transparent'
              e.currentTarget.style.borderColor = isBookmarked ? 'rgba(245,158,11,0.35)' : 'transparent'
            }}
          >
            {isBookmarked ? '★' : '☆'}
          </button>

          {/* Repo name */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px', color: '#7c6af0',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            paddingRight: '28px', marginBottom: '12px',
          }}>{repoName}</div>

          {/* Title */}
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px', fontWeight: '500',
            color: '#e0e0f0', lineHeight: '1.55',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            paddingRight: '8px',
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}>{issue.title}</div>

          {/* Labels */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
            {language && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '11px', padding: '3px 9px', borderRadius: '7px',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: LANGUAGE_COLORS[language] || '#777',
                  flexShrink: 0, boxShadow: `0 0 6px ${LANGUAGE_COLORS[language] || '#777'}80`,
                }} />
                {language}
              </span>
            )}
            {difficultyLabel && (
              <span style={{
                fontSize: '11px', padding: '3px 9px', borderRadius: '7px',
                background: 'rgba(74,222,128,0.06)', color: '#4ade80',
                border: '1px solid rgba(74,222,128,0.18)',
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: '0 0 10px rgba(74,222,128,0.1)',
              }}>{difficultyLabel.name}</span>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '13px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#4ade80', flexShrink: 0,
                boxShadow: '0 0 8px rgba(74,222,128,0.6)',
              }} />
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>open</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.2)' }}>
              <span>{issue.comments} comments</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>{createdDate}</span>
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <Modal
          issue={issue} repoName={repoName}
          onClose={() => setShowModal(false)}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          onNewBadges={onNewBadges}
        />
      )}
    </>
  )
}
