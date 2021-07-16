import { createElement, display, hide } from "./utils";

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
        name: speakerName.value || "anonymous",
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

    const notification = createElement({
      type: "li",
      className: "notification",
    });

    const content = createElement({
      type: "span",
      className: "notificationContent",
      textContent: feedback.message,
    });

    const author = createElement({
      type: "span",
      className: "notificationAuthor",
      textContent: feedback.from.name,
    });

    notification.appendChild(content);
    notification.appendChild(author);

    notificationsList.prepend(notification);
  }
}
