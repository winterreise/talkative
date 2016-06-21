'use strict';

// BURSTS CONTROLLER

class Burst {

  *all() {
    const result = yield this.pg.db.client.query_('SELECT id,prompt_ids,sent,user_id FROM bursts');
    const bursts = result.rows;
    return this.jsonResp(200, bursts);
  }

  *sent(userId) {
    const result = yield this.pg.db.client.query_(`SELECT id,prompt_ids,sent,user_id FROM bursts WHERE sent AND user_id = ${userId}`);
    const bursts = result.rows;
    return this.jsonResp(200, bursts);
  }

  *unsent(userId) {
    const result = yield this.pg.db.client.query_(`SELECT id,prompt_ids,sent,user_id FROM bursts WHERE NOT sent AND user_id = ${userId}`);
    const bursts = result.rows;
    return this.jsonResp(200, bursts);
  }

  *show(userId) {
    const result = yield this.pg.db.client.query_(`SELECT id,prompt_ids,sent_at,user_id FROM bursts WHERE user_id = ${userId}`);
    if (result.rows.length === 0){
      return this.jsonResp(404, `Could not find any bursts for user_id ${userId}.`);
    } else {
      const bursts = result.rows;
      return this.jsonResp(200, bursts);
    }
  }


};

module.exports = Burst;
