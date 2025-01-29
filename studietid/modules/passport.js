

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

// passport.use(new MicrosoftStrategy({
//     // Standard OAuth2 options
//     clientID: 'applicationidfrommicrosoft',
//     clientSecret: 'applicationsecretfrommicrosoft',
//     callbackURL: "http://localhost:3000/auth/microsoft/callback",
//     scope: ['user.read'],

//     // Microsoft specific options

//     // [Optional] The tenant ID for the application. Defaults to 'common'. 
//     // Used to construct the authorizationURL and tokenURL
//     tenant: 'common',

//     // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
//     authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',

//     // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
//     tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',

//     // [Optional] The Microsoft Graph API version (e.g., 'v1.0', 'beta'). Defaults to 'v1.0'.
//     graphApiVersion: 'v1.0',

//     // [Optional] If true, will push the User Principal Name into the `emails` array in the Passport.js profile. Defaults to false.
//     addUPNAsEmail: false,
    
//     // [Optional] The Microsoft Graph API Entry Point, defaults to https://graph.microsoft.com. Configure this if you are using Azure China or other regional version.
//     apiEntryPoint: 'https://graph.microsoft.com',
//   },
//   function(accessToken, refreshToken, profile, done) {
//     return checkIfUserIsValid(accessToken, refreshToken, profile, done);
//   }
// ));

export default passport;