'use strict';

// TWILIO CONFIG
const accountSid = 'AC49c3898540c4e571bf88ca4e59c52367'; // Your Account SID from www.twilio.com/console
const authToken = '78130c3351637fd6161e3c14584ac2ba';   // Your Auth Token from www.twilio.com/console
const twilio = require('twilio');
const twilioClient = new twilio.RestClient(accountSid, authToken);

// DB CONFIG
const config = require('../config');
const pg = require('pg');


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
    const result = yield this.pg.db.client.query_(`SELECT id,phone,frequency,active FROM users WHERE id = ${this.params.id}`);
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
    if (result.rows.length === 0) {
      // User record doesn't already exist, so let's create one.
      let query = `INSERT INTO users (id,active,frequency,newsweight,entertainmentweight,factsweight) VALUES (${this.params.id},FALSE,10,5,5,5);`;
      yield this.pg.db.client.query_(query);
      console.log('User created.');
    } else {
      console.log('User already exists.');
    }
  }

  *update() {
    // Fetch user's previous phone number....
    console.log(`I.D. IS: ${this.params.id}`);
    const previousUser = yield this.pg.db.client.query_(`SELECT phone FROM users WHERE id = ${this.params.id}`);
    console.log(previousUser.rows[0].phone);
    let previousPhone = previousUser.rows[0].phone;

    // Make params object with form submission data...
    // Check if new phone value is different from previousUser

    previousPhone = parseInt(previousPhone.trim());
    let nextPhone = parseInt(this.request.body.phone);

    if (previousPhone !== nextPhone){
      // Number has changed, so we send a welcome message...
      twilioClient.messages.create({
          body: 'Welcome to Talkative!',
          to: '+14163195100',
          // to: `+${this.request.body.phone}`,
          from: '+16474964226'
      }, function(err, response) {
          console.log(`Message sent. ID is: ${response.sid}`);
      });
    }

    // Update user in DB....
    let query = `UPDATE users SET phone = ${this.request.body.phone}, frequency = ${this.request.body.frequency}, active = ${this.request.body.active}, factsweight = ${this.request.body.factsweight}, entertainmentweight = ${this.request.body.entertainmentweight}, newsweight = ${this.request.body.newsweight} WHERE id = ${this.params.id}`;
    const result = yield this.pg.db.client.query_(query);
    const updateQuery = yield this.pg.db.client.query_(`SELECT id,phone,frequency,active,newsweight,factsweight,entertainmentweight FROM users WHERE id = ${this.params.id}`);
    const user = updateQuery.rows[0];
    if (result.rowCount === 0){
      return this.jsonResp(404, 'Could not find a user with that id.');
    } else {
      console.log('result:', user);
      generateBursts(user.id, parseInt(user.frequency), parseInt(user.newsweight), parseInt(user.factsweight), parseInt(user.entertainmentweight));
      return this.jsonResp(200, user);
    }
  }

  *checkauthentication() {
    return this.jsonResp(200, 'Yup!');
  }

};

module.exports = User;


// HELPER METHODS

function generateBursts(userId,frequency,newsWeight,factsWeight,entertainmentWeight){

  // Query DB for new bursts....
  const dayMinutes = 60 * 24; // Number of minutes in 24 hours
  const numBursts  = Math.ceil(dayMinutes / frequency); // Number of bursts for a 24 hour period
  const numPrompts = numBursts * 5; // More than the number of prompts we will need to build bursts.

  pg.connect(config.DATABASE_URL, function(error, client, done) {

    if(error) {return console.error('error fetching client from pool', error);}

    // News Query
    client.query(`SELECT id FROM prompts WHERE category = 'news' ORDER BY id DESC LIMIT ${numPrompts};`, function(errors, result) {
      let newsPrompts = result.rows;
      // Facts Query
      client.query(`SELECT id FROM prompts WHERE category = 'facts' ORDER BY id DESC LIMIT ${numPrompts};`, function(errors, result) {
        let factsPrompts = result.rows;
        // Entertainment Query
        client.query(`SELECT id FROM prompts WHERE category = 'entertainment' ORDER BY id DESC LIMIT ${numPrompts};`, function(errors, result) {
          let entertainmentPrompts = result.rows;

          const totalFreq         = newsWeight + factsWeight + entertainmentWeight;
          const newsFreq          = newsWeight / totalFreq;
          const factsFreq         = factsWeight / totalFreq;
          const entertainmentFreq = entertainmentWeight / totalFreq;

          console.log(`e: ${entertainmentFreq}`);
          console.log(`f: ${factsFreq}`);
          console.log(`n: ${newsFreq}`);

          const entertainmentEnd = parseInt(entertainmentPrompts.length * entertainmentFreq);
          const newsEnd = parseInt(newsPrompts.length * newsFreq);
          const factsEnd = parseInt(entertainmentPrompts.length * factsFreq);

          console.log(entertainmentEnd);
          console.log(newsEnd);
          console.log(factsEnd);

          // TODO Eliminate prompts that the user has seen already.

          entertainmentPrompts = shuffle(entertainmentPrompts).slice(0,entertainmentEnd);
          factsPrompts         = shuffle(factsPrompts).slice(0,factsEnd);
          newsPrompts          = shuffle(newsPrompts).slice(0,newsEnd);

          // console.log(entertainmentPrompts);
          // console.log('---------------------------------');
          // console.log(factsPrompts);
          // console.log('---------------------------------');
          // console.log(newsPrompts);
          // console.log('---------------------------------');

          let prompts = entertainmentPrompts.concat(factsPrompts).concat(newsPrompts);
          prompts = shuffle(prompts);

            for(let i = 1; i <= numBursts; i += 3){
              console.log(prompts[i]);
              console.log(prompts[i+1]);
              console.log(prompts[i+2]);
              console.log('------------');

              let queryString = `INSERT INTO bursts (user_id, prompt_ids, created_at) VALUES (${userId},ARRAY[${prompts[i].id},${prompts[i+1].id},${prompts[i+2].id}],now());`;

              client.query(queryString, function(errors, result) {
                console.log(errors);
              });

            }

        });
      });
    });

    done();
  });


}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
