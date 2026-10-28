// Reveal supporting details when a case-study link points inside one.
function revealHashTarget() {
  const target = document.getElementById(location.hash.slice(1));
  if (!target) return;
  for (let parent = target; parent; parent = parent.parentElement) {
    if (parent.tagName === "DETAILS") parent.open = true;
  }
  target.scrollIntoView();
}
window.addEventListener("hashchange", revealHashTarget);
if (location.hash) revealHashTarget();

// Links and native disclosures remain available without JavaScript.
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target || target === document.body) return;
    for (let parent = target; parent; parent = parent.parentElement) {
      if (parent.tagName === "DETAILS") parent.open = true;
    }
    const hadTabindex = target.hasAttribute("tabindex");
    if (!hadTabindex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (!hadTabindex)
      target.addEventListener(
        "blur",
        () => target.removeAttribute("tabindex"),
        { once: true },
      );
  });
});
const filters = document.querySelector(".archive-filters");
if (filters) {
  filters.hidden = false;
  const cards = [...document.querySelectorAll("[data-project-category]")];
  filters.querySelectorAll("button").forEach((button) =>
    button.addEventListener("click", () => {
      filters
        .querySelectorAll("button")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      cards.forEach(
        (card) =>
          (card.hidden =
            button.dataset.projectFilter !== "all" &&
            card.dataset.projectCategory !== button.dataset.projectFilter),
      );
      const count = cards.filter((card) => !card.hidden).length;
      document.getElementById("filter-status").textContent =
        `${count} ${count === 1 ? "project" : "projects"} shown. Each case study explains my contribution and where the evidence stops.`;
    }),
  );
}
const sectionLinks = [...document.querySelectorAll('.jump-card a[href^="#"]')];
if (sectionLinks.length && "IntersectionObserver" in window) {
  const sections = [
    ...new Set(
      sectionLinks
        .map((a) => document.getElementById(a.hash.slice(1)))
        .filter(Boolean),
    ),
  ];
  const observer = new IntersectionObserver(
    (entries) => {
      const first = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!first) return;
      sectionLinks.forEach((a) => {
        if (a.hash === `#${first.target.id}`)
          a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
}
