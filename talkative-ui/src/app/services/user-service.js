module.exports = class UserService {
  constructor($http) {
    this.$http = $http;
  }

  get(id) {
    return this.$http({
      method: 'GET',
      url: `/api/v1/users/${id}`
    }).then((response) => {
      // TODO implement
    });
  }

  update(id, profile) {
    return this.$http({
      method: 'POST',
      url: `/api/v1/users/${id}`,
      data: profile
    }).then((response) => {
      // TODO implement
    });
  }
};

// minification-safe
module.exports.$inject = ['$http'];
