export default class NotesView extends Croquet.View {
    constructor(model) {
      super(model);     
      this.model = model;
  
      this.hydrate();
  
      this.subscribeToEvents();
      this.listenToUserEvents();
    }  
  
    hydrate() {    
      if(this.model.copy)
        sharedNotes.value = this.model.copy;
  
      if(this.model.numberOfEditors())
        this.handleNumberOfEditors(this.model.numberOfEditors());
    }
  
    subscribeToEvents() {        
      this.subscribe("sharedNotes", "update", this.handleSharedNotesUpdate);
      this.subscribe("sharedNotes", "numberOfEditors", this.handleNumberOfEditors);
    }
  
    listenToUserEvents() {
      sharedNotesToggleEdition.onchange = event => this.onToggleEdition(event);
      sharedNotes.oninput = event => this.onNotesChange(event);
    }
  
    onToggleEdition(event) {
      const isEditing = event.target.checked;
  
      this.publish("sharedNotes", "toggleEditor", {
        viewId: this.viewId,
        isEditing
      });
  
      sharedNotes.disabled = !isEditing;
    }
  
    onNotesChange(keyboardEvent) {
      keyboardEvent.preventDefault(); // no funciona con oninput
  
      this.publish("sharedNotes", "push", {
        viewId: this.viewId,
        value: keyboardEvent.target.value,
        selectionStart: keyboardEvent.target.selectionStart,
        selectionEnd: keyboardEvent.target.selectionEnd
      });
    }
  
    handleSharedNotesUpdate(event) {
      sharedNotes.value = event.value;
      sharedNotes.selectionStart = event.selectionStart;
      sharedNotes.selectionEnd = event.selectionEnd;
    }
  
    handleNumberOfEditors(number) {
      sharedNotesEditors.textContent = number ? number + " editando" : "";
    }
  }