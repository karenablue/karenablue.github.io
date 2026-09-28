const CONTACT_EMAIL = "designedbykarena@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      status.textContent = "Fill in every field first ♡";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      status.textContent = "That email address looks a little off.";
      return;
    }

    const mailSubject = encodeURIComponent(
      `Portfolio inquiry: ${subject} — ${name}`
    );

    const mailBody = encodeURIComponent(
`Hi Karena,

${message}

—
From: ${name}
Email: ${email}
Topic: ${subject}`
    );

    status.textContent = "Opening an email draft. Press Send in your email app to deliver it.";

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
  });
});
