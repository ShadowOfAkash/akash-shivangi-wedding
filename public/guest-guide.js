const rsvpForm = document.querySelector(".rsvp-form");
const attendingFields = rsvpForm.querySelector(".attending-fields");
const replyStatus = rsvpForm.querySelector(".rsvp-status");
const submitButton = rsvpForm.querySelector('button[type="submit"]');
let submissionId;

function updateRsvpFields() {
  const attending = rsvpForm.elements.attendance.value === "yes";
  attendingFields.hidden = !attending;
  attendingFields.disabled = !attending;
  replyStatus.textContent = "";
  submissionId = undefined;
}

updateRsvpFields();
rsvpForm.hidden = false;
rsvpForm.addEventListener("input", updateRsvpFields);

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitButton.disabled) return;
  const fields = new FormData(rsvpForm);
  const name = fields.get("guest-name").trim();
  const attendance = fields.get("attendance");
  const events = fields.getAll("event");
  const guests = Number(fields.get("guest-count"));

  if (!name) {
    replyStatus.textContent = "Enter your name to send your RSVP.";
    rsvpForm.elements["guest-name"].focus();
    return;
  }
  if (attendance === "yes" && events.length === 0) {
    replyStatus.textContent = "Choose at least one event you’ll attend.";
    attendingFields.querySelector("input").focus();
    return;
  }

  submissionId ??= crypto.randomUUID();
  const controls = [...rsvpForm.elements].filter(control => !control.disabled);
  controls.forEach(control => { control.disabled = true; });
  replyStatus.textContent = "Sending your RSVP…";
  try {
    const result = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: submissionId, name, attendance, events, guests }),
    });
    const data = await result.json();
    if (!result.ok || !data.success) throw new Error(data.error || "Your RSVP could not be confirmed.");
    replyStatus.textContent = "Thank you! Your RSVP was sent.";
    submitButton.textContent = "RSVP sent";
  } catch (error) {
    controls.forEach(control => { control.disabled = false; });
    replyStatus.textContent = error.message || "Please try again.";
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
