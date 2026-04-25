// src/components/Toast.jsx
import { useState, useEffect } from 'react'

const styles = {
  container: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    pointerEvents: 'none',
  }
}

function ToastItem({ message, type, onDone }) {
  const [dying, setDying] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setDying(true), 2600)
    const t2 = setTimeout(() => onDone(), 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 18px',
      background: 'var(--surface2)',
      border: `1px solid ${type === 'success' ? 'rgba(16,185,129,0.35)' : type === 'error' ? 'rgba(239,68,68,0.35)' : 'var(--border-accent)'}`,
      borderRadius: 'var(--radius-sm)',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: dying ? 'toastOut 0.4s ease forwards' : 'toastIn 0.3s ease',
      maxWidth: 320,
      pointerEvents: 'all',
      backdropFilter: 'blur(12px)',
    }}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  )
}

export default function Toast({ toasts, removeToast }) {
  return (
    <div style={styles.container}>
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} onDone={() => removeToast(t.id)} />
      ))}
    </div>
  )
}
