const angular = require('angular'); // eslint-disable-line
const router = require('angular-route'); //eslint-disable-line no-unused-vars

require('../style/app.css');

const MODULE_NAME = 'talkative';

const app = angular.module(MODULE_NAME, ['ngRoute']);

// configure
app.config(['$routeProvider',
  function config($routeProvider) {
    $routeProvider.
      when('/', {
        template: '<landing-page></landing-page>'
      }).
      when('/dashboard', {
        template: '<user-prefs></user-prefs>',
        // prevent visiting /dashboard when not logged in
        resolve: {
          'isLoggedIn': ['AuthService', (AuthService) => {
            return AuthService.isLoggedIn();
          }]
        }
      }).
      otherwise('/');
  }
]);

// Declare services
app.factory('UserService', require('./services/user-service'));
app.factory('AuthService', require('./services/auth-service'));

// Declare components
app
.component('landingPage', {
  template: require('./components/landing-page.html'),
  controller: require('./components/landing-page')
})
.component('talkativeNav', {
  template: require('./components/talkative-nav.html'),
  controller: require('./components/talkative-nav')
})
.component('userPrefs', {
  template: require('./components/user-prefs.html'),
  controller: require('./components/user-prefs')
})
.component('talkativeFooter', {
  template: require('./components/talkative-footer.html'),
  transclude: true
});


// Angular startup
app.run(['$rootScope', '$location', 'AuthService',
  ($rootScope, $location, AuthService) => {
    AuthService.isLoggedIn()
    // We're logged in!
    .then(() => $location.path('/dashboard'))
    // We're not logged in :(
    .catch(() => $location.path('/'));

    $rootScope.$on('$routeChangeError', () => $location.path('/'));
  }
]);
