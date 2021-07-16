import { display, hide } from "./utils";

export default class FeedbackView extends Croquet.View {
  constructor(model, speakersQueue) {
    super(model);
    this.speakersQueue = speakersQueue;

    this.subscribe("feedback", "deliver", this.handleIncomingFeedback);

    this.listenToUserEvents();
  }

  listenToUserEvents() {
    writeFeedback.onclick = (event) => this.onWriteFeedback(event);
    submitFeedback.onclick = (event) => this.onSubmitFeedback(event);
    notificationsBell.onclick = (event) => this.onOpenNotifications(event);

    feedbackModal.querySelector(".close").onclick = () => hide(feedbackModal);
    notificationsModal.querySelector(".close").onclick = () =>
      hide(notificationsModal);
  }

  onWriteFeedback() {
    const currentSpeaker = this.speakersQueue.getCurrentSpeaker();

    display(feedbackModal);

    feedbackModal.querySelector(".title").textContent =
      "Feedback para " + currentSpeaker.name;
    feedbackInput.focus();
  }

  onSubmitFeedback(e) {
    e.preventDefault();
    this.publish("feedback", "submit", {
      from: {
        name: "anonymous",
        viewId: this.viewId,
      },
      for: this.speakersQueue.getCurrentSpeaker(),
      message: feedbackInput.value,
    });

    hide(feedbackModal);
  }

  onOpenNotifications() {
    notificationsBell.classList.remove("unread");

    display(notificationsModal);
  }

  handleIncomingFeedback(feedback) {
    if (feedback.for.viewId !== this.viewId) return;

    notificationsBell.classList.add("unread");

    const notification = document.createElement("li");
    notification.className = "notification";
    notification.appendChild(document.createTextNode(feedback.message));

    notificationsList.prepend(notification);
  }
}
