import { useState, useEffect, createContext, useContext } from "react"

const AuthContext = createContext(null)
const API = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("fi_token")
    if (!token) {
      setAuthLoading(false)
      return
    }
    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data._id) setUser(data)
        else localStorage.removeItem("fi_token")
      })
      .catch(() => localStorage.removeItem("fi_token"))
      .finally(() => setAuthLoading(false))
  }, [])

  function logout() {
    localStorage.removeItem("fi_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}