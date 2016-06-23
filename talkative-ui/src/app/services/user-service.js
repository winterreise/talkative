module.exports = class UserService {
  constructor($http) {
    this.$http = $http;
  }

  get() {
    return this.$http({
      method: 'GET',
      url: '/api/v1/user'
    }).then((result) => {
      return result.data.data;
    });
  }

  update(profile) {
    return this.$http({
      method: 'POST',
      url: '/api/v1/user',
      data: profile
    });
  }
};

// minification-safe
module.exports.$inject = ['$http'];
