import { isSelf } from "./utils";

export default class SpeakersQueue extends Croquet.Model {
  init({ identity }) {
    this.identity = identity;
    this.speakers = new Map();
    this.interventies = new Map();
    this.currentSpeaker = {};

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("queue", "push", this.addSpeaker);
    this.subscribe("queue", "next", this.nextSpeaker);
    this.subscribe("queue", "remove", this.removeSpeaker);
    this.subscribe("queue", "intervene", this.intervene);
    this.subscribe("queue", "removeInterventie", this.removeIntervene);
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
      this.resetSpeakerContext();

      return;
    }

    if (isSelf(this.currentSpeaker.viewId, speaker.viewId)) {
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

    if (!speaker) return;

    this.speakers.delete(viewId);
    this.publish("queue", "removed", speaker);
  }

  getCurrentSpeaker() {
    return this.currentSpeaker;
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
    this.resetSpeakerContext();
  }

  intervene(viewId) {
    const speaker = this.identity.user(viewId);

    if (this.interventies.has(speaker.viewId)) return;

    this.interventies.set(speaker.viewId, speaker);
    this.publish("queue", "addIntervention", speaker);
  }

  removeIntervene(viewId) {
    const speaker = this.interventies.get(viewId);

    if (!speaker) return;

    this.interventies.delete(speaker.viewId, speaker);
    this.publish("queue", "revomeIntervention", speaker);
  }

  resetSpeakerContext() {
    this.publish("reaction", "reset");
    this.publish("speakerTimer", "reset");
    this.interventies.clear();
  }
}
