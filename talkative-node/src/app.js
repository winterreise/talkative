const config = require('./config');
const koa = require('koa');
const app = koa();
const koaPg = require('koa-pg');
const jsonResp = require('koa-json-response');
const route = require('koa-route');

// APP CONFIG

// trust proxy
app.proxy = true

// sessions
let session = require('koa-generic-session')
app.keys = ['your-session-secret']
app.use(session())

// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// authentication
require('./auth')
const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())


app.use(
  jsonResp())
  .use(koaPg(config.DATABASE_URL))
  .listen(8080);

// REQUIRE CONTROLLERS

const User = require('./users');
const Prompt = require('./prompts');
const Burst = require('./bursts');

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
// USER SHOW (:id)
app.use(route.get('/api/v1/users/:id', user.show));


// AUTHENTICATION
app.use(route.get('/api/v1/checkauthentication', user.checkauthentication));


// append view renderer
var views = require('koa-render');
app.use(views('./views', {
  map: { html: 'handlebars' },
  cache: false
}));

// public routes
var Router = require('koa-router')

var public = new Router()

public.get('/', function*() {
  this.body = yield this.render('login')
})


// POST /login
public.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

public.get('/logout', function*(next) {
  this.logout()
  this.redirect('/')
})

public.get('/auth/facebook',
  passport.authenticate('facebook')
)

public.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

public.get('/auth/twitter',
  passport.authenticate('twitter')
)

public.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

public.get('/auth/google',
  passport.authenticate('google')
)

public.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

app.use(public.middleware())

// Require authentication for now
app.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next
  } else {
    this.redirect('/')
  }
})

var secured = new Router()

secured.get('/app', function*() {
  this.body = yield this.render('app')
})

app.use(secured.middleware())
