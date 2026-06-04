import { useState } from "react"
import Navbar from "./components/Navbar"
import FilterBar from "./components/FilterBar"
import SearchBar from "./components/SearchBar"
import IssueCard from "./components/IssueCard"
import SkeletonCard from "./components/SkeletonCard"
import { useIssues } from "./hooks/useIssues"
import { useBookmarks } from "./hooks/useBookmarks"

export default function App() {
  const [activeTab, setActiveTab] = useState("browse")
  const [filters, setFilters] = useState({
    language: "",
    label: "good first issue",
    keyword: "",
    sort: "created_desc",
    page: 1,
  })

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
    <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bookmarkCount={bookmarks.length}
      />

      {/* Hero — only on browse tab */}
      {activeTab === "browse" && (
        <div style={{
          maxWidth: '760px',
          margin: '0 auto',
          padding: '72px 24px 48px',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-block',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', color: '#3b82f6',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            padding: '4px 12px', borderRadius: '20px',
            marginBottom: '20px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Open source, simplified
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: '800', color: '#f1f5f9',
            margin: '0 0 16px', lineHeight: '1.15',
            letterSpacing: '-0.02em',
          }}>
            Find your first{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              contribution
            </span>
          </h1>

          <p style={{
            fontSize: '16px', color: '#64748b',
            margin: '0 auto 40px', maxWidth: '480px',
            lineHeight: '1.6', fontWeight: '300',
          }}>
            Curated beginner-friendly GitHub issues, filtered by language and difficulty — so you can stop searching and start contributing.
          </p>

          <div style={{ maxWidth: '560px', margin: '0 auto 28px' }}>
            <SearchBar value={filters.keyword} onChange={handleKeywordChange} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <FilterBar filters={filters} onChange={handleFilterChange} />
          </div>
        </div>
      )}

      {/* Saved tab header */}
      {activeTab === "saved" && (
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '48px 24px 32px',
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '24px', fontWeight: '700',
            color: '#f1f5f9', margin: '0 0 6px',
          }}>Saved Issues</h2>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px', color: '#334155',
          }}>
            {bookmarks.length} issue{bookmarks.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      )}

      {/* Results */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Results count for browse tab */}
        {activeTab === "browse" && !loading && !error && issues.length > 0 && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', color: '#334155',
            marginBottom: '20px', letterSpacing: '0.05em',
          }}>
            {issues.length} issues loaded
          </div>
        )}

        {/* Skeleton */}
        {activeTab === "browse" && loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {activeTab === "browse" && error && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px', color: '#f87171',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              display: 'inline-block',
              padding: '8px 16px', borderRadius: '8px', marginBottom: '16px',
            }}>
              error: backend unreachable
            </div>
            <br />
            <button
              onClick={() => setFilters({ ...filters })}
              style={{
                marginTop: '12px', background: 'transparent',
                border: '1px solid #1e2a3a', color: '#94a3b8',
                padding: '8px 20px', borderRadius: '8px',
                cursor: 'pointer', fontSize: '13px',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              retry
            </button>
          </div>
        )}

        {/* Empty browse */}
        {activeTab === "browse" && !loading && !error && issues.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#334155' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>∅</div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
              No issues found for this combination
            </p>
          </div>
        )}

        {/* Empty saved */}
        {activeTab === "saved" && bookmarks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>☆</div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '13px', color: '#334155',
            }}>
              No saved issues yet
            </p>
            <p style={{ fontSize: '13px', color: '#1e2a3a', marginTop: '6px' }}>
              Click the star on any issue card to save it
            </p>
          </div>
        )}

        {/* Issue grid */}
        {!loading && !error && displayIssues.length > 0 && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
            }}>
              {displayIssues.map(issue => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  isBookmarked={isBookmarked(issue.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>

            {/* Load more — browse only */}
            {activeTab === "browse" && (
              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                {hasMore ? (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    style={{
                      background: 'transparent',
                      border: '1px solid #1e2a3a',
                      color: loadingMore ? '#334155' : '#64748b',
                      padding: '10px 32px', borderRadius: '8px',
                      cursor: loadingMore ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontFamily: "'JetBrains Mono', monospace",
                      transition: 'all 0.2s',
                      letterSpacing: '0.05em',
                    }}
                    onMouseEnter={e => {
                      if (!loadingMore) {
                        e.currentTarget.style.borderColor = '#3b82f6'
                        e.currentTarget.style.color = '#3b82f6'
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#1e2a3a'
                      e.currentTarget.style.color = '#64748b'
                    }}
                  >
                    {loadingMore ? "loading..." : "load more ↓"}
                  </button>
                ) : (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px', color: '#1e2a3a',
                    letterSpacing: '0.08em',
                  }}>
                    — end of results —
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}