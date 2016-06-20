const angular = require('angular'); // eslint-disable-line

require('../style/app.css');

const MODULE_NAME = 'talkative';

// Declare components
angular.module(MODULE_NAME, [])
.component('landingPage', {
  template: require('./components/landing-page.html')
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
