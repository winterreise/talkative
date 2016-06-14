const config = require('./config');
const koa = require('koa');
const app = koa();
const koaPg = require('koa-pg');
const jsonResp = require('koa-json-response');
const route = require('koa-route');
const User = require('./users');

// APP CONFIG

app.use(jsonResp())
  .use(koaPg(config.DATABASE_URL))
  .listen(8080);

/// ROUTES

// API ROOT
app.use(route.get('/api/v1/', function * (next) {
  return this.jsonResp(200, 'Welcome to the Talkative API');
}));

// ALL USERS INDEX
app.use(route.get('/api/v1/users/', User.all));
// ACTIVE USERS INDEX
app.use(route.get('/api/v1/active-users/', User.active));
// INACTIVE USERS INDEX
app.use(route.get('/api/v1/inactive-users/', User.inactive));
// USERS SHOW (:id)
app.use(route.get('/api/v1/users/:id', User.show));
