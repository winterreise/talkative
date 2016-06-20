// USERS CONTROLLER

class User {

  *all() {
    const result = yield this.pg.db.client.query_('SELECT id,phone,frequency,active FROM users');
    const users = result.rows;
    console.log('result:', users);
    return this.jsonResp(200, users);
  }

  *active() {
    const result = yield this.pg.db.client.query_('SELECT id,phone,frequency,active FROM users WHERE active');
    const users = result.rows;
    console.log('result:', users);
    return this.jsonResp(200, users);
  }

  *inactive() {
    const result = yield this.pg.db.client.query_('SELECT id,phone,frequency,active FROM users WHERE NOT active');
    const users = result.rows;
    console.log('result:', users);
    return this.jsonResp(200, users);
  }

  *show(id) {
    const result = yield this.pg.db.client.query_(`SELECT id,phone,frequency,active FROM users WHERE id = ${id}`);
    if (result.rows.length === 0){
      return this.jsonResp(404, 'Could not find a user with that id.');
    } else {
      const user = result.rows[0];
      console.log('result:', user);
      return this.jsonResp(200, user);
    }
  }

  *checkauthentication() {
    return this.jsonResp(200, 'Yup!');
  }

};

module.exports = User;
