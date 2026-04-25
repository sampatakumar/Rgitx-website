# RGITX Lab Portal — Frontend

A React + Vite frontend for the RGITX backend.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and set your backend URL:
# VITE_API_BASE=http://localhost:3000/api

# 3. Run dev server
npm run dev

# 4. Build for production
npm run build
```

## Project Structure

```
src/
├── api/          → All backend API calls (one file)
├── components/
│   ├── Header.jsx        → Top navbar with admin button
│   ├── SemesterGrid.jsx  → 8 semester selector cards
│   ├── SubjectGrid.jsx   → Dynamically loaded subject cards
│   ├── ProgramCard.jsx   → Expandable program with syntax highlight + copy
│   ├── AdminModal.jsx    → Login + Upload + Manage panel
│   └── Toast.jsx         → Toast notifications
├── styles/
│   └── global.css        → Design system, CSS variables, animations
├── App.jsx               → Main app logic & state
└── main.jsx              → Entry point
```

## Features

- ✅ 8 Semester cards — click to load subjects dynamically
- ✅ Subject cards auto-appear based on what's uploaded
- ✅ Syntax-highlighted code (C, Java, Python, SQL auto-detected)
- ✅ Copy button on header + full code footer button
- ✅ Live search/filter within a subject
- ✅ Breadcrumb navigation
- ✅ Admin login authenticated against your backend
- ✅ Upload programs via admin panel
- ✅ Delete programs via admin panel
- ✅ Auto-refresh view after admin actions
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Mobile responsive

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE` | Backend API URL (e.g. `http://localhost:3000/api`) |
