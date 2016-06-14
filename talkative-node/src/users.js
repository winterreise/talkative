// USERS CONTROLLER

let controller = {
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

exports.User = controller;
