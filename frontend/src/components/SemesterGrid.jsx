// src/components/SemesterGrid.jsx

const SUFFIXES = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th']

export default function SemesterGrid({ activeSem, onSelect }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 2,
        textTransform: 'uppercase', color: 'var(--text-muted)',
        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        Select Semester
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: 10,
        marginBottom: 48,
      }}>
        {Array.from({ length: 8 }, (_, i) => i + 1).map(sem => {
          const active = activeSem === sem
          return (
            <button
              key={sem}
              onClick={() => onSelect(sem)}
              style={{
                background: active ? 'rgba(139,92,246,0.12)' : 'var(--surface)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '18px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all var(--transition)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: active ? '0 0 0 1px var(--accent), 0 6px 24px rgba(139,92,246,0.18)' : 'none',
                animation: `fadeUp 0.5s ease ${(sem - 1) * 0.04}s both`,
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--border-accent)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(139,92,246,0.12)'
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
              {/* Glow overlay */}
              {active && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.05))',
                  pointerEvents: 'none',
                }} />
              )}
              <div style={{
                fontSize: 26, fontWeight: 800,
                letterSpacing: -1, lineHeight: 1,
                marginBottom: 4,
                fontFamily: 'var(--mono)',
                color: active ? 'var(--cyan)' : 'var(--accent)',
              }}>{sem}</div>
              <div style={{
                fontSize: 10, fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: 1,
              }}>{sem}{SUFFIXES[sem - 1]} Sem</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
