import { useState, useEffect } from "react"

const STORAGE_KEY = "firstissue_bookmarks"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  function toggleBookmark(issue) {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === issue.id)
      return exists ? prev.filter(b => b.id !== issue.id) : [issue, ...prev]
    })
  }

  function isBookmarked(id) {
    return bookmarks.some(b => b.id === id)
  }

  return { bookmarks, toggleBookmark, isBookmarked }
}