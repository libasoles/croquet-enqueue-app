export default class Notes extends Croquet.Model {
  init() {
    this.copy = "";
    this.editors = new Set();

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("sharedNotes", "toggleEdition", this.toggleEdition);
    this.subscribe("sharedNotes", "push", this.updateNotes);
  }

  toggleEdition({ viewId, isEditing }) {
    if (isEditing) {
      this.editors.add(viewId);
    } else {
      this.editors.delete(viewId);
    }

    this.publish("sharedNotes", "numberOfEditors", this.numberOfEditors());
  }

  updateNotes(event) {
    this.copy = event.value;

    this.publish("sharedNotes", "update", event);
  }

  numberOfEditors() {
    return this.editors.size;
  }
}
