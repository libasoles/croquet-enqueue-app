import { createElement, displayModal, hideModal, toggleModal } from "./utils";

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
    notificationsBell.onclick = (event) => this.onToggleNotifications(event);

    feedbackModal.querySelector(".close").onclick = () =>
      hideModal(feedbackModal);
    notificationsModal.querySelector(".close").onclick = () => {
      hideModal(notificationsModal);
      notificationsBell.classList.remove("active");
    };
  }

  onWriteFeedback() {
    const currentSpeaker = this.speakersQueue.getCurrentSpeaker();

    displayModal(feedbackModal);

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

    hideModal(feedbackModal);
  }

  onToggleNotifications() {
    toggleModal(notificationsModal, {
      onDisplay: () => {
        notificationsBell.classList.add("active");
        notificationsBell.classList.remove("unread");
      },
      onHide: () => {
        notificationsBell.classList.remove("active");
      },
    });
  }

  handleIncomingFeedback(feedback) {
    if (feedback.for.viewId !== this.viewId) return;

    notificationsBell.classList.add("unread");

    this.publish("toast", "display", {
      sticky: true,
      message: `🔔 ${feedback.from.name} te dejo feedack.`,
    });

    this.prependFeedbackRow(feedback);

    feedbackInput.value = "";
  }

  prependFeedbackRow(feedback) {
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
