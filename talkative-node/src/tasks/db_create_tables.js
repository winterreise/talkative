'use strict';

// NOT WORKING FOR THE MOMENT. NEEDS A DEBUG or REFACTOR

const config = require('../config');
const request = require('request');
const pg = require('pg');

// IMPORTANT CHANGE NEW DB NAME CAREFULLY SO YOU DON'T OVER-WRITE STUFF
pg.connect(`postgres://talkative-app.herokuapp.com:5432/${newName}`, function(error, client, done) {
  if(error) {
    return console.error('error fetching client from pool', error);
  }
  client.query(`CREATE TABLE IF NOT EXISTS users (
    id          numeric,
    phone       varchar,
    active      boolean,
    frequency   integer,
    news_weight  integer,
    entertainment_weight integer,
    facts_weight integer,
    romance_weight integer
);

CREATE TABLE IF NOT EXISTS prompts (
    content text,
    category varchar,
    domain varchar,
    url varchar,
    ups integer
);

CREATE TABLE IF NOT EXISTS bursts (
    id SERIAL PRIMARY KEY,
    user_id numeric,
    prompt_ids integer[],
    sent boolean default FALSE,
    sent_at date,
    created_at date
);

CREATE TABLE IF NOT EXISTS histories (
    user_id numeric,
    prompt_id integer
);`, function(errors) {
    //call `done()` to release the client back to the pool

    done();
    if(errors) {
      return console.error('error running query', errors);
    }
  });
});
