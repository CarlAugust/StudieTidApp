

import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import MicrosoftStrategy from 'passport-microsoft';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config.js';
import * as sql from './sql.js';

function checkIfUserIsValid(accessToken, refreshToken, profile, cb) 
{
    if (!(profile.emails && profile.emails.length > 0))
        {
            return cb(null, false);
        }
    
        const user = sql.getUser(profile.emails[0].value);
    
        if (user !== undefined)
        {
            return cb(null, user);
        }
        else
        {
            console.log("User not found: " + profile.emails[0].value);
            return cb(null, false);
        }
}


passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return checkIfUserIsValid(accessToken, refreshToken, profile, cb);
  }
));

export default passport;