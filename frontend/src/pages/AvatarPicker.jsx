import { useState } from "react"
import { useAuth } from "../hooks/useAuth.jsx"

const AVATAR_STYLES = [
  { id: "adventurer", label: "Adventurer" },
  { id: "pixel-art", label: "Pixel Art" },
  { id: "lorelei", label: "Lorelei" },
  { id: "bottts", label: "Robots" },
  { id: "fun-emoji", label: "Emoji" },
  { id: "thumbs", label: "Thumbs" },
]

const SEEDS = [
  "alpha", "beta", "gamma", "delta", "epsilon",
  "zeta", "theta", "sigma", "omega", "lambda",
  "nova", "orbit", "pixel", "quark", "radar",
  "solar", "titan", "ultra", "vega", "xenon",
]

export default function AvatarPicker({ onBack }) {
  const { user, setUser } = useAuth()
  const [selectedStyle, setSelectedStyle] = useState(
    user?.chosenAvatar?.style || "adventurer"
  )
  const [selectedSeed, setSelectedSeed] = useState(
    user?.chosenAvatar?.seed || user?.username || "default"
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function getAvatarUrl(style, seed) {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
  }

  async function handleSave() {
    setSaving(true)
    const token = localStorage.getItem("fi_token")
    try {
      const res = await fetch("http://localhost:5000/api/user/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ style: selectedStyle, seed: selectedSeed }),
      })
      const updated = await res.json()
      setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // handle error
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Back */}
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none',
            color: '#475569', cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px', marginBottom: '32px',
            padding: 0,
          }}
        >
          ← back to profile
        </button>

        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '24px', fontWeight: '700',
          color: '#f1f5f9', marginBottom: '6px',
        }}>Choose your avatar</h2>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '12px', color: '#475569', marginBottom: '32px',
        }}>
          Pick any style and seed — no labels, just pick what looks like you
        </p>

        {/* Current preview */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: '32px',
        }}>
          <div style={{
            width: '100px', height: '100px',
            borderRadius: '50%',
            border: '3px solid #3b82f6',
            overflow: 'hidden',
            background: '#0f1623',
          }}>
            <img
              src={getAvatarUrl(selectedStyle, selectedSeed)}
              alt="preview"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* Style picker */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px', color: '#475569',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '12px',
        }}>Style</div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px',
        }}>
          {AVATAR_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              style={{
                background: selectedStyle === style.id ? 'rgba(59,130,246,0.12)' : '#0f1623',
                border: `1px solid ${selectedStyle === style.id ? '#3b82f6' : '#1e2a3a'}`,
                borderRadius: '8px', padding: '8px 14px',
                color: selectedStyle === style.id ? '#3b82f6' : '#64748b',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Seed picker — avatar grid */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px', color: '#475569',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: '12px',
        }}>Pick one</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
          gap: '10px', marginBottom: '32px',
        }}>
          {SEEDS.map(seed => (
            <div
              key={seed}
              onClick={() => setSelectedSeed(seed)}
              style={{
                width: '100%', aspectRatio: '1',
                borderRadius: '12px',
                border: `2px solid ${selectedSeed === seed ? '#3b82f6' : '#1e2a3a'}`,
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#0f1623',
                transition: 'border-color 0.15s, transform 0.15s',
                transform: selectedSeed === seed ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <img
                src={getAvatarUrl(selectedStyle, seed)}
                alt={seed}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            background: saved
              ? 'linear-gradient(135deg, #4ade80, #22c55e)'
              : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            border: 'none', borderRadius: '10px',
            color: '#fff', fontWeight: '600',
            padding: '13px', fontSize: '14px',
            fontFamily: "'Syne', sans-serif",
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Avatar'}
        </button>
      </div>
    </div>
  )
}