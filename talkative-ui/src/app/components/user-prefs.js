/* global $ */
module.exports = class UserPreferencesCtrl {
  constructor($element) {
    // TODO this will be replaced asynchronously
    // with the values from the backend as the
    // component loads
    this.phoneNumber = 1234567890;
    this.promptInterval = '10';
    this.newsFreq = 2;
    this.entertainmentFreq = 4;
    this.factsFreq = 6;
    this.romanceFreq = 10;

    this.editingPhoneNumber = false;
    this.$element = $element;
  }

  togglePhoneNumber() {
    this.editingPhoneNumber = !this.editingPhoneNumber;
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
