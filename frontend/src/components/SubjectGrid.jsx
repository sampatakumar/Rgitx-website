// src/components/SubjectGrid.jsx

const ICONS = ['💾', '🔗', '📊', '🧮', '🌐', '🖥️', '🔐', '📡', '⚙️', '🧬', '📐', '🔬', '📦', '🧩', '🗃️', '⛓️']

function getIcon(name) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % ICONS.length
  return ICONS[h]
}

function Skeleton() {
  return (
    <div style={{
      height: 110, borderRadius: 'var(--radius)',
      background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }} />
  )
}

export default function SubjectGrid({ subjects, activeSem, activeSubject, onSelect, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 48 }}>
        {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }

  if (!subjects.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 20px',
        color: 'var(--text-muted)', marginBottom: 48,
      }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📂</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 6 }}>No Subjects Yet</div>
        <div style={{ fontSize: 13 }}>Ask your admin to upload programs for Semester {activeSem}.</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 2,
        textTransform: 'uppercase', color: 'var(--text-muted)',
        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        Subjects — Semester {activeSem}
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: 12 }}>{subjects.length} subjects</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
        marginBottom: 48,
      }}>
        {subjects.map((subject, i) => {
          const active = activeSubject === subject
          return (
            <button
              key={subject}
              onClick={() => onSelect(subject)}
              style={{
                background: active ? 'rgba(139,92,246,0.08)' : 'var(--surface)',
                border: `1px solid ${active ? 'rgba(139,92,246,0.5)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '20px 18px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition)',
                position: 'relative',
                overflow: 'hidden',
                animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--border-accent)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.1)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {/* Left accent bar */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: 'linear-gradient(180deg, var(--accent), var(--cyan))',
                opacity: active ? 1 : 0,
                transition: 'opacity var(--transition)',
              }} />

              <div style={{
                width: 38, height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 12,
              }}>{getIcon(subject)}</div>

              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>
                {subject}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                Sem {activeSem}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
