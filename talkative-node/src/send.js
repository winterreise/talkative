const config = require('./config');
const pg = require('pg');

const accountSid = 'AC49c3898540c4e571bf88ca4e59c52367'; // Your Account SID from www.twilio.com/console
const authToken = '78130c3351637fd6161e3c14584ac2ba';   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const twilioClient = new twilio.RestClient(accountSid, authToken);

function fetchUserBursts(id){
  pg.connect(config.DATABASE_URL, function(error, client, done) {
    if(error) {
      return console.error('error fetching client from pool', error);
    }
    client.query(`SELECT * FROM bursts WHERE id = ${id}`, function(errors, result) {
      let bursts = result.rows;
      prepareBursts(bursts, client);
      done();
      if(errors) {
        return console.error('error running query', errors);
      }

    });
  });
}

function prepareBursts(bursts, client){
  bursts.forEach(function(row){
    let promptIds = row.prompt_ids;
    promptIds.forEach(function(promptId){
        fetchPromptData(promptId, client);
    });
  });
}


function fetchPromptData(id, client){
  client.query(`SELECT * FROM prompts WHERE id = ${id}`, function(e, queryResult) {
    queryResult.rows.forEach(function(prompt){
      let message = buildMessage(prompt);
      sendMessage(message);
    });
  });
}


function buildMessage(prompt){
  return `${prompt.category.trim()}: ${prompt.content} (${prompt.url})`;
}

function sendMessage(message){
  twilioClient.messages.create({
      body: message,
      //to: '+16479193154',  // Pui Wing
      to: '+14163195100', // Gabe
      from: '+16474964226' // From a valid Twilio number
  }, function(err, response) {
      console.log('--------------------------------------------------');
      console.log(message);
      console.log('--------------------------------------------------');
      console.log(`Message sent. ID is: ${response.sid}`);
      console.log('Errors: ');
      console.log(err);
  });
}

fetchUserBursts(3);
