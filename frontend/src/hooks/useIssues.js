import { useState, useEffect, useRef } from "react"
import { fetchIssues } from "../services/github"

export function useIssues(filters) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  const prevFiltersRef = useRef({
    language: filters.language,
    label: filters.label,
    keyword: filters.keyword,
    sort: filters.sort,
  })

  useEffect(() => {
    let cancelled = false

    const prevFilters = prevFiltersRef.current
    const isNewQuery =
      prevFilters.language !== filters.language ||
      prevFilters.label !== filters.label ||
      prevFilters.keyword !== filters.keyword ||
      prevFilters.sort !== filters.sort

    prevFiltersRef.current = {
      language: filters.language,
      label: filters.label,
      keyword: filters.keyword,
      sort: filters.sort,
    }

    if (isNewQuery || filters.page === 1) {
      setLoading(true)
      setIssues([])
      setHasMore(false)
      setError(null)
    } else {
      setLoadingMore(true)
    }

    fetchIssues(filters)
      .then((data) => {
        if (!cancelled) {
          const incoming = data.items || []

          if (isNewQuery || filters.page === 1) {
            setIssues(incoming)
          } else {
            setIssues(prev => [...prev, ...incoming])
          }

          setHasMore(incoming.length === 12)
          setLoading(false)
          setLoadingMore(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
          setLoadingMore(false)
        }
      })

    return () => { cancelled = true }
  }, [filters.language, filters.label, filters.keyword, filters.sort, filters.page])

  return { issues, loading, loadingMore, error, hasMore }
}