export function createCloseButton({ className, callback }) {
  const closeButton = document.createElement("button");
  closeButton.className = `button icon ${className}`;
  closeButton.textContent = "x";
  closeButton.onclick = callback;

  return closeButton;
}

export function display(domNode) {
  domNode.style.visibility = "visible";
}

export function hide(domNode) {
  domNode.style.visibility = "hidden";
}
