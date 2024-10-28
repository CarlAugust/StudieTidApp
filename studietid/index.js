// Porpuse: Main file for the application

// Modules
import * as sql from './modules/sql.js';
import { checkLoggedIn, checkAdmin } from './modules/middleware.js';

// Node imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import bcrypt from 'bcrypt';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(session({
    secret: 'Keep it secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}));

const staticPath = path.join(__dirname, 'public');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", checkLoggedIn, (req, res) => {
    res.redirect('/student');
});

app.get('/student/*', checkLoggedIn, (req, res) => {
    console.log("user on student page");
    res.sendFile(path.join(__dirname, "/public/student"));
});  

app.get('/admin/*', checkLoggedIn, checkAdmin, (req, res) => {
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
        req.session.role = user.roleID;

        req.session.save(() => {
            if (req.session.role === 1) {
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
    res.send(sql.getActivity(req.session.role, req.session.userID));

})

app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

