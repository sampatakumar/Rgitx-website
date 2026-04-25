// src/controllers/program.controller.js
const rgitxModel = require('../models/program.model')

// Upload programs for a particular subject and semester for Admin user
async function uploadPrograms(req, res) {
    try {
        const { title, semester, subjectName, program, programNumber } = req.body;

        const programs = await rgitxModel.create({
            title: title,
            semester: semester,
            subjectName: subjectName,
            programNumber: programNumber,
            program: program,
        })

        res.status(201).json({ message: "Program uploaded successfully", programs })
    } catch (error) {
        return res.status(400).json({ message: "Program upload failed" })
    }
}

// Edit a program by id for Admin user
async function editProgram(req, res) {
    try {
        const { id } = req.params;
        const { title, semester, subjectName, program, programNumber } = req.body;

        const updatedProgram = await rgitxModel.findByIdAndUpdate(
            id,
            {
                title: title,
                semester: semester,
                subjectName: subjectName,
                programNumber: programNumber,
                program: program,
            },
            { new: true }
        )

        if (!updatedProgram) {
            return res.status(404).json({ message: "Program not found" })
        }

        res.status(200).json({ message: "Program updated successfully", updatedProgram })
    } catch (error) {
        return res.status(400).json({ message: "Program update failed" })
    }
}

// Delete a program by id for Admin user
async function deleteProgram(req, res) {
    try {
        const { id } = req.params;

        const deletedProgram = await rgitxModel.findByIdAndDelete(id)

        if (!deletedProgram) {
            return res.status(404).json({ message: "Program not found" })
        }

        res.status(200).json({ message: "Program deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "server error" })
    }
}

// Get all programs for Admin dashboard
async function getAllPrograms(req, res) {
    try {
        const programs = await rgitxModel.find({}).sort({ semester: 1, subjectName: 1, programNumber: 1 });

        res.status(200).json({ message: "Programs retrieved successfully", programs })
    } catch (error) {
        return res.status(500).json({ message: "server error" })
    }
}

// Step 1 - User selects semester --> get all subjects of that semester
async function getSubjectsBySemester(req, res) {
    try {
        const { semester } = req.params;

        const subjects = await rgitxModel.find({ semester: semester }).distinct('subjectName');

        res.status(200).json({ message: "Subjects retrieved successfully", subjects })
    } catch (error) {
        return res.status(500).json({ message: "server error" })
    }
}

// Step 2 - User selects subject --> get all programs of that subject and semester in ascending order of programNumber
async function getPrograms(req, res) {
    try {
        const { semester, subjectName } = req.params;

        const programs = await rgitxModel.find({
            semester: semester,
            subjectName: subjectName
        }).sort({ programNumber: 1 });

        res.status(200).json({ message: "Programs retrieved successfully", programs })
    } catch (error) {
        return res.status(500).json({ message: "server error" })
    }
}

module.exports = { uploadPrograms, editProgram, deleteProgram, getAllPrograms, getSubjectsBySemester, getPrograms }