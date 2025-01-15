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

    let isPassword = bcrypt.compareSync(password, user.password);

    if (isPassword)
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

app.post('/signin', async (req, res) => {

    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    let salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);


    let result = sql.addUser(firstName, lastName, email, password, 0, 3);

    if (result === "Success")
    {
        let user = sql.getUser(email);

        req.session.loggedIn = true;
        req.session.userID = user.userID;
        req.session.role = user.role;

        req.session.save(() => {
            if (req.session.role === 1) {
                return res.redirect('/teacher');
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
});

