import Timer, { TimerView } from "./Timer";
import Toast, { ToastView } from "./Toast";
import SpeakersQueue from "./SpeakersQueue";
import SpeakersQueueView from "./SpeakersQueueView";
import SpeakerFeedback, { SpeakerFeedbackView } from "./SpeakerFeedback";
import Notes from "./Notes";
import NotesView from "./NotesView";

class App extends Croquet.Model {
  init() {
    this.globalTimer = Timer.create();
    this.speakersQueue = SpeakersQueue.create();
    this.speakerTimer = Timer.create({ eventsIdentifier: "speakerTimer" });
    this.speakerFeedback = SpeakerFeedback.create();
    this.notes = Notes.create();
    this.toast = Toast.create();
  }
}

class AppView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    new TimerView(model.globalTimer, globalTimer);
    new SpeakersQueueView(model.speakersQueue);
    new TimerView(model.speakerTimer, speakerTimer, "speakerTimer");
    new SpeakerFeedbackView(model.speakerFeedback, like, "likes");
    new SpeakerFeedbackView(model.speakerFeedback, dislike, "dislikes");
    new NotesView(model.notes);
    new ToastView(model.toast);
  }
}

App.register("App");
Timer.register("GlobalTimer");
SpeakersQueue.register("SpeakersQueue");
SpeakerFeedback.register("SpeakerFeedback");
Notes.register("Notes");
Toast.register("Toast");

Croquet.Session.join({
  appId: "io.codepen.croquet.enqueueApp",
  name: "encolap",
  password: "secret",
  model: App,
  view: AppView,
});
