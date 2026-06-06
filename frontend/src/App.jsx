import { useState, useCallback } from "react"
import Navbar from "./components/Navbar"
import FilterBar from "./components/FilterBar"
import SearchBar from "./components/SearchBar"
import IssueCard from "./components/IssueCard"
import SkeletonCard from "./components/SkeletonCard"
import { useIssues } from "./hooks/useIssues"
import { useBookmarks } from "./hooks/useBookmarks"
import { useAuth } from "./hooks/useAuth"
import Profile from "./pages/Profile.jsx"
import AvatarPicker from "./pages/AvatarPicker.jsx"

const BADGE_META = {
  first_look:     { icon: "👀", label: "First Look",     desc: "Viewed your first issue",  color: "#818cf8" },
  explorer:       { icon: "🧭", label: "Explorer",       desc: "Viewed 5 issues",           color: "#8b5cf6" },
  curious:        { icon: "🔍", label: "Curious",        desc: "Viewed 10 issues",          color: "#06b6d4" },
  contributor:    { icon: "⚡", label: "Contributor",    desc: "Viewed 25 issues",          color: "#f59e0b" },
  dedicated:      { icon: "🔥", label: "Dedicated",      desc: "Viewed 50 issues",          color: "#ef4444" },
  open_sourcerer: { icon: "🧙", label: "Open Sourcerer", desc: "Viewed 100 issues",         color: "#4ade80" },
}

