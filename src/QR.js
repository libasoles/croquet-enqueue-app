const app = Croquet.App;

app.sessionURL = window.location.href;

if (!document.getElementById("widgets")) {
  const widgetDiv = document.createElement("div");
  widgetDiv.id = "widgets";
  document.body.appendChild(widgetDiv);
  const badgeDiv = document.createElement("div");
  badgeDiv.id = "badge";
  widgetDiv.appendChild(badgeDiv);
  const qrDiv = document.createElement("div");
  qrDiv.id = "qrcode";
  widgetDiv.appendChild(qrDiv);
}

app.badge = "badge";
app.qrcode = "qrcode";

app.messages = true;
