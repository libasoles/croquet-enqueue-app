export default class Notes extends Croquet.Model {
  init() {
    this.copy = "";
    this.visible = new Map();
    this.editors = new Set();

    this.subscribeToEvents();
  }

  subscribeToEvents() {
    this.subscribe("sharedNotes", "toggleVisibility", this.toggleVisibility);
    this.subscribe("sharedNotes", "toggleEdition", this.toggleEdition);
    this.subscribe("sharedNotes", "push", this.updateNotes);
  }

  toggleVisibility({ viewId }) {
    this.visible.set(viewId, !this.visible.get(viewId));
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
