document.addEventListener("DOMContentLoaded", () => {
  const buttons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".study-card[data-type]")];
  const status = document.getElementById("filter-status");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      cards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.type !== filter;
      });

      if (status) {
        const count = cards.filter((card) => !card.hidden).length;
        status.textContent = `${count} ${count === 1 ? "study" : "studies"} shown.`;
      }
    });
  });
});
