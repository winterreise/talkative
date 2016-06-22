'use strict';

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

  *show() {
    const result = yield this.pg.db.client.query_(`SELECT id FROM users WHERE id = ${this.params.id}`);
    if (result.rows.length === 0){
      return this.jsonResp(404, 'Could not find a user with that id.');
    } else {
      const user = result.rows[0];
      console.log('result:', user);
      return this.jsonResp(200, user);
    }
  }

  *create() {
    const firstQuery = `SELECT id FROM users WHERE id = ${this.params.id}`;
    const result = yield this.pg.db.client.query_(firstQuery);
    if (result.rows.length === 0){
      // User record doesn't already exist, so let's create one.
      let query = `INSERT INTO users (id,active,frequency,newsweight,entertainmentweight,factsweight) VALUES (${this.params.id},FALSE,10,5,5,5);`;
      let newUser = yield this.pg.db.client.query_(query);
      console.log('User created.');
    } else {
      console.log('User already exists.');
    }
  }

  *update() {
    console.dir(this.request.body);
    let url = this.req._parsedUrl;
    let params = url.query.split('&');
    let paramsObj = {};
    params.forEach(function(p){
      paramsObj[p.split('=')[0]] = p.split('=')[1];
    });
    const result = yield this.pg.db.client.query_(`UPDATE users SET phone = ${paramsObj.phone}, frequency = ${paramsObj.frequency}, active = ${paramsObj.active}, factsweight = ${paramsObj.factsweight}, entertainmentweight = ${paramsObj.entertainmentweight}, newsweight = ${paramsObj.newsweight} WHERE id = ${this.params.id}`);
    if (result.rowCount === 0){
      return this.jsonResp(404, 'Could not find a user with that id.');
    } else {
      // TO DO Return actual user, not the params
      return this.jsonResp(200, paramsObj);
    }
  }

  *checkauthentication() {
    return this.jsonResp(200, 'Yup!');
  }

};

module.exports = User;
