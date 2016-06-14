/* global $ */
module.exports = class UserPreferencesCtrl {
  constructor($element) {
    this.phoneNumber = 1234567890;
    this.editingPhoneNumber = false;
    this.$element = $element;
  }

  // connect foundation to angular component lifecycle
  $postLink() {
    $(this.$element).foundation();
  }

  // turn off foundation when this component goes away
  $onDestroy() {
    $(this.$element).foundation('destroy');
  }
};
