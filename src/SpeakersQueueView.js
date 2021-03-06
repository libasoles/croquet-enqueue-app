import {
  createElement,
  createCloseButton,
  display,
  hide,
  isSelf,
} from "./utils";

export default class SpeakersQueueView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    this.hydrate();

    this.subscribeToEvents();
    this.listenToUserEvents();
  }

  hydrate() {
    if (this.model.isSomeoneTalking())
      this.handleCurrentSpeakerTurn(this.model.currentSpeaker);
    if (!this.model.isQueueEmpty()) {
      queuedSpeakers.innerHTML = "";
      this.handleAddAll(this.model.speakers);
    }
  }

  subscribeToEvents() {
    this.subscribe("queue", "current", this.handleCurrentSpeakerTurn);
    this.subscribe("queue", "list", this.handleAddAll);
    this.subscribe("queue", "addFirst", this.handleAddFirstSpeaker);
    this.subscribe("queue", "add", this.handleAddSpeaker);
    this.subscribe("queue", "removed", this.handleRemoveSpeaker);
    this.subscribe("queue", "empty", this.handleEmptyQueue);
    this.subscribe("queue", "alreadyQueued", this.handlePreventRequeue);
    this.subscribe("queue", "alreadyTalking", this.handlePreventRequeue);
    this.subscribe("queue", "addIntervention", this.handleIntervention);
    this.subscribe(
      "queue",
      "revomeIntervention",
      this.handleRemoveIntervention
    );
  }

  listenToUserEvents() {
    enqueueMe.onclick = (event) => this.onEnqueueSpeaker(event);
    speakerFinished.onclick = (event) => this.onRemoveSpeaker(event);
    interveneConversation.onclick = (event) => this.onIntervention(event);
  }

  letSpeakerTalk({ name }) {
    currentSpeakerName.textContent = name;
    display(currentSpeaker);
    display(speakerContext);
    display(speakerFinished);
  }

  enqueueSpeaker({ name, viewId }) {
    const speaker = createElement({
      type: "li",
      className: "speakerRow",
    });

    speaker.setAttribute("data-viewId", viewId);
    speaker.appendChild(document.createTextNode(name));

    if (isSelf(this.viewId, viewId)) {
      this.appendCloseButton(speaker);
    }

    queuedSpeakers.appendChild(speaker);
  }

  appendCloseButton(speaker) {
    const closeButton = createCloseButton({
      className: "eject",
      callback: this.onRemoveSelf.bind(this),
    });

    speaker.appendChild(closeButton);
  }

  displayMessage(message) {
    this.publish("toast", "display", { viewId: this.viewId, message });
  }

  broadcastMessage(message) {
    this.publish("toast", "broadcast", { viewId: this.viewId, message });
  }

  onEnqueueSpeaker() {
    if (!speakerName.value) {
      this.displayMessage("Complet?? tu nombre ????");

      this.publish("identity", "validationError", { viewId: this.viewId });

      return;
    }

    this.publish("queue", "push", {
      viewId: this.viewId,
      name: speakerName.value,
    });
  }

  onRemoveSpeaker() {
    this.publish("queue", "next");
  }

  onRemoveSelf() {
    this.publish("queue", "remove", this.viewId);
  }

  onIntervention() {
    this.publish("queue", "intervene", this.viewId);
  }

  handleCurrentSpeakerTurn(speaker) {
    if (speaker.name && isSelf(speaker.viewId, this.viewId)) {
      this.broadcastMessage("Esta hablando " + speaker.name);
    }

    if (queuedSpeakers.firstChild)
      queuedSpeakers.removeChild(queuedSpeakers.firstChild);

    this.letSpeakerTalk(speaker);
  }

  handleAddAll(list) {
    list.forEach(this.handleAddSpeaker.bind(this));
  }

  handleAddFirstSpeaker(speaker) {
    this.letSpeakerTalk(speaker);
  }

  handleIntervention({ viewId, userName }) {
    const speakerRow = createElement({
      type: "div",
      className: "user",
    });

    speakerRow.setAttribute("data-viewId", viewId);

    const speakerName = createElement({
      type: "span",
      className: "name",
      textContent: `??? ${userName}`,
    });

    speakerRow.appendChild(speakerName);

    if (isSelf(this.viewId, viewId)) {
      const closeButton = createCloseButton({
        callback: () => {
          this.publish("queue", "removeInterventie", this.viewId);
        },
      });

      speakerRow.appendChild(closeButton);
    }

    interventions.appendChild(speakerRow);
  }

  handleRemoveIntervention({ viewId }) {
    for (const row of interventions.childNodes) {
      if (row.getAttribute("data-viewId") === viewId)
        interventions.removeChild(row);
    }
  }

  handleAddSpeaker(speaker) {
    this.enqueueSpeaker(speaker);
  }

  handleRemoveSpeaker({ viewId }) {
    for (const row of queuedSpeakers.childNodes) {
      if (row.getAttribute("data-viewId") === viewId)
        queuedSpeakers.removeChild(row);
    }
  }

  handlePreventRequeue({ viewId }) {
    if (!isSelf(this.viewId, viewId)) return;

    this.displayMessage("Ya estas para hablar.");
  }

  handleEmptyQueue() {
    currentSpeakerName.textContent = "Quien quiere hablar? ????";
    hide(speakerFinished);
    hide(speakerContext);
  }
}
