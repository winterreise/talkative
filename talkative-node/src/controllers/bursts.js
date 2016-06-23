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
    console.log(this.session.passport.user);
    const result = yield this.pg.db.client.query_(`SELECT id,prompt_ids,sent,user_id FROM bursts WHERE NOT sent AND user_id = ${this.session.passport.user}`);
    const user = yield this.pg.db.client.query_(`SELECT id,phone FROM users WHERE id = ${this.session.passport.user}`);

    const burst = result.rows[0];
    console.log('------------');
    console.log(burst.prompt_ids);
    console.log('------------');

    for(let i = 0; i < burst.prompt_ids.length; i++){
      const prompt = yield this.pg.db.client.query_(`SELECT id,content FROM prompts WHERE id = ${burst.prompt_ids[i]}`);

      setTimeout(() => {
        twilioClient.messages.create({
            body: prompt.rows[0].content,
            //to: '+16479193154',  // Pui Wing
            //to: '+14163195100', // Gabe
            to: user.phone.trim(),
            from: '+16474964226' // From a valid Twilio number
        }, function(err, response) {
            console.log('--------------------------------------------------');
            console.log(err);
            console.log('--------------------------------------------------');
        });
      }, 1000*i);
    }


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
