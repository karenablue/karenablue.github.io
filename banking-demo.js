/* Fictional research stimuli. No account connection, persistence, or money movement. */
(function () {
  "use strict";
  var root = document.getElementById("banking-demo");
  if (!root) return;
  var cards = root.querySelectorAll("[data-bank-variant]");
  cards.forEach(function (card) {
    var amount = 120;
    var status = card.querySelector("[data-bank-status]");
    var form = card.querySelector("form");
    function finish(message) {
      status.textContent = message;
      if (form) form.hidden = true;
      card.querySelectorAll("button").forEach(function (button) { button.disabled = true; });
    }
    card.querySelector("[data-bank-confirm]").addEventListener("click", function () {
      finish("Prototype: $" + amount + " transfer submitted. No money moved.");
    });
    if (form) {
      card.querySelector("[data-bank-edit]").addEventListener("click", function () {
        form.hidden = false;
        form.elements.amount.focus();
      });
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.reportValidity()) return;
        amount = Number(form.elements.amount.value);
        card.querySelector("[data-bank-amount]").textContent = "$" + amount;
        form.hidden = true;
        status.textContent = "Prototype amount updated to $" + amount + ". Review before confirming.";
        card.querySelector("[data-bank-confirm]").focus();
      });
      card.querySelector("[data-bank-decline]").addEventListener("click", function () {
        finish("Prototype: recommendation declined. No transfer submitted.");
      });
    }
    document.getElementById("banking-restart").addEventListener("click", function () {
      amount = 120;
      card.querySelector("[data-bank-amount]").textContent = "$120";
      card.querySelectorAll("button").forEach(function (button) { button.disabled = false; });
      status.textContent = "Prototype restarted.";
      if (form) { form.reset(); form.hidden = true; card.querySelector("details").open = false; }
    });
  });
})();
