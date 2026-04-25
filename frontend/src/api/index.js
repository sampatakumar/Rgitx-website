// src/api/index.js
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

function authHeaders(user, pass) {
  return { username: user, password: pass }
}

export async function getSubjectsBySemester(semester) {
  const res = await fetch(`${BASE}/programs/semester/${semester}`)
  if (!res.ok) throw new Error('Failed to fetch subjects')
  return res.json()
}

export async function getProgramsBySubject(semester, subjectName) {
  const res = await fetch(`${BASE}/programs/semester/${semester}/${encodeURIComponent(subjectName)}`)
  if (!res.ok) throw new Error('Failed to fetch programs')
  return res.json()
}

export async function getAllPrograms(user, pass) {
  const res = await fetch(`${BASE}/admin/dashboard`, {
    headers: authHeaders(user, pass)
  })
  if (!res.ok) throw new Error('Auth failed')
  return res.json()
}

export async function uploadProgram(user, pass, payload) {
  const res = await fetch(`${BASE}/admin/upload/programs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(user, pass) },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}

export async function deleteProgram(user, pass, id) {
  const res = await fetch(`${BASE}/admin/delete/program/${id}`, {
    method: 'DELETE',
    headers: authHeaders(user, pass)
  })
  if (!res.ok) throw new Error('Delete failed')
  return res.json()
}

export async function editProgram(user, pass, id, payload) {
  const res = await fetch(`${BASE}/admin/edit/program/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders(user, pass) },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Edit failed')
  return res.json()
}
