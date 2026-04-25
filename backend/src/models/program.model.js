//src/models/program.model.js
const mongoose = require('mongoose');

const rgitxSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    programNumber: {
        type: Number,
        required: true
    },
    program: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
)

const rgitxModel = mongoose.model("Program", rgitxSchema);

module.exports = rgitxModel;