// Porpuse: Main file for the application

// Modules
import * as sql from './modules/sql.js';
import * as fileparser from './modules/fileparser.js';
import { checkLoggedIn, checkAdmin, checkTeacher } from './modules/middleware.js';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './config.js';

// Node imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { configDotenv } from 'dotenv';
import GoogleStrategy from 'passport-google-oauth20';
import passport from 'passport';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


configDotenv();
const SECRET = process.env.SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    if (!(profile.emails && profile.emails.length > 0))
    {
        return cb(null, false);
    }

    const user = sql.getUser(profile.emails[0].value);

    if (user !== undefined)
    {
        req.session.loggedIn = true;
        req.session.userID = user.userID;
        req.session.role = user.roleID;

        return cb(null, user);
    }
    else
    {
        return cb(null, false);
    }
  }
));

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

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
  
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
);

app.get("/", checkLoggedIn, (req, res) => {
    if (req.session.role === 1) {
        res.redirect('/admin');
    } else if (req.session.role === 2) {
        res.redirect('/teacher');
    } else {
        res.redirect('/student');
    }
});

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
    res.send(sql.getActivity(req.session.userID));
});

// Login routes

app.post('/login', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    let user = sql.getUser(email);

    if (user === undefined)
    {
        res.redirect('/loginpage');
        return;
    }

    if (password === user.password)
    {
        req.session.loggedIn = true;
        req.session.userID = user.userID;
        req.session.role = user.roleID;

        req.session.save(() => {
            if (req.session.role === 1) {
                return res.redirect('/admin');
            }
            else if (req.session.role === 2) {
                return res.redirect('/teacher');
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
    sql.addActivity(req.session.userID, subject, room);
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

