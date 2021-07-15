export default class Timer extends Croquet.Model {
  init(options) {
    this.count = 0;
    this.identifier = options ? options.eventsIdentifier : this.id;

    this.subscribe(this.identifier, "reset", this.resetCounter);
    this.future(1000).tick();
  }

  resetCounter() {
    this.count = 0;
    this.publish(this.identifier, "update", this.count);
  }

  tick() {
    this.count++;
    this.publish(this.identifier, "update", this.count);
    this.future(1000).tick();
  }
}

export class TimerView extends Croquet.View {
  constructor(model, domNode, eventsIdentifier = null) {
    super(model);
    this.model = model;
    this.domNode = domNode;
    this.identifier = eventsIdentifier || this.model.id;

    this.subscribe(this.identifier, "update", this.handleUpdate);

    domNode.onclick = (event) => this.onclick(event);
  }

  onclick() {
    this.publish(this.identifier, "reset");
  }

  handleUpdate(seconds) {
    this.domNode.textContent = this.toISOTime(seconds);
  }

  toISOTime(seconds) {
    const time = new Date(seconds * 1000).toISOString();

    return seconds > 3600 ? time.substr(11, 8) : time.substr(14, 5);
  }
}
