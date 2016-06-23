'use strict';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  console.log('NODE_ENV === development || NODE_ENV === test');
  exports.DATABASE_URL = 'postgres://localhost:5432/talkative_demo';
  exports.DATABASE_SERVER_URL = 'postgres://localhost:5432';
  exports.API_URL = 'http://localhost:8080/api/v1';
} else {
  console.log('NODE_ENV ==== production');
  exports.DATABASE_URL = process.env.DATABASE_URL || 'postgres://talkative-app.herokuapp.com:5432/talkative';
  exports.DATABASE_SERVER_URL = process.env.DATABASE_SERVER_URL || 'postgres://talkative-app.herokuapp.com:5432';
  exports.API_URL = process.env.API_URL || 'http://talkative-app.herokuapp.com:8080/api/v1';
}

console.log('EXPORTS ARE:\n', exports);
