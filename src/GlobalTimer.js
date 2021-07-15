export default class GlobalTimer extends Croquet.Model {
  init() {
    this.count = 0;
    this.subscribe("timer", "reset", this.resetCounter);
    this.future(1000).tick();
  }

  resetCounter() {
    this.count = 0;
    this.publish("timer", "update", this.count);
  }

  tick() {
    this.count++;
    this.publish("timer", "update", this.count);
    this.future(1000).tick();
  }
}

export class GlobalTimerView extends Croquet.View {
  constructor(model) {
    super(model);
    globalTimer.onclick = (event) => this.onclick(event);
    this.subscribe("timer", "update", this.handleUpdate);
  }

  onclick() {
    this.publish("timer", "reset");
  }

  handleUpdate(seconds) {
    globalTimer.textContent = this.toISOTime(seconds);
  }

  toISOTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
  }
}
