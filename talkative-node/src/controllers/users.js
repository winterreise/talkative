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

  *show(id) {
    const result = yield this.pg.db.client.query_(`SELECT id,phone,frequency,active,factsweight,entertainmentweight,newsweight FROM users WHERE id = ${id}`);
    if (result.rows.length === 0){
      return this.jsonResp(404, 'Could not find a user with that id.');
    } else {
      const user = result.rows[0];
      console.log('result:', user);
      return this.jsonResp(200, user);
    }
  }

  *update(id) {
    console.dir(this.request.body);
    let url = this.req._parsedUrl;
    let params = url.query.split('&');
    let paramsObj = {};
    params.forEach(function(p){
      paramsObj[p.split('=')[0]] = p.split('=')[1];
    });
    const result = yield this.pg.db.client.query_(`UPDATE users SET phone = ${paramsObj.phone}, frequency = ${paramsObj.frequency}, active = ${paramsObj.active}, factsweight = ${paramsObj.factsweight}, entertainmentweight = ${paramsObj.entertainmentweight}, newsweight = ${paramsObj.newsweight} WHERE id = ${id}`);
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
