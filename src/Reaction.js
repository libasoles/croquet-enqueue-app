export default class Reaction extends Croquet.Model {
  init() {
    this.likes = new Set();
    this.dislikes = new Set();

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("reaction", "likes", this.like);
    this.subscribe("reaction", "dislikes", this.dislike);
    this.subscribe("reaction", "reset", this.reset);
  }

  like(viewId) {
    this.tally("likes", viewId);
  }

  dislike(viewId) {
    this.tally("dislikes", viewId);
  }

  tally(type, viewId) {
    if (!this[type].has(viewId)) {
      this[type].add(viewId);
    } else {
      this[type].delete(viewId);
    }

    this.notify();
  }

  reset() {
    this.likes.clear();
    this.dislikes.clear();

    this.notify();
  }

  notify() {
    this.publish("reaction", "update", {
      likes: this.countOf("likes"),
      dislikes: this.countOf("dislikes"),
    });
  }

  countOf(type) {
    return this[type].size;
  }
}
