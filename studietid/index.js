// Porpuse: Main file for the application

// Modules
import * as sql from './modules/sql.js';
import * as fileparser from './modules/fileparser.js';
import { checkLoggedIn, checkAdmin, checkTeacher } from './modules/middleware.js';

// Node imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { configDotenv } from 'dotenv';

import passport from './modules/passport.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv();
const SECRET = process.env.SECRET;

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

const staticPath = path.join(__dirname, 'public');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Page routes

app.get("/", checkLoggedIn, (req, res) => {
    if (req.session.passport.user.roleID === 1) {
        res.redirect('/admin');
    } else if (req.session.passport.user.roleID === 2) {
        res.redirect('/teacher');
    } else {
        res.redirect('/student');
    }
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
  
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    }
);

app.get('/student/*', checkLoggedIn, (req, res) => {
    console.log("user on student page");
    res.sendFile(path.join(__dirname, "/public/student"));
});  

app.get('/teacher/*', checkLoggedIn, checkTeacher, (req, res) => {
    console.log("user on teacher page");
    res.sendFile(path.join(__dirname, "/public/teacher"));
});

app.get('/admin/*', checkLoggedIn, checkAdmin, (req, res) => {
    console.log("user on admin page");
    res.sendFile(path.join(__dirname, "/public/admin"));
});

// API routes 

app.get('/getUsers', checkLoggedIn, checkTeacher, (req, res) => {res.send(sql.getUsers());});
app.get('/getSubjects', checkLoggedIn, (req, res) => {res.send(sql.getSubjects());});
app.get('/getRooms', checkLoggedIn, (req, res) => {res.send(sql.getRooms());});

app.get('/getActivities', checkLoggedIn, checkTeacher, (req, res) => {
    res.send(sql.getActivities());
})

app.get('/getActivity', checkLoggedIn, (req, res) => {
    res.send(sql.getActivity(req.session.passport.user.userID));
});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/loginpage');
});

// Client add routes

app.post('/addActivity', checkLoggedIn, (req, res) => {
    const room = req.body.room;
    const subject = req.body.subject;
    

    if (room === "" || subject === "")
    {
        res.redirect('/student');
        return;
    }
    sql.addActivity(req.session.passport.user.userId, subject, room);
    res.redirect('/student');
})

// Teacher activity routes

app.get('/approveActivity', checkLoggedIn, checkTeacher, (req, res) => {
    sql.approveActivity(req.query.id);
    res.send("Success");
});

app.get('/denyActivity', checkLoggedIn, checkTeacher, (req, res) => {
    sql.denyActivity(req.query.id);
    res.send("Success");
}); 

app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    sql.initializeDatabase();
    sql.updateSubjectClassRelations();
    sql.updateUsers();
});

