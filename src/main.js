import Timer, { TimerView } from "./Timer";
import SpeakersQueue from "./SpeakersQueue";
import SpeakersQueueView from "./SpeakersQueueView";
import Notes from "./Notes";
import NotesView from "./NotesView";

class App extends Croquet.Model {
  init() {
    this.globalTimer = Timer.create();
    this.speakersQueue = SpeakersQueue.create();
    this.speakerTimer = Timer.create();
    this.notes = Notes.create();
  }
}

class AppView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    new TimerView(model.globalTimer, globalTimer);
    new TimerView(model.speakerTimer, speakerTimer);
    new SpeakersQueueView(model.speakersQueue);
    new NotesView(model.notes);
  }
}

App.register("App");
Timer.register("GlobalTimer");
SpeakersQueue.register("SpeakersQueue");
Notes.register("Notes");

Croquet.Session.join({
  appId: "io.codepen.croquet.enqueueApp",
  name: "encolap",
  password: "secret",
  model: App,
  view: AppView,
});
