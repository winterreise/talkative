'use strict';

const config = require('../config');
const pg = require('pg');
let safeList = [];

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function deletePrompt(id, client){
  if (!isInArray(id, safeList)){
    client.query(`DELETE FROM prompts WHERE id = ${id}`, function(errors, queryResult) {
      console.log(`Deleted duplicate: ${id}`);
      if(errors) {
        return console.error('error running query', errors);
      }
    });
  }
}


function fetchPrompts(){
  console.log('Fetching prompts...');
  const duplicateIds = [];

  pg.connect(config.DATABASE_URL, function(error, client, done) {
    if(error) {
      return console.error('error fetching client from pool', error);
    }
    client.query('SELECT id,content FROM prompts', function(errors, queryResult) {
      console.log('queryResult');
      const prompts = queryResult.rows;
      let i = 0;

      prompts.forEach(function(prompt1){
        prompts.forEach(function(prompt2){
          if (prompt1.content === prompt2.content && prompt1.id !== prompt2.id) {
            console.log('Found a duplicate:');
            console.log(prompt1.id);
            console.log(prompt1.content);
            console.log(prompt2.id);
            console.log(prompt2.content);
            console.log('--------------------------------------------');
            i++;
            safeList.push(prompt2.id);
            deletePrompt(prompt1.id, client);
          }
        });
      });
      console.log(`Found and ${i} duplicates.`);
      if(errors) {
        return console.error('error running query', errors);
      }
    });

    });

}

fetchPrompts();
