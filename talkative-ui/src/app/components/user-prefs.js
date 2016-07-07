/* global $ */
module.exports = class UserPreferencesCtrl {
  constructor($element, UserService) {
    this.UserService = UserService;
    this.$element = $element;
    this.editingPhoneNumber = false;

    // lookup table of frequency choices
    this.frequencyOptions = [
      {id: 5, text: 'Every 5 minutes'},
      {id: 10, text: 'Every 10 minutes'},
      {id: 15, text: 'Every 15 minutes'},
      {id: 30, text: 'Every 30 minutes'},
      {id: 60, text: 'Every 1 hour'},
      {id: 120, text: 'Every 2 hours'},
      {id: 180, text: 'Every 3 hours'}
    ];

    UserService.get()
    .then((profile) => {
      this.freqEnabled = profile.active;
      this.phoneNumber = profile.phone;
      this.newsFreq = profile.newsweight;
      this.entertainmentFreq = profile.entertainmentweight;
      this.factsFreq = profile.factsweight;
      const option = this.frequencyOptions.filter((e) => e.id === profile.frequency);
      this.promptInterval = option.length > 0 ? option[0] : this.frequencyOptions[2];
    });
  }

  togglePhoneNumber() {
    this.editingPhoneNumber = !this.editingPhoneNumber;
  }

  incrementNewsFreq() { this.newsFreq = Number(this.newsFreq) + 1; this.save(); }
  decrementNewsFreq() { this.newsFreq = Number(this.newsFreq) - 1; this.save(); }
  incrementEntertainmentFreq() { this.entertainmentFreq = Number(this.entertainmentFreq) + 1; this.save(); }
  decrementEntertainmentFreq() { this.entertainmentFreq = Number(this.entertainmentFreq) - 1; this.save(); }
  incrementFactsFreq() { this.factsFreq = Number(this.factsFreq) + 1; this.save(); }
  decrementFactsFreq() { this.factsFreq = Number(this.factsFreq) - 1; this.save(); }

  save() {
    this.saving = true;
    const data = {
      phone: this.phoneNumber ? this.phoneNumber.trim() : '',
      active: this.freqEnabled,
      frequency: this.promptInterval.id,
      newsweight: Number(this.newsFreq),
      entertainmentweight: Number(this.entertainmentFreq),
      factsweight: Number(this.factsFreq)
    };
    this.UserService.update(data)
    .then(() => {
      this.saving = false;
    })
    .catch(() => {
      this.saving = false;
    });
  }

  test() {
    alert('Demo-lition, man!');
  }

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

// minification-safe
module.exports.$inject = ['$element', 'UserService'];
