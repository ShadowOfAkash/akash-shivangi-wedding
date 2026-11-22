const rsvpForm = document.querySelector(".rsvp-form");
const attendingFields = rsvpForm.querySelector(".attending-fields");
const replyPanel = rsvpForm.querySelector(".rsvp-reply");
const reply = replyPanel.querySelector("textarea");
const copyReply = replyPanel.querySelector("button");
const replyStatus = rsvpForm.querySelector(".rsvp-status");
const eventNames = new Intl.ListFormat("en", { type: "conjunction" });

function updateRsvpFields() {
  const attending = rsvpForm.elements.attendance.value === "yes";
  attendingFields.hidden = !attending;
  attendingFields.disabled = !attending;
  replyPanel.hidden = true;
  replyStatus.textContent = "";
}

updateRsvpFields();
rsvpForm.hidden = false;
rsvpForm.addEventListener("input", updateRsvpFields);

rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = new FormData(rsvpForm);
  const name = fields.get("guest-name").trim();
  const attending = fields.get("attendance") === "yes";
  const events = fields.getAll("event");
  const guests = Number(fields.get("guest-count"));

  if (!name) {
    replyStatus.textContent = "Enter your name to prepare your reply.";
    rsvpForm.elements["guest-name"].focus();
    return;
  }

  if (attending && events.length === 0) {
    replyStatus.textContent = "Choose at least one event you’ll attend.";
    attendingFields.querySelector("input").focus();
    return;
  }

  reply.value = attending
    ? `Hi! This is ${name}. I’ll be joining Akash and Shivangi for ${eventNames.format(events)}. Please count ${guests} ${guests === 1 ? "guest" : "guests"}, including me. Thank you!`
    : `Hi! This is ${name}. I won’t be able to attend Akash and Shivangi’s wedding. Sending them and both families our best wishes!`;
  replyPanel.hidden = false;
  replyStatus.textContent = "Your reply is ready to copy and send.";
  reply.focus();
});

copyReply.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(reply.value);
    replyStatus.textContent = "Message copied.";
  } catch {
    reply.focus();
    reply.select();
    replyStatus.textContent = "The message is selected. Copy it to share with your invitation contact.";
  }
});

const weddingTime = new Date(document.querySelector("#wedding-date").dateTime).getTime();
const countdown = document.querySelector(".countdown-time");
const daysLabel = countdown.querySelector("strong");
const clockLabel = countdown.querySelector("span");

function renderCountdown() {
  const seconds = Math.max(0, Math.ceil((weddingTime - Date.now()) / 1000));
  if (seconds === 0) {
    countdown.hidden = true;
    return;
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor(seconds / 60) % 60;
  daysLabel.textContent = `${days} ${days === 1 ? "day" : "days"}`;
  clockLabel.textContent = `${hours}h ${minutes}m ${seconds % 60}s`;
  countdown.hidden = false;
  window.setTimeout(renderCountdown, 1000);
}

renderCountdown();
