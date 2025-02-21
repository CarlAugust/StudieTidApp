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
import { google } from "googleapis";

// import passport from './modules/passport.js';

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

// app.get('/auth/google',
//     passport.authenticate('google', { scope: ['profile', 'email'] }));
  
// app.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function(req, res) {
//       res.redirect('/');
//     }
// );

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET_ID,
    process.env.REDIRECT
  );
  
  // Route to initiate Google OAuth2 flow
  app.get('/auth/google', (req, res) => {
    // Generate the Google authentication URL
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Request offline access to receive a refresh token
      scope: 'https://www.googleapis.com/auth/calendar.readonly' // Scope for read-only access to the calendar
    });
    // Redirect the user to Google's OAuth 2.0 server
    res.redirect(url);
  });
  
  // Route to handle the OAuth2 callback
  app.get('/auth/google/callback', (req, res) => {
    // Extract the code from the query parameter
    const code = req.query.code;
    // Exchange the code for tokens
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        // Handle error if token exchange fails
        console.error('Couldn\'t get token', err);
        res.send('Error');
        return;
      }
      // Set the credentials for the Google API client
      oauth2Client.setCredentials(tokens);
      // Notify the user of a successful login
      res.send('Successfully logged in');
    });
  });
  
  // Route to list all calendars
  app.get('/calendars', (req, res) => {
    // Create a Google Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // List all calendars
    calendar.calendarList.list({}, (err, response) => {
      if (err) {
        // Handle error if the API request fails
        console.error('Error fetching calendars', err);
        res.end('Error!');
        return;
      }
      // Send the list of calendars as JSON
      const calendars = response.data.items;
      res.json(calendars);
    });
  });
  
  // Route to list events from a specified calendar
  app.get('/events', (req, res) => {
    // Get the calendar ID from the query string, default to 'primary'
    const calendarId = req.query.calendar ?? 'primary';
    // Create a Google Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // List events from the specified calendar
    calendar.events.list({
      calendarId,
      timeMin: (new Date()).toISOString(),
      maxResults: 15,
      singleEvents: true,
      orderBy: 'startTime'
    }, (err, response) => {
      if (err) {
        // Handle error if the API request fails
        console.error('Can\'t fetch events');
        res.send('Error');
        return;
      }
      // Send the list of events as JSON
      const events = response.data.items;
      res.json(events);
    });
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
    sql.addActivity(req.session.passport.user.userID, subject, room);
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


// Resource routes

app.get('/fetchImage', checkLoggedIn, (req, res) => {
    const imageId = sql.getImageId(req.session.passport.user.userID).imageId;
    res.sendFile(path.join(__dirname, `/userimages/${imageId}.jpg`));
})

app.use(express.static(staticPath));
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    sql.initializeDatabase();
    sql.updateSubjectClassRelations();
    sql.updateUsers();
});

