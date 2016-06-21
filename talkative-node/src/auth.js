'use strict';

const passport = require('koa-passport');

var user = { id: 1, username: 'test' }

passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log(id);
  done(null, id);
});

const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: '600680406767470',
    clientSecret: 'ab2b159cf0a51919ed9406a753330857',
    callbackURL: 'http://localhost:' + (process.env.PORT || 8080) + '/auth/facebook/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));

const TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy({
    consumerKey: 'HYQU2eZkD89TbS8qPtlXM6tZM',
    consumerSecret: 'DXO12sJBExqG69WYi3G9dC201gyMOXDcf7rIIENygGB90G9eEX',
    callbackURL: 'http://localhost:' + (process.env.PORT || 8080) + '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));

const GoogleStrategy = require('passport-google-auth').Strategy;
passport.use(new GoogleStrategy({
    clientId: '153427664156-2feen2b5tdu0hkcea6jlsb0s0h6listk.apps.googleusercontent.com',
    clientSecret: 'bXEp_2YxBTCQr4WMOdtIh0xt',
    callbackURL: 'http://localhost:' + (process.env.PORT || 8080) + '/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, user);
  }
));
