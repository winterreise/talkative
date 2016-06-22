module.exports = class AuthService {
  constructor($http) {
    this.$http = $http;
  }

  isLoggedIn() {
    return this.$http({
      method: 'GET',
      url: '/api/v1/checkauthentication'
    });
  }
};

// minification-safe
module.exports.$inject = ['$http'];
