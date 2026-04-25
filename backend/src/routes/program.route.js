// src/routes/program.route.js
const express = require('express')
const router = express.Router();

// import controller
const programController = require('../controllers/program.controller')

// import middleware
const adminMiddleware = require('../middlewares/admin.middleware')

// ─── Public Routes (Normal User) ─────────────────────────────────────────────
router.get('/programs/semester/:semester', programController.getSubjectsBySemester)
router.get('/programs/semester/:semester/:subjectName', programController.getPrograms)

// ─── Admin Protected Routes ───────────────────────────────────────────────────
router.get('/admin/dashboard', adminMiddleware, programController.getAllPrograms)
router.post('/admin/upload/programs', adminMiddleware, programController.uploadPrograms)
router.put('/admin/edit/program/:id', adminMiddleware, programController.editProgram)
router.delete('/admin/delete/program/:id', adminMiddleware, programController.deleteProgram)

module.exports = router;