export default class Timer extends Croquet.Model {
  init() {
    this.count = 0;
    this.subscribe(this.id, "reset", this.resetCounter);
    this.future(1000).tick();
  }

  resetCounter() {
    this.count = 0;
    this.publish(this.id, "update", this.count);
  }

  tick() {
    this.count++;
    this.publish(this.id, "update", this.count);
    this.future(1000).tick();
  }
}

export class TimerView extends Croquet.View {
  constructor(model, domNode) {
    super(model);
    this.model = model;
    this.domNode = domNode;

    domNode.onclick = (event) => this.onclick(event);
    this.subscribe(model.id, "update", this.handleUpdate);
  }

  onclick() {
    this.publish(this.model.id, "reset");
  }

  handleUpdate(seconds) {
    this.domNode.textContent = this.toISOTime(seconds);
  }

  toISOTime(seconds) {
    const time = new Date(seconds * 1000).toISOString();

    return seconds > 3600 ? time.substr(11, 8) : time.substr(14, 5);
  }
}
