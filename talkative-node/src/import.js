const config = require('./config');
const request = require('request');
const pg = require('pg');
const sources = ['todayilearned','news','entertainment'];

console.log('Starting import...');

sources.forEach(function(source){
  let url = 'https://www.reddit.com/r/' + source + '/search.json?restrict_sr=on&t=all&limit=100';
  request(url, (err, response, body) => {
      let parsedBody = JSON.parse(body);
      let entries = parsedBody.data.children;
      entries.forEach(function(entry){
            // Strip the TIL prefix on Today I Learned headlines....
            let title = entry.data.title.replace('TIL: ','').replace('TIL that ','').replace('TIL ','');
            // Capitalize all headlines in case they aren't already...
            title = title.charAt(0).toUpperCase() + title.slice(1);
            console.log(title);
            let urlString = entry.data.url;
            //console.log(url);
            let domain = entry.data.domain;
            //console.log(domain);
            let ups = entry.data.ups;
            //console.log(ups);
            let category = entry.data.subreddit;
            if (category === 'todayilearned') {
              category = 'facts';
            }
            //console.log(category);
            console.log('------------------------------');

            pg.connect(config.DATABASE_URL, function(error, client, done) {
              if(error) {
                return console.error('error fetching client from pool', error);
              }
              client.query('INSERT INTO prompts (content, category, domain, url, ups) VALUES ($1, $2, $3, $4, $5)', [title, category, domain, urlString, ups], function(errors) {
                //call `done()` to release the client back to the pool
                done();
                if(errors) {
                  return console.error('error running query', errors);
                }
              });
            });


      });
  })
   .on('error', (e) => {
      console.log('Got error: ' + e.message);
   });
});
