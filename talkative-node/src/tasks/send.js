'use strict';

const config = require('../config');
const pg = require('pg');

const accountSid = 'AC49c3898540c4e571bf88ca4e59c52367'; // Your Account SID from www.twilio.com/console
const authToken = '78130c3351637fd6161e3c14584ac2ba';   // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');
const twilioClient = new twilio.RestClient(accountSid, authToken);

// CAPTURE THE 3rd ARGUMENTS SO WE KNOW TO DO ALL OR JUST ONE USER ID
const arg = process.argv[2];

// START THE PROCESS...
let queryString = '';
fetchUserBursts(arg, queryString);

function fetchUserBursts(argument, queryString){

  // Create query to fetch all bursts, or just those for one user
  if (argument === 'ALL'){
    console.log('Quering all bursts...');
    queryString = 'SELECT * FROM bursts WHERE sent = FALSE';
  } else {
    console.log(`Quering all bursts for user id ${arg} AND sent = FALSE`);
    queryString = `SELECT * FROM bursts WHERE user_id = ${arg} AND sent = FALSE`;
  }

  pg.connect(config.DATABASE_URL, function(error, client, done) {
    if(error) {
      return console.error('error fetching client from pool', error);
    }
    client.query(queryString, function(errors, result) {
      console.log('Query complete...');
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
  console.log('Preparing bursts...');
  bursts.forEach(function(row){
    let promptIds = row.prompt_ids;
    let userId = row.user_id;
    promptIds.forEach(function(promptId){
        fetchPromptData(promptId, client, userId);
    });
  });
}


function fetchPromptData(promptId, client, userId){
  console.log('Fetch prompts...');
  client.query(`SELECT * FROM prompts WHERE id = ${promptId}`, function(e, queryResult) {
    queryResult.rows.forEach(function(prompt){
      let message = buildMessage(prompt);
      sendMessage(message, userId, promptId, client);
    });
  });
}


function buildMessage(prompt){
  return `${prompt.category.trim()}: ${prompt.content} (${prompt.url})`;
}

function sendMessage(message, userId, promptId, client){
  console.log('Sending message...');
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
      createHistory(userId,promptId,client);
  });
}

function createHistory(userId,promptId,client){
  client.query(`INSERT INTO histories (user_id,prompt_id) VALUES (${userId},${promptId});`, function(e, queryResult) {
    console.dir(queryResult);
  });
}
