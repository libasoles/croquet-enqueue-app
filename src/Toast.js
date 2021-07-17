import { createElement, createCloseButton } from "./utils";

export default class Toast extends Croquet.Model {
  init() {
    this.subscribe("toast", "broadcast", this.updateStatus);
  }

  updateStatus(status) {
    this.publish("toast", "display", status);
  }
}

export class ToastView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    this.subscribe("toast", "display", this.handleDisplayStatus);
  }

  handleDisplayStatus({ message, sticky = false }) {
    const toast = createElement({
      type: "div",
      className: "toast",
      textContent: message || "",
    });

    const closeButton = createCloseButton({
      className: "",
      callback: () => this.close(toast),
    });

    toast.appendChild(closeButton);

    messages.appendChild(toast);

    if (sticky) return;

    setTimeout(() => {
      this.close(toast);
    }, 2500);
  }

  close(toast) {
    if (messages.contains(toast)) messages.removeChild(toast);
  }
}
