const LANGUAGES = ["", "JavaScript", "TypeScript", "Python", "Rust", "Go", "Java", "C++", "Ruby"]
const LABELS = ["good first issue", "help wanted", "beginner friendly", "easy", "starter"]
const SORT_OPTIONS = [
  { label: "Newest first", value: "created_desc" },
  { label: "Oldest first", value: "created_asc" },
  { label: "Most commented", value: "comments_desc" },
]

const selectStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '10px 36px 10px 16px',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.5)',
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: '500',
  cursor: 'pointer',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%237c3aed' d='M5 7L1 3h8z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  transition: 'all 0.25s ease',
  letterSpacing: '-0.01em',
  backdropFilter: 'blur(8px)',
}

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="filter-float" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
      {[
        {
          value: filters.language,
          onChange: (v) => onChange({ ...filters, language: v, page: 1 }),
          options: [{ label: 'All languages', value: '' }, ...LANGUAGES.filter(Boolean).map(l => ({ label: l, value: l }))],
        },
        {
          value: filters.label,
          onChange: (v) => onChange({ ...filters, label: v, page: 1 }),
          options: LABELS.map(l => ({ label: l, value: l })),
        },
        {
          value: filters.sort,
          onChange: (v) => onChange({ ...filters, sort: v, page: 1 }),
          options: SORT_OPTIONS.map(o => ({ label: o.label, value: o.value })),
        },
      ].map((sel, i) => (
        <select
          key={i}
          value={sel.value}
          onChange={e => sel.onChange(e.target.value)}
          style={selectStyle}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
            e.currentTarget.style.background = 'rgba(124,58,237,0.07)'
            e.currentTarget.style.boxShadow = '0 0 16px rgba(124,58,237,0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {sel.options.map(opt => (
            <option key={opt.value} value={opt.value} style={{ background: '#0c0c18', color: '#e0e0f0' }}>{opt.label}</option>
          ))}
        </select>
      ))}
    </div>
  )
}
