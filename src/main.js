import Timer, { TimerView } from "./Timer";
import Topic, { TopicView } from "./Topic";
import Toast, { ToastView } from "./Toast";
import { IdentityView } from "./Identity";
import SpeakersQueue from "./SpeakersQueue";
import SpeakersQueueView from "./SpeakersQueueView";
import Reaction from "./Reaction";
import ReactionView from "./ReactionView";
import Feedback from "./Feedback";
import FeedbackView from "./FeedbackView";
import Notes from "./Notes";
import NotesView from "./NotesView";

class App extends Croquet.Model {
  init() {
    this.globalTimer = Timer.create();
    this.topic = Topic.create();
    this.speakersQueue = SpeakersQueue.create();
    this.speakerTimer = Timer.create({ eventsIdentifier: "speakerTimer" });
    this.reaction = Reaction.create();
    this.feedback = Feedback.create();
    this.notes = Notes.create();
    this.toast = Toast.create();
  }
}

class AppView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    new TimerView(model.globalTimer, globalTimer);
    new TopicView(model.topic);
    new IdentityView(model);
    new SpeakersQueueView(model.speakersQueue);
    new TimerView(model.speakerTimer, speakerTimer, "speakerTimer");
    new ReactionView(model.reaction, like, "likes");
    new ReactionView(model.reaction, dislike, "dislikes");
    new FeedbackView(model.feedback, model.speakersQueue);
    new NotesView(model.notes);
    new ToastView(model.toast);
  }
}

App.register("App");
Timer.register("GlobalTimer");
Topic.register("Topic");
SpeakersQueue.register("SpeakersQueue");
Reaction.register("reaction");
Feedback.register("feedback");
Notes.register("Notes");
Toast.register("Toast");

Croquet.Session.join({
  appId: "io.codepen.croquet.enqueueApp",
  name: window.location.pathname,
  password: "secret",
  model: App,
  view: AppView,
});
