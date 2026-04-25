// src/components/ProgramCard.jsx
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

function detectLang(code) {
  if (/#include|int main|printf|scanf/.test(code)) return 'c'
  if (/class\s+\w+|public static void main|System\.out/.test(code)) return 'java'
  if (/def |import |print\(/.test(code)) return 'python'
  if (/SELECT|INSERT|CREATE TABLE/i.test(code)) return 'sql'
  return 'c'
}

export default function ProgramCard({ program, index, onDelete, isAdmin, creds }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const lang = detectLang(program.program)

  const handleCopy = async (e) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(program.program)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = program.program
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      transition: 'border-color var(--transition), box-shadow var(--transition)',
      animation: `fadeUp 0.4s ease ${index * 0.05}s both`,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border-accent)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,92,246,0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Header row */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.018)',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
          gap: 14,
          userSelect: 'none',
        }}
      >
        {/* Left: number + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <div style={{
            minWidth: 38, height: 38,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.28), rgba(6,182,212,0.14))',
            border: '1px solid rgba(139,92,246,0.28)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
            color: 'var(--cyan)',
          }}>
            {String(program.programNumber).padStart(2, '0')}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: 'var(--text)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {program.title}
          </div>
        </div>

        {/* Right: copy + expand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          onClick={e => e.stopPropagation()}>

          {/* Lang badge */}
          <div style={{
            padding: '3px 9px',
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: 999,
            fontSize: 10, fontWeight: 700,
            color: 'var(--cyan)',
            fontFamily: 'var(--mono)',
            textTransform: 'uppercase',
          }}>{lang}</div>

          <button onClick={handleCopy} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 13px',
            background: copied ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.08)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.22)'}`,
            color: 'var(--green)',
            borderRadius: 'var(--radius-xs)',
            fontSize: 12, fontWeight: 700,
            transition: 'all var(--transition)',
          }}
            onMouseEnter={e => { if (!copied) e.currentTarget.style.background = 'rgba(16,185,129,0.18)' }}
            onMouseLeave={e => { if (!copied) e.currentTarget.style.background = 'rgba(16,185,129,0.08)' }}
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>

          {isAdmin && (
            <button onClick={() => onDelete(program._id)} style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444',
              borderRadius: 'var(--radius-xs)',
              fontSize: 14, transition: 'all var(--transition)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            >🗑</button>
          )}

          <div onClick={() => setExpanded(v => !v)} style={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xs)', fontSize: 13,
            color: expanded ? 'var(--accent)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all var(--transition)',
            transform: expanded ? 'rotate(180deg)' : 'none',
          }}>▼</div>
        </div>
      </div>

      {/* Code body */}
      {expanded && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <SyntaxHighlighter
            language={lang}
            style={vscDarkPlus}
            customStyle={{
              margin: 0, borderRadius: 0,
              fontSize: 13.5, lineHeight: 1.65,
              maxHeight: 520, overflow: 'auto',
              background: '#0d0d17',
              padding: '20px 24px',
            }}
            showLineNumbers
            lineNumberStyle={{ color: '#3a3a55', minWidth: 36, fontSize: 12 }}
          >
            {program.program}
          </SyntaxHighlighter>

          {/* Footer copy */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.012)',
            borderTop: '1px solid var(--border)',
            gap: 10,
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
              {program.program.split('\n').length} lines
            </span>
            <button onClick={handleCopy} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 20px',
              background: copied
                ? 'linear-gradient(135deg, var(--green), #059669)'
                : 'linear-gradient(135deg, var(--accent), var(--cyan))',
              color: 'white', border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13, fontWeight: 700,
              transition: 'all var(--transition)',
              letterSpacing: 0.3,
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {copied ? '✅ Copied to Clipboard!' : '📋 Copy Full Code'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
