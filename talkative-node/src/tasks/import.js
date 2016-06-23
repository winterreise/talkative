'use strict';

const config = require('../config');
const request = require('request');
const pg = require('pg');
const sources = ['todayilearned','news','entertainment','Positive_News','upliftingnews','news_etc'];

console.log('Starting import...');

function fetchData(){
  sources.forEach(function(source){
    let url = 'https://www.reddit.com/r/' + source + '/search.json?restrict_sr=on&t=all&&sort=newlimit=100';
    request(url, (err, response, body) => {
        let parsedBody = JSON.parse(body);
        let entries = parsedBody.data.children;
        prepareEntries(entries);
    })
     .on('error', (e) => {
        console.log('Got error: ' + e.message);
     });
  });
}

function prepareEntries(entries){
  entries.forEach(function(entry){
        // Strip the TIL prefix on Today I Learned headlines....
        let title = entry.data.title.replace('TIL: ','').replace('TIL that ','').replace('TIL ','');
        // Capitalize all headlines in case they aren't already...
        title = title.charAt(0).toUpperCase() + title.slice(1);
        let urlString = entry.data.url;
        let domain = entry.data.domain;
        let ups = entry.data.ups;
        let category = entry.data.subreddit;
        if (category === 'todayilearned') {
          category = 'facts';
        }
        if (category === 'Positive_News') {
          category = 'news'
        }
        if (category === 'news_etc') {
          category = 'news'
        }
        if (category === 'UpliftingNews') {
          category = 'news'
        }

        saveEntry(title, domain, ups, category, urlString);
  });
}


function saveEntry(title, domain, ups, category, urlString){
  pg.connect(config.DATABASE_URL, function(error, client, done) {
    if(error) {
      return console.error('error fetching client from pool', error);
    }
    client.query('INSERT INTO prompts (content, category, domain, url, ups) VALUES ($1, $2, $3, $4, $5)', [title, category, domain, urlString, ups], function(errors) {
      console.log('------------------------------');
      //console.log(title);
      console.log(category);
      done();
      if(errors) {
        return console.error('error running query', errors);
      }
    });
  });
}

fetchData();
