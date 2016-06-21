'use strict';

const passport = require('koa-passport');
const creds = require('../creds');

passport.serializeUser(function(user, done) {
  // TODO do nothing
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // TODO retrieve profile from db via id, and done(err, profile) - be sure to use err if there is one from the db
  done(null, id);
});

// const FacebookStrategy = require('passport-facebook').Strategy;
// passport.use(new FacebookStrategy({
//     clientID: '600680406767470',
//     clientSecret: 'ab2b159cf0a51919ed9406a753330857',
//     callbackURL: 'http://localhost:' + (process.env.PORT || 8080) + '/auth/facebook/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     done(null, user);
//   }
// ));
//
// const TwitterStrategy = require('passport-twitter').Strategy;
// passport.use(new TwitterStrategy({
//     consumerKey: 'HYQU2eZkD89TbS8qPtlXM6tZM',
//     consumerSecret: 'DXO12sJBExqG69WYi3G9dC201gyMOXDcf7rIIENygGB90G9eEX',
//     callbackURL: 'http://localhost:' + (process.env.PORT || 8080) + '/auth/twitter/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//     // retrieve user ...
//     done(null, user);
//   }
// ));

const GoogleStrategy = require('passport-google-oauth2').Strategy;
passport.use(new GoogleStrategy({
    clientID: creds.google.clientId,
    clientSecret: creds.google.clientSecret,
    callbackURL: creds.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    // retrieve user ...
    // TODO insert profile into db with id
    done(null, profile);
  }
));
