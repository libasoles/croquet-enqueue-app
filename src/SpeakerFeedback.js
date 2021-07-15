export default class SpeakerFeedback extends Croquet.Model {
  init() {
    this.likes = new Set();
    this.dislikes = new Set();

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("speakerFeedback", "likes", this.like);
    this.subscribe("speakerFeedback", "dislikes", this.dislike);
    this.subscribe("speakerFeedback", "reset", this.reset);
  }

  like(viewId) {
    this.likes.add(viewId);

    this.notify();
  }

  dislike(viewId) {
    this.dislikes.add(viewId);

    this.notify();
  }

  reset(viewId) {
    this.likes.clear();
    this.dislikes.clear();

    this.notify();
  }

  notify() {
    this.publish("speakerFeedback", "update", {
      likes: this.countOf("likes"),
      dislikes: this.countOf("dislikes"),
    });
  }

  countOf(type) {
    return this[type].size;
  }
}

export class SpeakerFeedbackView extends Croquet.View {
  constructor(model, domNode, type) {
    super(model);
    this.model = model;
    this.domNode = domNode;
    this.type = type;

    this.hydrate();

    this.subscribe("speakerFeedback", "update", this.handleUpdate);

    domNode.onclick = (event) => this.onclick(event);
  }

  hydrate() {
    this.displayCount(this.model.countOf(this.type));
  }

  onclick() {
    this.publish("speakerFeedback", this.type, this.viewId);
  }

  handleUpdate(feedback) {
    this.displayCount(feedback[this.type]);
  }

  displayCount(count) {
    this.domNode.querySelector(".count").textContent = count;
  }
}
