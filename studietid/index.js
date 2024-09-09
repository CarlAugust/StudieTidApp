// Porpuse: Main file for the application

// Express variables
const express = require("express");
const app = express();
const session = require('express-session');
const path = require('path').join(__dirname, 'public');

// Modules
const sql = require('./modules/sql.js');

// Defualt path
app.use(express.static(path));


app.get("/", (req, res) => {
    res.redirect('/index.html');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

app.get('/getUsers', (req, res) => {
    res.send(sql.getUsers());
});