'use strict';

const body = require('koa-better-body');
const config = require('./config');
const jsonResp = require('koa-json-response');
const koa = require('koa');
const koaPg = require('koa-pg');
const Router = require('koa-router');
const twilio = require('twilio');

// APP CONFIG
const app = koa();

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
  .use(function*(next) {
    console.log(this.req.url);
    yield next;
  })
  .use(jsonResp())
  .use(koaPg(config.DATABASE_URL))
  .listen(process.env.PORT || 8080);

// REQUIRE CONTROLLERS

const User = require('./controllers/users');
const Prompt = require('./controllers/prompts');
const Burst = require('./controllers/bursts');

/// ROUTES
const router = new Router();

// API BASE ROUTE
router.get('/api/v1/', function * () {
  return this.jsonResp(200, 'Welcome to the Talkative API');
});

// TWILIO CALLBACKS

router.get('/api/v1/twilio/', function * () {
  console.log('Received GET call to /api/v1/twilio');
  var resp = new twilio.TwimlResponse();
  resp.say('Understood');
  let responseString = resp.toString();
  //console.log(responseString);
  this.body = responseString;
});

router.post('/api/v1/twilio/', body(), function * () {
  console.log('Received POST call to /api/v1/twilio');
  console.dir(this.request.body);
  var resp = new twilio.TwimlResponse();
  resp.say('Understood');
  let responseString = resp.toString();
  //console.log(responseString);
  this.body = responseString;
});


router.get('/twilio/', function * () {
  console.log('Received GET call to /api/v1/twilio');
  var resp = new twilio.TwimlResponse();
  resp.say('Understood');
  let responseString = resp.toString();
  //console.log(responseString);
  this.body = responseString;
});

router.post('/twilio/', function * () {
  console.log('Received POST call to /api/v1/twilio');
  var resp = new twilio.TwimlResponse();
  resp.say('Understood');
  let responseString = resp.toString();
  //console.log(responseString);
  this.body = responseString;
});


// PROMPT ROUTES

const prompt = new Prompt();
// ALL PROMPTS INDEX
router.get('/api/v1/prompts', prompt.all);
// NEWS PROMPTS INDEX
router.get('/api/v1/prompts/news/', prompt.news);
// ENTERTAINMENT PROMPTS INDEX
router.get('/api/v1/prompts/entertainment/', prompt.entertainment);
// FACTS PROMPTS INDEX
router.get('/api/v1/prompts/facts/', prompt.facts);
// PROMPT SHOW (:id)
router.get('/api/v1/prompts/:id', prompt.show);


// BURST ROUTES

const burst = new Burst();
// ALL BURSTS INDEX
router.get('/api/v1/bursts/', burst.all);
// SENT BURSTS INDEX FOR USER (:userId)
router.get('/api/v1/bursts/:userId/sent/', burst.sent);
// UNSENT BURSTS INDEX FOR USER (:userId)
router.get('/api/v1/bursts/:userId/unsent/', burst.unsent);
// BURST SHOW (:userId)
router.get('/api/v1/bursts/:userId/', burst.show);



// USER ROUTES

const user = new User();
// ALL USERS INDEX
router.get('/api/v1/users/', user.all);
// ACTIVE USERS INDEX
router.get('/api/v1/users/active', user.active);
// INACTIVE USERS INDEX
router.get('/api/v1/users/inactive', user.inactive);
// USER CREATE (:id)
router.post('/api/v1/user/:id', user.create);
// UPDATE USER (:id)
router.post('/api/v1/users/:id', user.update);
// USER SHOW (:id)
router.get('/api/v1/users/:id', user.show);



// AUTHENTICATION
router.get('/api/v1/checkauthentication', function*() {
  if (this.isAuthenticated()) {
    return this.jsonResp(200, 'Success');
  } else {
    return this.jsonResp(401, 'Unauthorized');
  }
});


// append view renderer
var views = require('koa-render');
app.use(views('./views', {
  map: { html: 'handlebars' },
  cache: false
}));


// PUBLIC ROUTES
// HOME PAGE

router.get('/', function *() {
  this.body = yield this.render('login');
});


// POST /login
router.get('/auth/logout', function *() {
  this.logout();
  this.redirect('/');
});

// router.get('/auth/facebook',
//   passport.authenticate('facebook')
// );
//
// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: '/#/dashboard',
//     failureRedirect: '/'
//   })
// );
//
// router.get('/auth/twitter',
//   passport.authenticate('twitter')
// );
//
// router.get('/auth/twitter/callback',
//   passport.authenticate('twitter', {
//     successRedirect: '/#/dashboard',
//     failureRedirect: '/'
//   })
// );

router.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/#/dashboard',
    failureRedirect: '/'
  })
);

// Require authentication for now
// app.use(function *(next) {
//   if (this.isAuthenticated()) {
//     yield next;
//   } else {
//     this.redirect('/');
//   }
// });

router.get('/app', function *() {
  this.body = yield this.render('app');
});

app.use(router.middleware());
app.use(router.allowedMethods());
