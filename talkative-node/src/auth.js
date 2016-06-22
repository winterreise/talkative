'use strict';

const passport = require('koa-passport');
const creds = require('../creds');
const config = require('./config');
const request = require('request');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // TODO retrieve profile from db via id, and done(err, profile) - be sure to use err if there is one from the db
  done(null, id);
});


const GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.use(new GoogleStrategy({
    clientID: creds.google.clientId,
    clientSecret: creds.google.clientSecret,
    callbackURL: creds.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    // retrieve user ...
    console.dir(profile.id);
    let url = `${config.API_URL}/user/${profile.id}`;
    console.log(url);
    request.post(url, (err, response, body) => {
      console.dir(response);
    }).on('error', (e) => {
        console.log('Got error: ' + e.message);
     });
    done(null, profile);
  }
));
