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
    sharedNotesToggleEdition.onchange = (event) => this.onToggleEdition(event);
    sharedNotes.keypress = (event) => this.onNotesChange(event);
    sharedNotes.onkeypress = (event) => this.onNotesChange(event);
  }

  onToggleEdition(event) {
    const isEditing = event.target.checked;

    this.publish("sharedNotes", "toggleEditor", {
      viewId: this.viewId,
      isEditing,
    });

    sharedNotes.disabled = !isEditing;
  }

  onNotesChange(keyboardEvent) {
    keyboardEvent.preventDefault();

    const cursorPosition = keyboardEvent.target.selectionStart;
    const previousText = keyboardEvent.target.value;

    const nextText =
      previousText.substring(0, cursorPosition) +
      keyboardEvent.key +
      previousText.substring(cursorPosition, previousText.length);

    this.publish("sharedNotes", "push", {
      viewId: this.viewId,
      value: nextText,
      cursorPosition,
    });
  }

  handleSharedNotesUpdate(event) {
    sharedNotes.value = event.value;

    if (event.viewId === this.viewId) {
      const cursorPosition = event.cursorPosition + 1;
      sharedNotes.selectionStart = cursorPosition;
      sharedNotes.selectionEnd = cursorPosition;
    }
  }

  handleNumberOfEditors(number) {
    sharedNotesEditors.textContent = number ? number + " editando" : "";
  }
}
