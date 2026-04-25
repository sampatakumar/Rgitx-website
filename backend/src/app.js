//creating an server using express
//src/app.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./db/db')
const programRoutes = require('./routes/program.route')

const dns = require('node:dns/promises');
dns.setServers(["1.1.1.1", "1.0.0.1"]);



// Middleware
app.use(cors({
    origin: ['https://rgitx.vercel.app', 'http://localhost:5173']
}));
app.use(express.json());
connectDB();


// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the RGITX website backend!');
});



app.use("/api", programRoutes)

module.exports = app;