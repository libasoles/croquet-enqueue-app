export default class SpeakersQueue extends Croquet.Model {
  init() {
    this.speakers = new Map();
    this.currentSpeaker = {};

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("queue", "push", this.addSpeaker);
    this.subscribe("queue", "next", this.nextSpeaker);
    this.subscribe("queue", "remove", this.removeSpeaker);
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
      this.resetContext();

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

  removeSpeaker(viewId) {
    const speaker = this.speakers.get(viewId);

    if (speaker) {
      this.speakers.delete(viewId);

      this.publish("queue", "removed", speaker);
    }
  }

  nextSpeaker() {
    if (this.isQueueEmpty()) {
      this.currentSpeaker = {};
      this.publish("queue", "empty");

      return;
    }

    this.currentSpeaker = this.speakers.values().next().value;
    this.speakers.delete(this.currentSpeaker.viewId);

    this.publish("queue", "current", this.currentSpeaker);
    this.resetContext();
  }

  resetContext() {
    this.publish("speakerFeedback", "reset");
    this.publish("speakerTimer", "reset");
  }
}
