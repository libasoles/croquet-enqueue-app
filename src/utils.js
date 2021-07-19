export function isSelf(viewId, anotherViewId) {
  return viewId === anotherViewId;
}

export function readCookie(name) {
  const result = document.cookie
    .split(";")
    .map((rawCookie) => rawCookie.split("="))
    .find((cookie) => cookie[0] === name);

  if (!result) return;

  return result.reduce((_, value) => value);
}

export function createCloseButton({ className, callback }) {
  const closeButton = createElement({
    type: "button",
    className: `button icon close ${className}`,
    textContent: "x",
    onclick: callback,
  });

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
  domNode.classList.remove("hidden");
}

export function hide(domNode) {
  domNode.classList.add("hidden");
}

export function displayModal(domNode) {
  domNode.classList.add("active");
  display(domNode);
}

export function hideModal(domNode) {
  hide(domNode);
  domNode.classList.remove("active");
}

export function toggleModal(domNode, { onDisplay, onHide }) {
  const currentVisibility = getElementStyle(domNode, "display");

  if (currentVisibility && currentVisibility !== "none") {
    hideModal(domNode);
    onHide && onHide();
  } else {
    displayModal(domNode);
    onDisplay && onDisplay();
  }
}

function getElementStyle(domNode, name) {
  return domNode.currentStyle
    ? domNode.currentStyle[name]
    : window.getComputedStyle
    ? window.getComputedStyle(domNode, null).getPropertyValue(name)
    : null;
}
