'use strict';

// NOT WORKING FOR THE MOMENT. NEEDS A DEBUG or REFACTOR

const config = require('../config');
const request = require('request');
const pg = require('pg');

pg.connect(config.DATABASE_URL, function(error, client, done) {
  if(error) {
    return console.error('error fetching client from pool', error);
  }
  client.query(`CREATE DATABASE talkative2;

    \c talkative2;

    CREATE TABLE users (
    phone       char(13),
    active      boolean,
    frequency   integer,
    news_weight  integer,
    entertainment_weight integer,
    facts_weight integer,
    romance_weight integer,
);

CREATE TABLE prompts (
    content text,
    category char(13),
    domain varchar,
    url varchar,
    ups integer
);


CREATE TABLE bursts (
    user_id integer,
    prompt_ids integer[],
    sent boolean default FALSE,
    sent_at date,
    created_at date
);


CREATE TABLE histories (
    user_id integer,
    prompt_id integer
);

--And add an ID column to bursts

ALTER TABLE bursts ADD COLUMN id SERIAL PRIMARY KEY;`, function(errors) {
    //call `done()` to release the client back to the pool

    done();
    if(errors) {
      return console.error('error running query', errors);
    }
  });
});
