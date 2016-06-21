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

    pg.connect(`postgres://localhost:5432/${newName}`, function(error, client, done) {
      if(error) {
        return console.error('error fetching client from pool', error);
      }
      client.query(`CREATE TABLE IF NOT EXISTS users (
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
        user_id integer,
        prompt_ids integer[],
        sent boolean default FALSE,
        sent_at date,
        created_at date
    );

    CREATE TABLE IF NOT EXISTS histories (
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

  });
});
