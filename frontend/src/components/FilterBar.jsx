const LANGUAGES = ["", "JavaScript", "TypeScript", "Python", "Rust", "Go", "Java", "C++", "Ruby"]
const LABELS = ["good first issue", "help wanted", "beginner friendly", "easy", "starter"]
const SORT_OPTIONS = [
  { label: "Newest first", value: "created_desc" },
  { label: "Oldest first", value: "created_asc" },
  { label: "Most commented", value: "comments_desc" },
]

const selectStyle = {
  background: '#0f1623',
  border: '1px solid #1e2a3a',
  borderRadius: '8px',
  padding: '8px 14px',
  fontSize: '13px',
  color: '#94a3b8',
  fontFamily: "'JetBrains Mono', monospace",
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '28px',
  transition: 'border-color 0.2s',
}

export default function FilterBar({ filters, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
      <select
        value={filters.language}
        onChange={e => onChange({ ...filters, language: e.target.value, page: 1 })}
        style={selectStyle}
      >
        <option value="">All languages</option>
        {LANGUAGES.filter(Boolean).map(lang => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>

      <select
        value={filters.label}
        onChange={e => onChange({ ...filters, label: e.target.value, page: 1 })}
        style={selectStyle}
      >
        {LABELS.map(label => (
          <option key={label} value={label}>{label}</option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={e => onChange({ ...filters, sort: e.target.value, page: 1 })}
        style={selectStyle}
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}