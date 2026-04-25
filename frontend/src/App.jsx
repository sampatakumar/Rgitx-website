// src/App.jsx
import { useState, useCallback } from 'react'
import './styles/global.css'
import Header from './components/Header'
import SemesterGrid from './components/SemesterGrid'
import SubjectGrid from './components/SubjectGrid'
import ProgramCard from './components/ProgramCard'
import AdminModal from './components/AdminModal'
import Toast from './components/Toast'
import { getSubjectsBySemester, getProgramsBySubject, deleteProgram } from './api'

export default function App() {
  // ─── State ────────────────────────────────────────────────────────
  const [activeSem, setActiveSem] = useState(null)
  const [activeSubject, setActiveSubject] = useState(null)

  const [subjects, setSubjects] = useState([])
  const [subjectsLoading, setSubjectsLoading] = useState(false)

  const [programs, setPrograms] = useState([])
  const [programsLoading, setProgramsLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [view, setView] = useState('semesters') // semesters | subjects | programs

  const [adminOpen, setAdminOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [creds, setCreds] = useState({ user: '', pass: '' })

  const [toasts, setToasts] = useState([])

  // ─── Toast ────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  // ─── Select Semester ──────────────────────────────────────────────
  async function selectSemester(sem) {
    setActiveSem(sem)
    setActiveSubject(null)
    setSubjects([])
    setPrograms([])
    setSearch('')
    setView('subjects')
    setSubjectsLoading(true)
    try {
      const data = await getSubjectsBySemester(sem)
      setSubjects(data.subjects || [])
    } catch {
      showToast('Could not connect to server. Is your backend running?', 'error')
      setSubjects([])
    } finally {
      setSubjectsLoading(false)
    }
  }

  // ─── Select Subject ───────────────────────────────────────────────
  async function selectSubject(subject) {
    setActiveSubject(subject)
    setPrograms([])
    setSearch('')
    setView('programs')
    setProgramsLoading(true)
    try {
      const data = await getProgramsBySubject(activeSem, subject)
      setPrograms(data.programs || [])
    } catch {
      showToast('Failed to load programs.', 'error')
    } finally {
      setProgramsLoading(false)
    }
  }

  // ─── Delete Program (admin) ───────────────────────────────────────
  async function handleDeleteProgram(id) {
    if (!window.confirm('Delete this program permanently?')) return
    try {
      await deleteProgram(creds.user, creds.pass, id)
      setPrograms(prev => prev.filter(p => p._id !== id))
      showToast('Program deleted.', 'success')
    } catch {
      showToast('Delete failed.', 'error')
    }
  }

  // ─── Refresh on upload ────────────────────────────────────────────
  async function handleRefresh() {
    if (activeSubject) await selectSubject(activeSubject)
    else if (activeSem) await selectSemester(activeSem)
  }

  // ─── Filtered Programs ────────────────────────────────────────────
  const filtered = programs.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    String(p.programNumber).includes(search)
  )

  // ─── Breadcrumb Nav ───────────────────────────────────────────────
  const SUFFIXES = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th']

  return (
    <div>
      <Header isAdmin={isAdmin} onAdminClick={() => setAdminOpen(true)} />

      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 45% at 12% 8%, rgba(139,92,246,0.11) 0%, transparent 60%),
          radial-gradient(ellipse 45% 40% at 88% 85%, rgba(6,182,212,0.08) 0%, transparent 60%)
        `,
      }} />

      <main style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '36px 0 52px', animation: 'fadeUp 0.6s ease 0.1s both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 16px',
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.28)',
            borderRadius: 999,
            fontSize: 11, fontWeight: 700, color: 'var(--cyan)',
            letterSpacing: 1.5, textTransform: 'uppercase',
            marginBottom: 22,
          }}>🎓 Computer Lab Portal</div>

          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 70px)',
            fontWeight: 800, lineHeight: 1.06,
            letterSpacing: -2, marginBottom: 16,
          }}>
            Lab Programs<br />
            <span style={{
              background: 'linear-gradient(90deg, var(--accent), var(--cyan), var(--pink))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Made Simple.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-dim)', maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
            Browse programs by semester and subject. Syntax-highlighted code with one-click copy.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 24, padding: '13px 20px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          marginBottom: 36,
          flexWrap: 'wrap',
          animation: 'fadeUp 0.5s ease 0.18s both',
        }}>
          {[
            { dot: 'var(--accent)', val: '8', lbl: 'Semesters' },
            { dot: 'var(--cyan)', val: subjects.length || '—', lbl: 'Subjects' },
            { dot: 'var(--pink)', val: programs.length || '—', lbl: 'Programs' },
          ].map(s => (
            <div key={s.lbl} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot }} />
              <span style={{ fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text)' }}>{s.val}</span>
              <span style={{ color: 'var(--text-muted)' }}>{s.lbl}</span>
            </div>
          ))}
        </div>

        {/* Semester Grid — always visible */}
        <SemesterGrid activeSem={activeSem} onSelect={selectSemester} />

        {/* Subjects */}
        {view === 'subjects' && (
          <SubjectGrid
            subjects={subjects}
            activeSem={activeSem}
            activeSubject={activeSubject}
            onSelect={selectSubject}
            loading={subjectsLoading}
          />
        )}

        {/* Programs */}
        {view === 'programs' && (
          <div style={{ animation: 'fadeUp 0.4s ease both' }}>
            {/* Programs Header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20, flexWrap: 'wrap', gap: 12,
            }}>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <span
                  style={{ color: 'var(--text-dim)', cursor: 'pointer', transition: 'color var(--transition)' }}
                  onClick={() => { setView('semesters'); setActiveSem(null); setActiveSubject(null) }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                >🏠 Home</span>
                <span style={{ color: 'var(--border)' }}>›</span>
                <span
                  style={{ color: 'var(--text-dim)', cursor: 'pointer', transition: 'color var(--transition)' }}
                  onClick={() => { setView('subjects'); setActiveSubject(null) }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
                >Sem {activeSem}{SUFFIXES[activeSem - 1]}</span>
                <span style={{ color: 'var(--border)' }}>›</span>
                <span style={{ color: 'var(--text)', fontWeight: 700 }}>{activeSubject}</span>
              </div>

              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '8px 13px',
                transition: 'border-color var(--transition)',
              }}>
                <span style={{ fontSize: 14 }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search programs…"
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    color: 'var(--text)', fontFamily: 'var(--sans)', fontSize: 13,
                    width: 180,
                  }}
                />
                {search && (
                  <span
                    style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}
                    onClick={() => setSearch('')}
                  >✕</span>
                )}
              </div>
            </div>

            {/* Count */}
            {!programsLoading && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, fontFamily: 'var(--mono)' }}>
                {filtered.length} program{filtered.length !== 1 ? 's' : ''}
                {search && ` matching "${search}"`}
              </div>
            )}

            {/* Loading skeletons */}
            {programsLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{
                    height: 64, borderRadius: 'var(--radius)',
                    background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
                    backgroundSize: '200% 100%',
                    animation: `shimmer 1.5s infinite, fadeUp 0.4s ease ${i * 0.06}s both`,
                  }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>📄</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 6 }}>
                  {search ? 'No matches found' : 'No Programs Yet'}
                </div>
                <div style={{ fontSize: 13 }}>
                  {search ? 'Try a different search term.' : 'Ask your admin to upload programs for this subject.'}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filtered.map((prog, i) => (
                  <ProgramCard
                    key={prog._id}
                    program={prog}
                    index={i}
                    isAdmin={isAdmin}
                    creds={creds}
                    onDelete={handleDeleteProgram}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Admin Modal */}
      <AdminModal
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        isAdmin={isAdmin}
        creds={creds}
        onLogin={(user, pass) => { setIsAdmin(true); setCreds({ user, pass }) }}
        onLogout={() => { setIsAdmin(false); setCreds({ user: '', pass: '' }) }}
        onRefresh={handleRefresh}
        showToast={showToast}
      />

      {/* Toasts */}
      <Toast toasts={toasts} removeToast={id => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  )
}
