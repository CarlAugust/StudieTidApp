// Porpuse: Main file for the application

// Modules
const sql = require('./modules/sql.js');

// Express variables
const express = require("express");
const app = express();
const path = require('path')
const staticPath = path.join(__dirname, 'public');

const session = require('express-session');
app.use(session({
    secret: 'Keep it secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bcrypt
const bcrypt = require('bcrypt');


function checkLoggedIn(req, res, next)
{
    if (req.session && req.session.loggedIn)
    {
        next();
    }
    else
    {
        req.session.loggedIn = false;
        return res.redirect('/loginpage/');
    }
}

function checkAdmin(req, res, next)
{
    if (req.session.isAdmin === 1)
    {
        next();
    }
    else
    {
        res.redirect('/student');
    }
}

app.get("/", checkLoggedIn, (req, res) => {
    res.redirect('/student');
});

app.get('/student/*', checkLoggedIn, (req, res) => {
    console.log("user on student page");
    res.sendFile(path.join(__dirname, "/public/student"));
});  

app.get('/admin/*', checkLoggedIn, (req, res) => {
    console.log("user on admin page");
    res.sendFile(path.join(__dirname, "/public/admin"));
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

    let isPassword = bcrypt.compareSync(password, user.password);

    if (isPassword)
    {
        req.session.loggedIn = true;
        req.session.userID = user.userID;
        req.session.isAdmin = user.roleID;

        req.session.save(() => {
            if (req.session.isAdmin === 1) {
                return res.redirect('/admin');
            } else {   
                return res.redirect('/student');
            }
        });
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
        let user = sql.getUser(email);

        req.session.loggedIn = true;
        req.session.userID = user.userID;
        req.session.isAdmin = user.isAdmin;

        req.session.save(() => {
            if (req.session.isAdmin === 1) {
                return res.redirect('/admin');
            } else {   
                return res.redirect('/student');
            }
        });

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
    sql.addActivity(req.session.userID, subject, room);
    res.redirect('/student');
})

app.get('/getActivity', checkLoggedIn, (req, res) => {
    res.send(sql.getActivity(req.session.isAdmin, req.session.userID));

})

app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

