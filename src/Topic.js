export default class Topic extends Croquet.Model {
  init() {
    this.subscribe("topic", "update", this.updateStatus);
  }

  updateStatus(topic) {
    this.publish("topic", "updated", topic);
  }
}

export class TopicView extends Croquet.View {
  constructor(model) {
    super(model);
    this.model = model;

    this.subscribe("topic", "updated", this.handleUpdateTopic);

    topic.onchange = this.onchange;
  }

  handleUpdateTopic(topic) {
    topic.textContent = topic;
  }

  onchange(event) {
    this.publish("topic", "update", event.target.value);
  }
}
