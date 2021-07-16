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
    this.subscribe("status", "display", this.handleDisplayStatus);
  }

  listenToUserEvents() {
    enqueueMe.onclick = (event) => this.onEnqueueSpeaker(event);
    speakerFinished.onclick = (event) => this.onRemoveSpeaker(event);
    speakerName.onkeyup = (event) => this.onSpeakerNameChange(event);
  }

  letSpeakerTalk({ name }) {
    currentSpeakerName.textContent = name;
    currentSpeaker.style.visibility = "visible";
    speakerContext.style.visibility = "visible";
    speakerFinished.style.visibility = "visible";
  }

  enqueueSpeaker({ name, viewId }) {
    const speaker = document.createElement("li");
    speaker.setAttribute("data-viewId", viewId);
    speaker.className = "speakerRow";
    speaker.appendChild(document.createTextNode(name));

    if (this.viewId === viewId) {
      const closeButton = document.createElement("button");
      closeButton.className = "button icon eject";
      closeButton.textContent = "x";
      closeButton.onclick = this.onRemoveSelf.bind(this);
      speaker.appendChild(closeButton);
    }

    queuedSpeakers.appendChild(speaker);
  }

  displayMessage(message) {
    this.publish("status", "update", { viewId: this.viewId, message });
  }

  onSpeakerNameChange() {
    if (speakerName.value) {
      speakerName.classList.remove("errored");
      this.displayMessage("");
    }
  }

  onEnqueueSpeaker() {
    if (!speakerName.value) {
      this.displayMessage("Completá tu nombre 👽");
      speakerName.classList.add("errored");
      speakerName.focus();
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

  handleCurrentSpeakerTurn(speaker) {
    if (speaker.name) {
      this.displayMessage("Esta hablando " + speaker.name);
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

  handleAddSpeaker(speaker) {
    this.enqueueSpeaker(speaker);
  }

  handleRemoveSpeaker({ viewId }) {
    for (const row of queuedSpeakers.childNodes) {
      if (row.getAttribute("data-viewId") === viewId)
        queuedSpeakers.removeChild(row);
    }
  }

  handlePreventRequeue() {
    this.displayMessage("Ya estas para hablar.");
  }

  handleEmptyQueue() {
    currentSpeakerName.textContent = "Quien quiere hablar? 👀";
    speakerFinished.style.visibility = "hidden";
    speakerContext.style.visibility = "hidden";

    this.displayMessage("");
  }

  handleDisplayStatus() {
    message.textContent = this.model.status.get(this.viewId) || "";
  }
}
