import { createCloseButton } from "./utils";

export default class Toast extends Croquet.Model {
  init() {
    this.subscribe("status", "broadcast", this.updateStatus);
  }

  updateStatus(status) {
    this.publish("status", "display", status);
  }
}

export class ToastView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    this.subscribe("status", "display", this.handleDisplayStatus);
  }

  handleDisplayStatus({ message }) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message || "";

    const closeButton = createCloseButton({
      className: "",
      callback: () => this.close(toast),
    });

    toast.appendChild(closeButton);

    messages.appendChild(toast);

    setTimeout(() => {
      this.close(toast);
    }, 2500);
  }

  close(toast) {
    if (messages.contains(toast)) messages.removeChild(toast);
  }
}
