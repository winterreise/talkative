const config = require('./config');
const koa = require('koa');
const app = koa();
const koaPg = require('koa-pg');
const jsonResp = require('koa-json-response');
const route = require('koa-route');

// APP CONFIG

app.use(jsonResp())
  .use(koaPg('postgres://localhost:5432/talkative'))
  .listen(8080);

// USER CONTROLLER

var User = {
  all: function *() {
    let result = yield this.pg.db.client.query_('SELECT id,phone,frequency,active FROM users');
    let users = result.rows;
    console.log('result:', users);
    return this.jsonResp(200, users);
  },

  active: function *() {
    let result = yield this.pg.db.client.query_('SELECT id,phone,frequency,active FROM users WHERE active');
    let users = result.rows;
    console.log('result:', users);
    return this.jsonResp(200, users);
  },

  inactive: function *() {
    let result = yield this.pg.db.client.query_('SELECT id,phone,frequency,active FROM users WHERE NOT active');
    let users = result.rows;
    console.log('result:', users);
    return this.jsonResp(200, users);
  },

  show: function *(id) {
    let result = yield this.pg.db.client.query_(`SELECT id,phone,frequency,active FROM users WHERE id = ${id}`);
    if (result.rows.length == 0){
      return this.jsonResp(404, 'Could not find a user with that id.');
    } else {
      let user = result.rows;
      console.log('result:', user);
      return this.jsonResp(200, user);
    }
  }
};

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
