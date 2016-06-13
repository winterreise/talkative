// CONFIG FOR BACKEND

exports.DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/talkative';

// Output config object in development to help with sanity-checking
if (exports.NODE_ENV === 'development' || exports.NODE_ENV === 'test') {
  console.log(exports);
}bug
