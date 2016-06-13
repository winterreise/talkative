const angular = require('angular'); // eslint-disable-line

require('../style/app.css');

const MODULE_NAME = 'talkative';

// Declare components
angular.module(MODULE_NAME, [])
  .component('userPrefs', {
    template: require('./components/user-prefs.html'),
    controller: require('./components/user-prefs')
  });
