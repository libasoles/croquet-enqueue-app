export default class ReactionView extends Croquet.View {
  constructor(model, domNode, type) {
    super(model);
    this.model = model;
    this.domNode = domNode;
    this.type = type;

    this.hydrate();

    this.subscribe("reaction", "update", this.handleUpdate);

    domNode.onclick = (event) => this.onReaction(event);
  }

  hydrate() {
    this.displayCount(this.model.countOf(this.type));
  }

  onReaction() {
    this.publish("reaction", this.type, this.viewId);
  }

  handleUpdate(feedback) {
    this.displayCount(feedback[this.type]);
  }

  displayCount(count) {
    this.domNode.querySelector(".count").textContent = count;
  }
}
