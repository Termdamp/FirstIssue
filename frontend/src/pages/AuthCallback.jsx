import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth.jsx"

const API = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"

export default function AuthCallback() {
  const { setUser } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (token) {
      localStorage.setItem("fi_token", token)
      fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data._id) {
            setUser(data)
            window.location.href = "/"
          } else {
            window.location.href = "/"
          }
        })
        .catch(() => {
          window.location.href = "/"
        })
    } else {
      window.location.href = "/"
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace",
      color: '#334155', fontSize: '13px',
    }}>
      signing you in...
    </div>
  )
}