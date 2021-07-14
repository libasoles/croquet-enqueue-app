export default class Notes extends Croquet.Model {
  init() {
    this.copy = "";
    this.editors = new Set();

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("sharedNotes", "push", this.updateNotes);
    this.subscribe("sharedNotes", "toggleEditor", this.toggleEditor);
  }

  updateNotes(event) {
    this.copy = event.value;

    this.publish("sharedNotes", "update", event);
  }

  toggleEditor({ viewId, isEditing }) {
    if (isEditing) {
      this.editors.add(viewId);
    } else {
      this.editors.delete(viewId);
    }

    this.publish("sharedNotes", "numberOfEditors", this.numberOfEditors());
  }

  numberOfEditors() {
    return this.editors.size;
  }
}
