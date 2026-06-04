import { useRef } from "react"
import { debounce } from "../utils/helpers"

export default function SearchBar({ value, onChange }) {
  const debouncedChange = useRef(
    debounce((val) => onChange(val), 400)
  ).current

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <span style={{
        position: 'absolute', left: '14px', top: '50%',
        transform: 'translateY(-50%)',
        color: '#334155', fontSize: '15px', pointerEvents: 'none',
      }}>⌕</span>
      <input
        type="text"
        defaultValue={value}
        onChange={(e) => debouncedChange(e.target.value)}
        placeholder="Search issues — try 'react', 'cli', 'documentation'..."
        style={{
          width: '100%',
          background: '#0f1623',
          border: '1px solid #1e2a3a',
          borderRadius: '10px',
          padding: '12px 16px 12px 38px',
          fontSize: '14px',
          color: '#cbd5e1',
          fontFamily: "'Inter', sans-serif",
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#3b82f6'
          e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'
        }}
        onBlur={e => {
          e.target.style.borderColor = '#1e2a3a'
          e.target.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}