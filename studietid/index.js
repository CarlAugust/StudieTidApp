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


function checkLoggedIn(req, res, next)
{
    console.log(req.session);
    if (req.session && req.session.loggedIn)
    {
        console.log('Logged in');
        next();
    }
    else
    {
        req.session.loggedIn = false;
        res.redirect('/loginpage');
    }
}

app.get("/", checkLoggedIn, (req, res) => {
    res.redirect('/student');
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
        res.redirect('/loginpage');
        return;
    }

    console.log(user.password);
    console.log(req.body.password);

    let isPassword = bcrypt.compareSync(password, user.password);

    console.log(isPassword);

    if (isPassword)
    {
        req.session.loggedIn = true;
        req.session.id = user.userID;
        res.redirect('/student');
    }
    else
    {
        res.redirect('/loginpage?error=Invalid');
    }
});

app.get('/getUsers', checkLoggedIn, (req, res) => {res.send(sql.getUsers());});
app.get('/getSubjects', checkLoggedIn, (req, res) => {res.send(sql.getSubjects());});
app.get('/getRooms', checkLoggedIn, (req, res) => {res.send(sql.getRooms());});

app.post('/signin', async (req, res) => {

    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);

    let result = sql.addUser(firstName, lastName, email, password, 0, 3);

    if (result === "Success")
    {
        res.redirect('/student');
    }
    else if (result === "Invalid")
    {
        res.redirect('/loginpage');
    }
    else
    {
        res.redirect('/loginpage');
    }
});

app.post('/addActivity', checkLoggedIn, (req, res) => {
    const room = req.body.room;
    const subject = req.body.subject;

    if (room === "" || subject === "")
    {
        res.redirect('/student');
        return;
    }

    // Temporary user id 1
    sql.addActivity(1, subject, room);
    res.redirect('/student');
})

app.get('/getActivity', checkLoggedIn, (req, res) => {
    // Temporary admin and id
    let admin = true;
    let id = 1;

    res.send(sql.getActivity(admin, id));
})