export default function App() {
  const [activeTab, setActiveTab] = useState("browse")
  const [filters, setFilters] = useState({
    language: "",
    label: "good first issue",
    keyword: "",
    sort: "created_desc",
    page: 1,
  })
  const { user, setUser } = useAuth()
  const [newBadgeQueue, setNewBadgeQueue] = useState([])
  const [showingBadge, setShowingBadge] = useState(null)

  const handleNewBadges = useCallback((badges) => {
    // Refresh user from server so profile updates
    const token = localStorage.getItem("fi_token")
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (data._id && setUser) setUser(data) })
        .catch(() => {})
    }
    // Show each badge one at a time
    setNewBadgeQueue(prev => {
      const queue = [...prev, ...badges]
      if (!showingBadge) {
        setShowingBadge(queue[0])
        setTimeout(() => {
          setShowingBadge(null)
          setNewBadgeQueue(q => q.slice(1))
        }, 4000)
      }
      return queue
    })
  }, [showingBadge, setUser])

  function handleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/github`
  }

  const { issues, loading, loadingMore, error, hasMore } = useIssues(filters)
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks()

  function handleFilterChange(newFilters) {
    setFilters({ ...newFilters, page: 1 })
  }
  function handleKeywordChange(keyword) {
    setFilters(prev => ({ ...prev, keyword, page: 1 }))
  }
  function handleLoadMore() {
    if (loadingMore || !hasMore) return
    setFilters(prev => ({ ...prev, page: prev.page + 1 }))
  }

  const displayIssues = activeTab === "saved" ? bookmarks : issues

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* Animated background */}
      <div className="app-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="grid-lines" />
        {/* Circular radiating light*/}
        <div className="radial-core" />
        <div className="radial-ring ring-1" />
        <div className="radial-ring ring-2" />
        <div className="radial-ring ring-3" />
        <div className="radial-ring ring-4" />
      </div>

      {/* Badge earned celebration*/}
      {showingBadge && BADGE_META[showingBadge] && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'rgba(6,6,20,0.97)',
          border: `1px solid ${BADGE_META[showingBadge].color}55`,
          borderRadius: '20px',
          padding: '20px 32px',
          display: 'flex', alignItems: 'center', gap: '16px',
          boxShadow: `0 0 60px ${BADGE_META[showingBadge].color}40, 0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)`,
          backdropFilter: 'blur(20px)',
          animation: 'badgeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1)',
          minWidth: '320px',
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '70%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${BADGE_META[showingBadge].color}, transparent)`,
          }} />
          <span style={{ fontSize: '40px', lineHeight: 1, filter: `drop-shadow(0 0 16px ${BADGE_META[showingBadge].color})`, animation: 'badgePop 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both' }}>
            {BADGE_META[showingBadge].icon}
          </span>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: BADGE_META[showingBadge].color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.8 }}>
              🎉 Badge Unlocked!
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: '700', color: '#f0f0f8', letterSpacing: '-0.02em' }}>
              {BADGE_META[showingBadge].label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
              {BADGE_META[showingBadge].desc}
            </div>
          </div>
          <div style={{
            marginLeft: 'auto',
            width: '32px', height: '32px',
            borderRadius: '50%',
            border: `2px solid ${BADGE_META[showingBadge].color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', color: BADGE_META[showingBadge].color,
            cursor: 'pointer',
          }} onClick={() => setShowingBadge(null)}>✕</div>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bookmarkCount={bookmarks.length}
        user={user}
        onLogin={handleLogin}
        onLogout={() => {}}
      />

      {activeTab === "profile" && (
        <Profile onBack={() => setActiveTab("browse")} onEditAvatar={() => setActiveTab("avatar")} />
      )}

      {activeTab === "avatar" && (
        <AvatarPicker onBack={() => setActiveTab("profile")} />
      )}

      {activeTab !== "profile" && activeTab !== "avatar" && (
        <>
          {/* Hero */}
          {activeTab === "browse" && (
            <div style={{
              maxWidth: '760px', margin: '0 auto',
              padding: '100px 24px 60px',
              textAlign: 'center',
            }}>
              <div className="hero-float-1" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px', fontWeight: '500',
                color: '#a78bfa',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.25)',
                padding: '6px 16px', borderRadius: '99px',
                marginBottom: '32px',
                letterSpacing: '0.04em',
                boxShadow: '0 0 20px rgba(124,58,237,0.1)',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block', boxShadow: '0 0 8px rgba(167,139,250,0.8)' }} />
                Open source, simplified
              </div>

              <h1 className="hero-float-2" style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(38px, 7vw, 68px)',
                fontWeight: '700', color: '#f0f0f8',
                margin: '0 0 24px', lineHeight: '1.05',
                letterSpacing: '-0.04em',
              }}>
                Find your first<br/>
                <span className="gradient-text">contribution</span>
              </h1>

              <p className="hero-float-3" style={{
                fontSize: '17px', color: 'rgba(255,255,255,0.4)',
                margin: '0 auto 52px', maxWidth: '500px',
                lineHeight: '1.65', fontWeight: '400',
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                Curated beginner-friendly GitHub issues, filtered by language and difficulty. Stop searching, start contributing.
              </p>

              <div className="hero-float-4" style={{ maxWidth: '580px', margin: '0 auto 24px' }}>
                <SearchBar value={filters.keyword} onChange={handleKeywordChange} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <FilterBar filters={filters} onChange={handleFilterChange} />
              </div>
            </div>
          )}

          {/* Saved tab header */}
          {activeTab === "saved" && (
            <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '52px 24px 36px' }}>
              <h2 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '26px', fontWeight: '700',
                color: '#f0f0f8', margin: '0 0 6px',
                letterSpacing: '-0.03em',
              }}>Saved Issues</h2>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px', color: 'rgba(255,255,255,0.2)',
              }}>
                {bookmarks.length} issue{bookmarks.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          )}

          {/* Results area */}
          <div className="issue-area-bg" style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px 80px', position: 'relative' }}>

            {activeTab === "browse" && !loading && !error && issues.length > 0 && (
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px', color: 'rgba(255,255,255,0.15)',
                marginBottom: '20px', letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {issues.length} issues loaded
              </div>
            )}

            {/* Skeletons */}
            {activeTab === "browse" && loading && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
              </div>
            )}

            {/* Error */}
            {activeTab === "browse" && error && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px', color: '#ef4444',
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  display: 'inline-block', padding: '10px 20px', borderRadius: '10px', marginBottom: '20px',
                }}>error: backend unreachable</div>
                <br />
                <button onClick={() => setFilters({ ...filters })} className="btn-ghost" style={{ marginTop: '12px' }}>
                  ↻ Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {activeTab === "browse" && !loading && !error && issues.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '14px', opacity: 0.3 }}>∅</div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>
                  No issues found for this combination
                </p>
              </div>
            )}

            {activeTab === "saved" && bookmarks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '14px', opacity: 0.25 }}>◇</div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginBottom: '8px' }}>
                  No saved issues yet
                </p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.25)', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Click the star on any issue to save it
                </p>
              </div>
            )}

            {/* Issue grid */}
            {!loading && !error && displayIssues.length > 0 && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '16px',
                  position: 'relative', zIndex: 1,
                }}>
                  {displayIssues.map((issue, index) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      isBookmarked={isBookmarked(issue.id)}
                      onToggleBookmark={toggleBookmark}
                      index={index}
                      onNewBadges={handleNewBadges}
                    />
                  ))}
                </div>

                {activeTab === "browse" && (
                  <div style={{ textAlign: 'center', marginTop: '56px' }}>
                    {hasMore ? (
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="btn-ghost"
                        style={{
                          padding: '14px 40px', fontSize: '14px',
                          cursor: loadingMore ? 'not-allowed' : 'pointer',
                          opacity: loadingMore ? 0.5 : 1,
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                        }}
                      >
                        {loadingMore ? (
                          <><span className="spinner">↻</span>Loading…</>
                        ) : (
                          <>Load more <span style={{ opacity: 0.5 }}>↓</span></>
                        )}
                      </button>
                    ) : (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px', color: 'rgba(255,255,255,0.15)',
                        letterSpacing: '0.1em',
                      }}>— end of results —</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
