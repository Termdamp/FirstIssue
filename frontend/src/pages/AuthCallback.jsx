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
            window.location.replace("/")
          } else {
            window.location.replace("/")
          }
        })
        .catch(() => window.location.replace("/"))
    } else {
      window.location.replace("/")
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '16px',
    }}>
      <div style={{
        width: '28px', height: '28px',
        background: 'linear-gradient(135deg, #fff 0%, #c8c8c8 100%)',
        borderRadius: '7px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: '800',
        fontFamily: "'Geist', sans-serif",
        color: '#000',
      }}>F</div>
      <p style={{
        fontFamily: "'Geist Mono', monospace",
        color: '#333', fontSize: '12px',
      }}>Signing you in…</p>
    </div>
  )
}
