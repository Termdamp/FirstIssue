import { useRef } from "react"
import { debounce } from "../utils/helpers"

export default function SearchBar({ value, onChange }) {
  const debouncedChange = useRef(
    debounce((val) => onChange(val), 400)
  ).current

  return (
    <div className="search-float" style={{ position: 'relative', width: '100%' }}>
      <svg
        style={{
          position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
          color: 'rgba(124,58,237,0.5)', pointerEvents: 'none', flexShrink: 0,
          zIndex: 1,
        }}
        width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        defaultValue={value}
        onChange={(e) => debouncedChange(e.target.value)}
        placeholder="Search issues"
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '17px 20px 17px 50px',
          fontSize: '15px',
          color: '#e0e0f0',
          fontFamily: "'Space Grotesk', sans-serif",
          outline: 'none',
          transition: 'all 0.3s ease',
          letterSpacing: '-0.01em',
          backdropFilter: 'blur(10px)',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(124,58,237,0.5)'
          e.target.style.background = 'rgba(124,58,237,0.06)'
          e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1), 0 8px 32px rgba(124,58,237,0.15)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(255,255,255,0.08)'
          e.target.style.background = 'rgba(255,255,255,0.03)'
          e.target.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}
