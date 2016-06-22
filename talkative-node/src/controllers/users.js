'use strict';


const accountSid = 'AC49c3898540c4e571bf88ca4e59c52367'; // Your Account SID from www.twilio.com/console
const authToken = '78130c3351637fd6161e3c14584ac2ba';   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const twilioClient = new twilio.RestClient(accountSid, authToken);

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
    // Fetch user's previous phone number....
    const previousUser = yield this.pg.db.client.query_(`SELECT phone FROM users WHERE id = ${this.params.id}`);
    const previousPhone = previousUser.rows[0].phone;
    // Make params object with form submission data...
    let url = this.req._parsedUrl;
    let params = url.query.split('&');
    let paramsObj = {};
    params.forEach(function(p){
      paramsObj[p.split('=')[0]] = p.split('=')[1];
    });

    // Check if new phone value is different from previousUser
    if (previousPhone !== paramsObj.phone){
      // Number has changed, so we send a welcome message...
      twilioClient.messages.create({
          body: 'Welcome to Talkative!',
          to: `+${paramsObj.phone}`,
          from: '+16474964226'
      }, function(err, response) {
          console.log(`Message sent. ID is: ${response.sid}`);
      });
    }

    // Update user in DB....
    let query = `UPDATE users SET phone = ${paramsObj.phone}, frequency = ${paramsObj.frequency}, active = ${paramsObj.active}, factsweight = ${paramsObj.factsweight}, entertainmentweight = ${paramsObj.entertainmentweight}, newsweight = ${paramsObj.newsweight} WHERE id = ${this.params.id}`;
    console.log(query);
    const result = yield this.pg.db.client.query_(query);
    if (result.rowCount === 0){
      return this.jsonResp(404, 'Could not find a user with that id.');
    } else {
      const user = result.rows[0];
      console.log('result:', user);
      generateBursts(user.id, user.frequency, user.newsweight, user.factsweight, user.entertainmentweight);
      return this.jsonResp(200, user);
    }
  }

  *checkauthentication() {
    return this.jsonResp(200, 'Yup!');
  }

};

module.exports = User;

// HELPER METHODS


function generateBursts(id,frequency,newsweight,factsweight,entertainmentweight){
// TODO
}
