export function createCloseButton({ className, callback }) {
  const closeButton = document.createElement("button");
  closeButton.className = `button icon ${className}`;
  closeButton.textContent = "x";
  closeButton.onclick = callback;

  return closeButton;
}
