'use strict';

// PROMPTS CONTROLLER

class Prompt {

  *all() {
    let limit = getLimit(this.request.query.limit);
    let direction = getDirection(this.request.query.direction);
    const result = yield this.pg.db.client.query_(`SELECT id, content, domain, url FROM prompts ORDER BY id ${direction} LIMIT ${limit}`);
    const prompts = result.rows;
    return this.jsonResp(200, prompts);
  }

  *news() {
    let limit = getLimit(this.request.query.limit);
    let direction = getDirection(this.request.query.direction);
    const result = yield this.pg.db.client.query_(`SELECT content, domain, url FROM prompts WHERE category = 'news' ORDER BY id ${direction} LIMIT ${limit}`);
    const prompts = result.rows;
    return this.jsonResp(200, prompts);
  }

  *facts() {
    let limit = getLimit(this.request.query.limit);
    let direction = getDirection(this.request.query.direction);
    const result = yield this.pg.db.client.query_(`SELECT content, domain, url FROM prompts WHERE category = 'facts' ORDER BY id ${direction} LIMIT ${limit}`);
    const prompts = result.rows;
    return this.jsonResp(200, prompts);
  }

  *entertainment() {
    let limit = getLimit(this.request.query.limit);
    let direction = getDirection(this.request.query.direction);
    const result = yield this.pg.db.client.query_(`SELECT content, domain, url FROM prompts WHERE category = 'entertainment' ORDER BY id ${direction} LIMIT ${limit}`);
    const prompts = result.rows;
    return this.jsonResp(200, prompts);
  }

  *show(id) {
    const result = yield this.pg.db.client.query_(`SELECT content, domain, url FROM prompts WHERE id = ${id}`);
    if (result.rows.length === 0){
      return this.jsonResp(404, 'Could not find a prompt with that id.');
    } else {
      const prompt = result.rows[0];
      return this.jsonResp(200, prompt);
    }
  }

};

// HELPER METHODS

function getLimit(limitString){
  // Default limit for prompts is 10.
  let limitVal = parseInt(limitString);
  if (limitVal <= 100) {
    return limitVal;
  } else {
    return 10;
  }
}

function getDirection(directionString){
  // Default direction for prompts is DESC (newest first)
  let directionVal = String(directionString);
  if (directionVal === 'DESC' || directionVal === 'ASC') {
    return directionVal;
  } else {
    return 'DESC';
  }
}


module.exports = Prompt;
