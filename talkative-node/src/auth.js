const passport = require('koa-passport');

const testUser = { id: 1, username: 'test' };

passport.serializeUser(function(user, done) {
  done(null, testUser.id);
});

passport.deserializeUser(function(id, done) {
  done(null, testUser);
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(function(username, password, done) {
  // retrieve user ...
  if (username === 'test' && password === 'test') {
    done(null, testUser);
  } else {
    done(null, false);
  }
}));

const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
    clientID: '600680406767470',
    clientSecret: 'ab2b159cf0a51919ed9406a753330857',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, testUser);
  }
));

const TwitterStrategy = require('passport-twitter').Strategy;
passport.use(new TwitterStrategy({
    consumerKey: 'HYQU2eZkD89TbS8qPtlXM6tZM',
    consumerSecret: 'DXO12sJBExqG69WYi3G9dC201gyMOXDcf7rIIENygGB90G9eEX',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, testUser);
  }
));

const GoogleStrategy = require('passport-google-auth').Strategy;
passport.use(new GoogleStrategy({
    clientId: '153427664156-2feen2b5tdu0hkcea6jlsb0s0h6listk.apps.googleusercontent.com',
    clientSecret: 'bXEp_2YxBTCQr4WMOdtIh0xt',
    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    // retrieve user ...
    done(null, testUser);
  }
));
