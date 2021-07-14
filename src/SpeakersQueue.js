export default class SpeakersQueue extends Croquet.Model {
  init() {
    this.status = new Map();
    this.speakers = new Map();
    this.currentSpeaker = {};

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("queue", "push", this.addSpeaker);
    this.subscribe("queue", "next", this.nextSpeaker);
    this.subscribe("status", "update", this.updateStatus);
  }

  isSomeoneTalking() {
    return typeof this.currentSpeaker.viewId !== "undefined";
  }

  isQueueEmpty() {
    return this.speakers.size === 0;
  }

  addSpeaker(speaker) {
    if (!speaker) return;

    if (!this.isSomeoneTalking()) {
      this.currentSpeaker = speaker;
      this.publish("queue", "addFirst", speaker);
      return;
    }

    if (this.currentSpeaker.viewId === speaker.viewId) {
      this.publish("queue", "alreadyTalking", speaker);
      return;
    }

    if (this.speakers.has(speaker.viewId)) {
      this.publish("queue", "alreadyQueued", speaker);
      return;
    }

    this.speakers.set(speaker.viewId, speaker);
    this.publish("queue", "add", speaker);
  }

  nextSpeaker() {
    if (this.speakers.size === 0) {
      this.currentSpeaker = {};
      this.publish("queue", "empty");
      return;
    }

    this.currentSpeaker = this.speakers.values().next().value;
    this.speakers.delete(this.currentSpeaker.viewId);

    this.publish("queue", "current", this.currentSpeaker);
  }

  updateStatus({ viewId, message }) {
    this.status.set(viewId, message);

    this.publish("status", "display");
  }
}
