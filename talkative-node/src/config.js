// CONFIG FOR BACKEND

exports.DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/talkative';
exports.API_URL = process.env.API_URL || 'http://localhost:8080';

// Output config object in development to help with sanity-checking
if (exports.NODE_ENV === 'development' || exports.NODE_ENV === 'test') {
  console.log(`NODE_ENV === ${exports.NODE_ENV}`);
  console.log(`EXPORTS ARE: ${exports}`);
}
