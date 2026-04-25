// src/components/AdminModal.jsx
import { useState } from 'react'
import { getAllPrograms as apiGetAll, uploadProgram as apiUpload, deleteProgram as apiDelete } from '../api'

const INPUT_STYLE = {
  width: '100%',
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  fontSize: 13,
  padding: '10px 13px',
  outline: 'none',
  transition: 'border-color var(--transition)',
}

function Input({ style, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      style={{ ...INPUT_STYLE, borderColor: focused ? 'var(--accent)' : 'var(--border)', ...style }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

function Textarea({ ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      {...props}
      style={{
        ...INPUT_STYLE,
        fontFamily: 'var(--mono)',
        fontSize: 12,
        minHeight: 150,
        resize: 'vertical',
        borderColor: focused ? 'var(--accent)' : 'var(--border)',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

function Select({ children, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      {...props}
      style={{ ...INPUT_STYLE, borderColor: focused ? 'var(--accent)' : 'var(--border)', cursor: 'pointer' }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  )
}

function Label({ children }) {
  return (
    <label style={{
      display: 'block', fontSize: 11, fontWeight: 700,
      color: 'var(--text-dim)', letterSpacing: 0.8,
      textTransform: 'uppercase', marginBottom: 7,
    }}>{children}</label>
  )
}

export default function AdminModal({ open, onClose, isAdmin, creds, onLogin, onLogout, onRefresh, showToast }) {
  const [tab, setTab] = useState('upload') // upload | manage | login
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const [uploadForm, setUploadForm] = useState({
    semester: '', subjectName: '', title: '', programNumber: '', program: ''
  })
  const [uploadLoading, setUploadLoading] = useState(false)

  const [managePrograms, setManagePrograms] = useState([])
  const [manageSem, setManageSem] = useState('')
  const [manageLoading, setManageLoading] = useState(false)

  if (!open) return null

  // ─── Login ───────────────────────────────────────────────────────
  async function handleLogin() {
    setLoginError('')
    if (!loginForm.username || !loginForm.password) {
      setLoginError('Please enter both fields.'); return
    }
    setLoginLoading(true)
    try {
      await apiGetAll(loginForm.username, loginForm.password)
      onLogin(loginForm.username, loginForm.password)
      setLoginError('')
    } catch {
      setLoginError('Invalid credentials. Access denied.')
    } finally {
      setLoginLoading(false)
    }
  }

  // ─── Upload ──────────────────────────────────────────────────────
  async function handleUpload() {
    const { semester, subjectName, title, programNumber, program } = uploadForm
    if (!semester || !subjectName || !title || !programNumber || !program) {
      showToast('Please fill all fields.', 'error'); return
    }
    setUploadLoading(true)
    try {
      await apiUpload(creds.user, creds.pass, {
        semester: Number(semester),
        subjectName: subjectName.trim(),
        title: title.trim(),
        programNumber: Number(programNumber),
        program: program.trim(),
      })
      showToast('Program uploaded!', 'success')
      setUploadForm({ semester: '', subjectName: '', title: '', programNumber: '', program: '' })
      onRefresh()
    } catch {
      showToast('Upload failed.', 'error')
    } finally {
      setUploadLoading(false)
    }
  }

  // ─── Manage load ─────────────────────────────────────────────────
  async function handleLoadManage(sem) {
    setManageSem(sem)
    if (!sem) { setManagePrograms([]); return }
    setManageLoading(true)
    try {
      const data = await apiGetAll(creds.user, creds.pass)
      setManagePrograms((data.programs || []).filter(p => String(p.semester) === sem))
    } catch {
      showToast('Could not load programs.', 'error')
    } finally {
      setManageLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this program permanently?')) return
    try {
      await apiDelete(creds.user, creds.pass, id)
      showToast('Deleted.', 'success')
      handleLoadManage(manageSem)
      onRefresh()
    } catch {
      showToast('Delete failed.', 'error')
    }
  }

  const semOptions = [1,2,3,4,5,6,7,8].map(n => (
    <option key={n} value={n}>{n}{['st','nd','rd','th','th','th','th','th'][n-1]} Semester</option>
  ))

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(10px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-accent)',
        borderRadius: 22,
        padding: 36,
        maxWidth: 500,
        width: '100%',
        animation: 'scaleIn 0.25s ease',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 8, cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 16,
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#ef4444' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >✕</button>

        {!isAdmin ? (
          /* ─── Login Form ─── */
          <>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Admin Access</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 26 }}>Enter credentials to manage programs.</div>

            <div style={{ marginBottom: 14 }}>
              <Label>Username</Label>
              <Input
                type="text" placeholder="admin username"
                value={loginForm.username}
                onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <Label>Password</Label>
              <Input
                type="password" placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {loginError && (
              <div style={{
                padding: '10px 14px', marginBottom: 16,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8, fontSize: 13, color: '#f87171',
              }}>{loginError}</div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={handleLogin}
                disabled={loginLoading}
                style={{
                  flex: 1, padding: '11px',
                  background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
                  color: 'white', border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  opacity: loginLoading ? 0.7 : 1,
                }}
              >{loginLoading ? 'Signing in…' : 'Sign In →'}</button>
              <button onClick={onClose} style={{
                padding: '11px 18px',
                background: 'var(--surface2)', color: 'var(--text-muted)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
            </div>
          </>
        ) : (
          /* ─── Admin Panel ─── */
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Admin Panel</div>
              <div style={{
                padding: '3px 10px', background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 999, fontSize: 11, fontWeight: 700,
                color: 'var(--green)',
              }}>● Logged In</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 22 }}>
              Upload and manage lab programs.
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: 4,
              background: 'var(--bg)', borderRadius: 10,
              padding: 4, marginBottom: 24,
            }}>
              {['upload', 'manage'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: '8px',
                  textAlign: 'center', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', borderRadius: 7,
                  border: 'none',
                  background: tab === t ? 'var(--accent)' : 'transparent',
                  color: tab === t ? 'white' : 'var(--text-muted)',
                  transition: 'all var(--transition)',
                  textTransform: 'capitalize',
                }}>{t}</button>
              ))}
            </div>

            {/* Upload Tab */}
            {tab === 'upload' && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <Label>Semester</Label>
                    <Select value={uploadForm.semester} onChange={e => setUploadForm(f => ({ ...f, semester: e.target.value }))}>
                      <option value="">Select</option>
                      {semOptions}
                    </Select>
                  </div>
                  <div>
                    <Label>Program No.</Label>
                    <Input type="number" placeholder="1"
                      value={uploadForm.programNumber}
                      onChange={e => setUploadForm(f => ({ ...f, programNumber: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <Label>Subject Name</Label>
                  <Input placeholder="e.g. Data Structures"
                    value={uploadForm.subjectName}
                    onChange={e => setUploadForm(f => ({ ...f, subjectName: e.target.value }))}
                  />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <Label>Program Title</Label>
                  <Input placeholder="e.g. Implement Stack using Array"
                    value={uploadForm.title}
                    onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <Label>Program Code</Label>
                  <Textarea placeholder="Paste your code here..."
                    value={uploadForm.program}
                    onChange={e => setUploadForm(f => ({ ...f, program: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleUpload} disabled={uploadLoading} style={{
                    flex: 1, padding: '11px',
                    background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
                    color: 'white', border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    opacity: uploadLoading ? 0.7 : 1,
                  }}>{uploadLoading ? 'Uploading…' : '⬆ Upload Program'}</button>
                  <button onClick={() => { onLogout(); onClose() }} style={{
                    padding: '11px 16px',
                    background: 'var(--surface2)', color: 'var(--text-muted)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>Logout</button>
                </div>
              </div>
            )}

            {/* Manage Tab */}
            {tab === 'manage' && (
              <div style={{ animation: 'fadeIn 0.2s ease' }}>
                <div style={{ marginBottom: 14 }}>
                  <Label>Filter by Semester</Label>
                  <Select value={manageSem} onChange={e => handleLoadManage(e.target.value)}>
                    <option value="">Select semester</option>
                    {semOptions}
                  </Select>
                </div>

                <div style={{ maxHeight: 340, overflowY: 'auto', paddingRight: 2 }}>
                  {manageLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>Loading…</div>
                  ) : !manageSem ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>Select a semester above</div>
                  ) : !managePrograms.length ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>No programs in this semester.</div>
                  ) : managePrograms.map(p => (
                    <div key={p._id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 13px', marginBottom: 8,
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                          {p.subjectName} · #{p.programNumber}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(p._id)} style={{
                        width: 30, height: 30, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444', borderRadius: 7,
                        cursor: 'pointer', fontSize: 14,
                      }}>🗑</button>
                    </div>
                  ))}
                </div>

                <button onClick={() => { onLogout(); onClose() }} style={{
                  width: '100%', padding: '10px', marginTop: 16,
                  background: 'var(--surface2)', color: 'var(--text-muted)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>Logout</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
