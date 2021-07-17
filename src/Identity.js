import { display, hide, isSelf, readCookie } from "./utils";

export class IdentityView extends Croquet.View {
  constructor(model) {
    super(model);

    this.hydrate();

    this.subscribeToEvents();
    this.listenToUserEvents();
  }

  hydrate() {
    const userName = readCookie("userName") || "";

    if (userName) {
      speakerName.value = userName;
      this.displayIdentity(userName);
    }
  }

  subscribeToEvents() {
    this.subscribe("identity", "validationError", this.handleValidationError);
    this.subscribe("queue", "push", this.handleCreate);
  }

  listenToUserEvents() {
    speakerName.onkeyup = (event) => this.onSpeakerNameChange(event);
    identity.querySelector(".close").onclick = (event) =>
      this.onEditName(event);
  }

  handleCreate() {
    document.cookie = `userName=${speakerName.value}`;

    this.displayIdentity(speakerName.value);
  }

  handleValidationError({ viewId }) {
    if (isSelf(this.viewId, viewId)) {
      speakerName.classList.add("errored");
      speakerName.focus();
    }
  }

  onSpeakerNameChange() {
    if (speakerName.value) {
      speakerName.classList.remove("errored");
    }
  }

  onEditName() {
    speakerName.value = readCookie("userName");

    this.displayUserNameInput(speakerName.value);
  }

  displayIdentity(userName) {
    display(identity);
    hide(speakerName);
    identity.querySelector(".name").textContent = userName;
  }

  displayUserNameInput(userName) {
    speakerName.value = userName;

    hide(identity);
    display(speakerName);

    speakerName.focus();
  }
}
