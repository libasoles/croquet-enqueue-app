import { toggleModal, hideModal } from "./utils";

export default class NotesView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    this.hydrate();

    this.subscribeToEvents();
    this.listenToUserEvents();
  }

  hydrate() {
    if (this.model.copy) sharedNotes.value = this.model.copy;

    if (this.model.numberOfEditors())
      this.handleNumberOfEditors(this.model.numberOfEditors());
  }

  subscribeToEvents() {
    this.subscribe("sharedNotes", "update", this.handleSharedNotesUpdate);
    this.subscribe(
      "sharedNotes",
      "numberOfEditors",
      this.handleNumberOfEditors
    );
  }

  listenToUserEvents() {
    toggleEditorVisibility.onclick = (event) => this.onToggleVisibility(event);
    sharedNotesToggleEdition.onchange = (event) => this.onToggleEdition(event);
    sharedNotes.oninput = (event) => this.onNotesChange(event);

    sharedNotesModal.querySelector(".close").onclick = () =>
      hideModal(sharedNotesModal);
  }

  onToggleVisibility() {
    toggleModal(sharedNotesModal, {
      onDisplay: () => toggleEditorVisibility.classList.add("active"),
      onHide: () => toggleEditorVisibility.classList.remove("active"),
    });
  }

  onToggleEdition(event) {
    const isEditing = event.target.checked;

    this.publish("sharedNotes", "toggleEdition", {
      viewId: this.viewId,
      isEditing,
    });

    sharedNotes.disabled = !isEditing;

    if (isEditing) sharedNotes.focus();
  }

  onNotesChange(keyboardEvent) {
    keyboardEvent.preventDefault();

    const cursorPosition = keyboardEvent.target.selectionStart;

    this.publish("sharedNotes", "push", {
      viewId: this.viewId,
      value: keyboardEvent.target.value,
      cursorPosition,
    });
  }

  handleSharedNotesUpdate(event) {
    sharedNotes.value = event.value;

    if (event.viewId === this.viewId) {
      const cursorPosition = event.cursorPosition;
      sharedNotes.selectionStart = cursorPosition;
      sharedNotes.selectionEnd = cursorPosition;
    }
  }

  handleNumberOfEditors(number) {
    sharedNotesEditors.textContent = number ? number + " editando" : "";
  }
}
