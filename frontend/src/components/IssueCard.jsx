import { useState, useEffect } from "react"
import { timeAgo } from "../utils/helpers"

const LANGUAGE_COLORS = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  Ruby: "#701516",
}

function Modal({ issue, repoName, onClose, isBookmarked, onToggleBookmark }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const createdDate = new Date(issue.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  })

  const [repoData, setRepoData] = useState(null)

  useEffect(() => {
    if (!issue.repository_url) return
    fetch(`http://localhost:5000/api/repo?url=${encodeURIComponent(issue.repository_url)}`)
      .then(r => r.json())
      .then(setRepoData)
      .catch(() => {})
  }, [issue.repository_url])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0f1623',
          border: '1px solid #1e2a3a',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '85vh',
          overflowY: 'scroll',
          padding: '28px',
          position: 'relative',
          animation: 'slideUp 0.2s ease',
          scrollbarWidth: 'thin',
          scrollbarColor: '#2d3748 #0f1623',
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        `}</style>

        {/* Top action row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', color: '#3b82f6',
            letterSpacing: '0.05em',
          }}>
            {repoName}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onToggleBookmark(issue)}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this issue"}
              style={{
                background: isBookmarked ? 'rgba(59,130,246,0.12)' : '#1e2a3a',
                border: isBookmarked ? '1px solid rgba(59,130,246,0.3)' : '1px solid #334155',
                borderRadius: '6px',
                color: isBookmarked ? '#3b82f6' : '#64748b',
                width: '28px', height: '28px',
                cursor: 'pointer', fontSize: '13px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#1e2a3a', border: '1px solid #334155',
                borderRadius: '6px', color: '#64748b',
                width: '28px', height: '28px',
                cursor: 'pointer', fontSize: '13px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '18px', fontWeight: '700',
          color: '#f1f5f9', margin: '0 0 16px',
          lineHeight: '1.4',
        }}>
          {issue.title}
        </h2>

        {/* Meta row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0',
          marginBottom: '16px',
          background: '#0a0e1a',
          borderRadius: '10px',
          border: '1px solid #1e2a3a',
          overflow: 'hidden',
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
            <div key={i} style={{
              padding: '12px 16px',
              borderRight: '1px solid #1e2a3a',
              flex: '1',
              minWidth: '80px',
            }}>
              <div style={{
                fontSize: '10px', color: '#475569',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '4px',
              }}>{item.label}</div>
              {item.isState ? (
                <span style={{
                  fontSize: '11px', color: '#4ade80',
                  background: 'rgba(74,222,128,0.1)',
                  padding: '2px 8px', borderRadius: '20px',
                  border: '1px solid rgba(74,222,128,0.2)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{item.value}</span>
              ) : (
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>{item.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {issue.labels?.map(label => (
            <span key={label.id} style={{
              fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
              background: `#${label.color}22`,
              color: `#${label.color}`,
              border: `1px solid #${label.color}44`,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {label.name}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#1e2a3a', marginBottom: '16px' }} />

        {/* Body */}
        {issue.body ? (
          <div style={{
            fontSize: '13px', color: '#64748b',
            lineHeight: '1.8', marginBottom: '20px',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {issue.body}
          </div>
        ) : (
          <p style={{
            fontSize: '13px', color: '#334155',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '20px',
          }}>
            No description provided.
          </p>
        )}

        {/* CTA */}
        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', width: '100%', textAlign: 'center',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: '#fff', fontWeight: '600',
            padding: '12px', borderRadius: '10px',
            textDecoration: 'none', fontSize: '14px',
            fontFamily: "'Syne', sans-serif",
            transition: 'opacity 0.2s',
            boxSizing: 'border-box',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          View on GitHub ↗
        </a>
      </div>
    </div>
  )
}

export default function IssueCard({ issue, isBookmarked, onToggleBookmark }) {
  const [showModal, setShowModal] = useState(false)
  const repoName = issue.repository_url?.split("/repos/")[1] || "Unknown repo"

  const language = issue.labels?.find(l =>
    l.name.match(/^(javascript|typescript|python|rust|go|java|c\+\+|ruby)$/i)
  )?.name

  const difficultyLabel = issue.labels?.find(l =>
    ["good first issue", "help wanted", "beginner friendly", "easy"].includes(l.name.toLowerCase())
  )

  const createdDate = new Date(issue.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  })

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          background: '#0f1623',
          border: '1px solid #1e2a3a',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          cursor: 'pointer',
          transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
          position: 'relative',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#3b82f6'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.08)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#1e2a3a'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Bookmark button */}
        <button
          onClick={e => {
            e.stopPropagation()
            onToggleBookmark(issue)
          }}
          title={isBookmarked ? "Remove bookmark" : "Save issue"}
          style={{
            position: 'absolute', top: '14px', right: '14px',
            background: 'transparent', border: 'none',
            color: isBookmarked ? '#3b82f6' : '#334155',
            fontSize: '16px', cursor: 'pointer',
            padding: '2px',
            transition: 'color 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#3b82f6'
            e.currentTarget.style.transform = 'scale(1.2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = isBookmarked ? '#3b82f6' : '#334155'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {isBookmarked ? '★' : '☆'}
        </button>

        {/* Repo name */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px', color: '#3b82f6',
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          paddingRight: '24px',
        }}>
          {repoName}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '14px', fontWeight: '600',
          color: '#e2e8f0', lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          paddingRight: '8px',
        }}>
          {issue.title}
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {language && (
            <span style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '11px', padding: '3px 9px', borderRadius: '20px',
              background: '#0a0e1a', color: '#94a3b8',
              border: '1px solid #1e2a3a',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: LANGUAGE_COLORS[language] || '#64748b',
                flexShrink: 0,
              }} />
              {language}
            </span>
          )}
          {difficultyLabel && (
            <span style={{
              fontSize: '11px', padding: '3px 9px', borderRadius: '20px',
              background: 'rgba(74,222,128,0.08)', color: '#4ade80',
              border: '1px solid rgba(74,222,128,0.2)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {difficultyLabel.name}
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '6px', paddingTop: '12px',
          borderTop: '1px solid #1e2a3a',
          fontSize: '11px', color: '#475569',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#4ade80', flexShrink: 0,
            }} />
            open
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>{issue.comments} comments</span>
            <span style={{ color: '#334155' }}>·</span>
            <span>{createdDate}</span>
          </span>
        </div>
      </div>

      {showModal && (
        <Modal
          issue={issue}
          repoName={repoName}
          onClose={() => setShowModal(false)}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
        />
      )}
    </>
  )
}