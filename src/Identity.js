import { display, hide, isSelf, readCookie } from "./utils";

export default class Identity extends Croquet.Model {
  init() {
    this.connectedUsers = {};
    this.subscribe(this.sessionId, "view-join", this.addUser);
    this.subscribe(this.sessionId, "view-exit", this.deleteUser);
    this.subscribe("identity", "nameChanged", this.updateUser);
  }

  addUser(viewId) {
    this.connectedUsers[viewId] = {
      start: this.now(),
      viewId,
      userName: "",
    };
  }

  updateUser({ viewId, userName }) {
    if (this.connectedUsers[viewId])
      this.connectedUsers[viewId].userName = userName;
  }

  deleteUser(viewId) {
    delete this.connectedUsers[viewId];
  }

  user(viewId) {
    return this.connectedUsers[viewId];
  }

  me() {
    return this.connectedUsers[this.sessionId];
  }
}

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

      this.publish("identity", "nameChanged", {
        viewId: this.viewId,
        userName,
      });
    }
  }

  subscribeToEvents() {
    this.subscribe("identity", "validationError", this.handleValidationError);
    this.subscribe("queue", "push", this.handleCreate);
  }

  listenToUserEvents() {
    speakerName.onkeyup = (event) => this.onUserTyping(event);
    speakerName.change = (event) => this.onSpeakerNameChange(event);
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

  onUserTyping() {
    if (speakerName.value) {
      speakerName.classList.remove("errored");
    }
  }

  onSpeakerNameChange() {
    this.publish("identity", "changed", {
      viewId: this.viewId,
      userName: speakerName.value,
    });
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
