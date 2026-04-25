// src/components/Header.jsx

export default function Header({ isAdmin, onAdminClick }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8,8,16,0.82)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      animation: 'slideDown 0.5s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
          borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: '0 0 20px rgba(139,92,246,0.4)',
        }}>💻</div>
        <div style={{ fontWeight: 800, fontSize: 21, letterSpacing: '-0.5px' }}>
          RGIT<span style={{ color: 'var(--cyan)' }}>X</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isAdmin && (
          <div style={{
            padding: '4px 12px',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--green)',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}>● Admin</div>
        )}
        <button onClick={onAdminClick} style={{
          padding: '8px 18px',
          border: '1px solid var(--border-accent)',
          background: 'var(--accent-dim)',
          color: 'var(--accent)',
          borderRadius: 'var(--radius-sm)',
          fontSize: 13,
          fontWeight: 700,
          transition: 'all var(--transition)',
          letterSpacing: 0.3,
        }}
          onMouseEnter={e => { e.target.style.background = 'rgba(139,92,246,0.25)'; e.target.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.target.style.background = 'var(--accent-dim)'; e.target.style.transform = 'none' }}
        >
          ⚙ Admin
        </button>
      </div>
    </header>
  )
}
