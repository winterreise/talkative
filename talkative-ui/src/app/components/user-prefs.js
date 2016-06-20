/* global $ */
module.exports = class UserPreferencesCtrl {
  constructor($element) {
    // lookup table of frequency choices
    this.frequencyOptions = [
      {id: '5', text: 'Every 5 minutes'},
      {id: '10', text: 'Every 10 minutes'},
      {id: '15', text: 'Every 15 minutes'},
      {id: '30', text: 'Every 30 minutes'},
      {id: '60', text: 'Every 1 hour'},
      {id: '120', text: 'Every 2 hours'},
      {id: '180', text: 'Every 3 hours'},
      {id: 'twice', text: 'Twice daily'},
      {id: 'mornings', text: 'Mornings'},
      {id: 'evenings', text: 'Evenings'}
    ];

    // TODO this will be replaced asynchronously
    // with the values from the backend as the
    // component loads
    this.freqEnabled = true;
    this.phoneNumber = 1234567890;
    this.promptInterval = this.frequencyOptions[1];
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

  incrementNewsFreq() { this.newsFreq += 1; }
  decrementNewsFreq() { this.newsFreq -= 1; }
  incrementEntertainmentFreq() { this.entertainmentFreq += 1; }
  decrementEntertainmentFreq() { this.entertainmentFreq -= 1; }
  incrementFactsFreq() { this.factsFreq += 1; }
  decrementFactsFreq() { this.factsFreq -= 1; }
  incrementRomanceFreq() { this.romanceFreq += 1; }
  decrementRomanceFreq() { this.romanceFreq -= 1; }


  // connect foundation to angular component lifecycle
  $postLink() {
    $(this.$element).foundation();
  }

  // turn off foundation when this component goes away
  // $onDestroy() {
  //   TODO this doesn't seem to work properly
  //   $(this.$element).foundation('destroy');
  // }
};
