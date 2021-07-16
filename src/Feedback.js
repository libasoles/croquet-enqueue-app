export default class Feedback extends Croquet.Model {
  init() {
    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("feedback", "submit", this.submitFeedback);
  }

  submitFeedback(feedback) {
    this.publish("feedback", "deliver", { feedback });
  }
}
