'use strict';


const accountSid = 'AC49c3898540c4e571bf88ca4e59c52367'; // Your Account SID from www.twilio.com/console
const authToken = '78130c3351637fd6161e3c14584ac2ba';   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const twilioClient = new twilio.RestClient(accountSid, authToken);

// BURSTS CONTROLLER

class Burst {

  *all() {
    const result = yield this.pg.db.client.query_('SELECT id,prompt_ids,sent,user_id FROM bursts');
    const bursts = result.rows;
    return this.jsonResp(200, bursts);
  }

  *sent(userId) {
    const result = yield this.pg.db.client.query_(`SELECT id,prompt_ids,sent,user_id FROM bursts WHERE sent AND user_id = ${userId}`);
    const bursts = result.rows;
    return this.jsonResp(200, bursts);
  }

  *unsent(userId) {
    const result = yield this.pg.db.client.query_(`SELECT id,prompt_ids,sent,user_id FROM bursts WHERE NOT sent AND user_id = ${userId}`);
    const bursts = result.rows;
    return this.jsonResp(200, bursts);
  }

  *test() {
    console.log(this.session.passport);
    const result = yield this.pg.db.client.query_(`SELECT id,prompt_ids,sent,user_id FROM bursts WHERE NOT sent AND user_id = 105654248664474896590`);
    const user = yield this.pg.db.client.query_(`SELECT id,phone FROM users WHERE id = 105654248664474896590`);

    const burst = result.rows[0];

    burst.prompt_ids.forEach(function *(id){
      const prompt = yield this.pg.db.client.query_(`SELECT id,phone FROM prompts id = ${id}`);

      twilioClient.messages.create({
          body: prompt.content,
          //to: '+16479193154',  // Pui Wing
          //to: `+14163195100`', // Gabe
          to: user.phone,
          from: '+16474964226' // From a valid Twilio number
      }, function(err, response) {
          console.log('--------------------------------------------------');
          console.log(message);
          console.log('--------------------------------------------------');
          console.log(`Message sent. ID is: ${response.sid}`);
      });
    });


    return this.jsonResp(200, "Burst sent.");
  }

  *show(userId) {
    const result = yield this.pg.db.client.query_(`SELECT id,prompt_ids,sent_at,user_id FROM bursts WHERE user_id = ${userId}`);
    if (result.rows.length === 0){
      return this.jsonResp(404, `Could not find any bursts for user_id ${userId}.`);
    } else {
      const bursts = result.rows;
      return this.jsonResp(200, bursts);
    }
  }

};

module.exports = Burst;
