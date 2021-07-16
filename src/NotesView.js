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
  }

  onToggleVisibility() {
    const currentVisibility = sharedNotesContainer.style.visibility || "hidden";

    if (currentVisibility !== "hidden") {
      sharedNotesContainer.style.visibility = "hidden";
      toggleEditorVisibility.classList.remove("active");
    } else {
      sharedNotesContainer.style.visibility = "visible";
      toggleEditorVisibility.classList.add("active");
    }
  }

  onToggleEdition(event) {
    const isEditing = event.target.checked;

    this.publish("sharedNotes", "toggleEdition", {
      viewId: this.viewId,
      isEditing,
    });

    sharedNotes.disabled = !isEditing;
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
