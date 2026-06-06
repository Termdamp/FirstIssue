import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import './index.css'

const path = window.location.pathname

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {path === '/auth/callback' ? <AuthCallback /> : <App />}
    </AuthProvider>
  </React.StrictMode>,
)