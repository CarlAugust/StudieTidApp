
// Express variables
const express = require("express");
const app = express();
const session = require('express-session');
const path = require('path').join(__dirname, 'public');

// Modules
const sql = require('./scripts/sql.js');

// Defualt path
app.use(express.static(path));


app.get("/", function (req, res) {
    res.redirect(__dirname + '/index.html');
});

app.listen(3000, function () {
    console.log('Server is running on http://localhost:3000');
});