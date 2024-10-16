// Porpuse: Main file for the application

// Express variables
const express = require("express");
const app = express();
const path = require('path').join(__dirname, 'public');

const session = require('express-session');
app.use(session({
    secret: 'Keep it secret',
    resave: false,
    saveUninitialized: false
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bcrypt
const bcrypt = require('bcrypt');

// Modules
const sql = require('./modules/sql.js');


function checkUser(req, res, next)
{
    if (req.session && req.session.loggedIn)
    {
        next();
    }
    else
    {
        res.redirect('/login.html');
    }
}

app.get("/", checkUser, (req, res) => {
    res.redirect('/index.html');
});

app.use(express.static(path));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

app.post('/login', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    let user = sql.getUser(email);

    if (user === undefined)
    {
        res.redirect('/login.html');
        return;
    }

    console.log(user.password);
    console.log(req.body.password);

    let isPassword = bcrypt.compareSync(password, user.password);

    console.log(isPassword);

    if (isPassword)
    {
        res.redirect('/index.html');
    }
    else
    {
        res.redirect('/login.html');
    }
});

app.get('/getUsers', (req, res) => {res.send(sql.getUsers());});
app.get('/getSubjects', (req, res) => {res.send(sql.getSubjects());});
app.get('/getRooms', (req, res) => {res.send(sql.getRooms());});

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

    if (room === "" || subject === "")
    {
        res.redirect('/index.html?error=emptyfields');
        return;
    }

    // Temporary user id 1
    sql.addActivity(1, subject, room);
    res.redirect('/index.html?error=none');
})

app.get('/getActivity', (req, res) => {
    // Temporary admin and id
    let admin = true;
    let id = 1;

    res.send(sql.getActivity(admin, id));
})