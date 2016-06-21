module.exports = class LandingPageCtrl {
  constructor($interval) {
    // store $interval in the class for use in $destroy
    this.$interval = $interval;

    // loop frame from 0->1->2->3
    this.frame = 0;
    this.counter = $interval(() => {
      this.frame = (this.frame + 1)%4;
    }, 2500);
  }

  $destroy() {
    // cancel interval
    if (this.counter) {
      this.$interval.cancel(this.counter);
    }
  }
};
