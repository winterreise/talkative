'use strict';

const config = require('./config');
const koa = require('koa');
const app = koa();
const koaPg = require('koa-pg');
const jsonResp = require('koa-json-response');
const route = require('koa-route');
const body = require('koa-better-body');

// APP CONFIG

// trust proxy
app.proxy = true;

// sessions
let session = require('koa-generic-session');
app.keys = ['your-session-secret'];
app.use(session());

// body parser
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// authentication
require('./auth');
const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());


app
  .use(jsonResp())
  .use(body())
  .use(koaPg(config.DATABASE_URL))
  .listen(8080);

// REQUIRE CONTROLLERS

const User = require('./controllers/users');
const Prompt = require('./controllers/prompts');
const Burst = require('./controllers/bursts');

/// ROUTES

// API BASE ROUTE
app.use(route.get('/api/v1/', function * () {
  return this.jsonResp(200, 'Welcome to the Talkative API');
}));


// PROMPT ROUTES

const prompt = new Prompt();
// ALL PROMPTS INDEX
app.use(route.get('/api/v1/prompts/', prompt.all));
// NEWS PROMPTS INDEX
app.use(route.get('/api/v1/prompts/news/', prompt.news));
// ENTERTAINMENT PROMPTS INDEX
app.use(route.get('/api/v1/prompts/entertainment/', prompt.entertainment));
// FACTS PROMPTS INDEX
app.use(route.get('/api/v1/prompts/facts/', prompt.facts));
// PROMPT SHOW (:id)
app.use(route.get('/api/v1/prompts/:id', prompt.show));


// BURST ROUTES

const burst = new Burst();
// ALL BURSTS INDEX
app.use(route.get('/api/v1/bursts/', burst.all));
// SENT BURSTS INDEX FOR USER (:userId)
app.use(route.get('/api/v1/bursts/:userId/sent/', burst.sent));
// UNSENT BURSTS INDEX FOR USER (:userId)
app.use(route.get('/api/v1/bursts/:userId/unsent/', burst.unsent));
// BURST SHOW (:userId)
app.use(route.get('/api/v1/bursts/:userId/', burst.show));



// USER ROUTES

const user = new User();
// ALL USERS INDEX
app.use(route.get('/api/v1/users/', user.all));
// ACTIVE USERS INDEX
app.use(route.get('/api/v1/users/active', user.active));
// INACTIVE USERS INDEX
app.use(route.get('/api/v1/users/inactive', user.inactive));
// UPDATE USER (:id)
app.use(route.post('/api/v1/users/:id', user.update));
// USER SHOW (:id)
app.use(route.get('/api/v1/users/:id', user.show));


// AUTHENTICATION
app.use(route.get('/api/v1/checkauthentication', function*(next) {
  if (this.isAuthenticated()) {
    return this.jsonResp(200, 'Success');
  } else {
    return this.jsonResp(401, 'Unauthorized');
  }
}));


// append view renderer
var views = require('koa-render');
app.use(views('./views', {
  map: { html: 'handlebars' },
  cache: false
}));

// public routes
const Router = require('koa-router');

const publicRoutes = new Router();

publicRoutes.get('/', function*() {
  this.body = yield this.render('login');
});


// POST /login
publicRoutes.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
);

publicRoutes.get('/logout', function*(next) {
  this.logout();
  this.redirect('/');
});

publicRoutes.get('/auth/facebook',
  passport.authenticate('facebook')
);

publicRoutes.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/#/dashboard',
    failureRedirect: '/'
  })
);

publicRoutes.get('/auth/twitter',
  passport.authenticate('twitter')
);

publicRoutes.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/#/dashboard',
    failureRedirect: '/'
  })
);

publicRoutes.get('/auth/google',
  passport.authenticate('google')
);

publicRoutes.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/#/dashboard',
    failureRedirect: '/'
  })
);

app.use(publicRoutes.middleware());

// Require authentication for now
app.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.redirect('/');
  }
});

const secured = new Router();

secured.get('/app', function*() {
  this.body = yield this.render('app');
});

app.use(secured.middleware());
