'use strict';

// NOT WORKING FOR THE MOMENT. NEEDS A DEBUG or REFACTOR

const config = require('../config');
const request = require('request');
const pg = require('pg');

// IMPORTANT CHANGE NEW DB NAME CAREFULLY SO YOU DON'T OVER-WRITE STUFF
let newName = 'talkative';

pg.connect(config.DATABASE_URL, function(error, client, done) {
  if(error) {
    return console.error('error fetching client from pool', error);
  }
  client.query(`CREATE DATABASE ${newName};`, function(errors) {
    //call `done()` to release the client back to the pool
    done();
    if(errors) {
      return console.error('error running query', errors);
    }

  });
});
