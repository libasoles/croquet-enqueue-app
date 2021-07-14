import SpeakersQueue from "./SpeakersQueue";
import SpeakersQueueView from "./SpeakersQueueView";
import Notes from "./Notes";
import NotesView from "./NotesView";

class App extends Croquet.Model {
  init() {
    this.speakersQueue = SpeakersQueue.create();
    this.notes = Notes.create();
  }
}

class AppView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    new SpeakersQueueView(model.speakersQueue);
    new NotesView(model.notes);
  }
}

App.register("App");
SpeakersQueue.register("SpeakersQueue");
Notes.register("Notes");

Croquet.Session.join({
  appId: "io.codepen.croquet.enqueueApp",
  name: "encolap",
  password: "secret",
  model: App,
  view: AppView,
});
