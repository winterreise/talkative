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
        template: '<user-prefs></user-prefs>'
      }).
      otherwise('/');
  }
]);

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
