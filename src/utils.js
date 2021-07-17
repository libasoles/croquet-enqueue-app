export function createCloseButton({ className, callback }) {
  const closeButton = document.createElement("button");
  closeButton.className = `button icon ${className}`;
  closeButton.textContent = "x";
  closeButton.onclick = callback;

  return closeButton;
}

export function createElement({ type, ...options }) {
  const element = document.createElement(type);

  for (const [key, value] of Object.entries(options)) {
    element[key] = value;
  }

  return element;
}

export function display(domNode) {
  domNode.style.visibility = "visible";
}

export function hide(domNode) {
  domNode.style.visibility = "hidden";
}

export function displayModal(domNode) {
  domNode.style.display = "flex";
  domNode.classList.add("active");
}

export function hideModal(domNode) {
  domNode.style.display = "none";
  domNode.classList.remove("active");
}

export function toggleModal(domNode, { onDisplay, onHide }) {
  const currentVisibility = domNode.style.display;

  if (currentVisibility && currentVisibility !== "none") {
    hideModal(domNode);
    onHide && onHide();
  } else {
    displayModal(domNode);
    onDisplay && onDisplay();
  }
}
