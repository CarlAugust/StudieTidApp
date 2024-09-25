// Porpuse: Main file for the application

// Express variables
const express = require("express");
const app = express();
const session = require('express-session');
const path = require('path').join(__dirname, 'public');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/getSubjects', (req, res) => {
    res.send(sql.getSubjects());
});

app.get('/getRooms', (req, res) => {
    res.send(sql.getRooms());
});

app.post('/addUser', (req, res) => {

    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    let result = sql.addUser(firstName, lastName, email, 0, 3);

    if (result === "Success")
    {
        res.redirect('/index.html?error=none');
    }
    else if (result === "Invalid")
    {
        res.redirect('/index.html?error=invalidemail');
    }
    else
    {
        res.redirect('/index.html?error=emailinuse');
    }
});

app.post('/addActivity', (req, res) => {
    const room = req.body.room;
    const subject = req.body.subject;

    // Temporary user id 1
    sql.addActivity(1, subject, room);
})