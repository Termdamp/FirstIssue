import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import './index.css'

const isCallback = window.location.pathname === '/auth/callback'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {isCallback ? <AuthCallback /> : <App />}
    </AuthProvider>
  </React.StrictMode>,
)