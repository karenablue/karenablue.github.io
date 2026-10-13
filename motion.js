/* Motion layer: tags elements for scroll reveals and tracks the current
   case-study section. Loaded in <head>, so the class below lands before
   first paint. Everything is visible without it. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduce && "IntersectionObserver" in window) {
    root.classList.add("js-motion");
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!reduce && "IntersectionObserver" in window) setupReveals();
    setupJumpSpy();
  });

  function setupReveals() {
    var groups = [
      // [selector, reveal style]
      [".featured-heading, .section-heading, .home-contact, .section > h2", "wipe"],
      [".chart-fig, .shot, .research-trace", "fig"],
      [
        ".featured-grid > *, .start-grid > *, .study-card, .supporting-card, " +
          ".belief-card, .story-card, .skill-card, .education-card, " +
          ".resume-entry, .selected-project, .contact-link-card, .summary-card",
        ""
      ],
      [
        ".about-hero > *, .contact-hero > *, .research-hero > *, " +
          ".resume-hero > *, .case-hero > *",
        ""
      ]
    ];

    var items = [];
    var seen = new Set();

    groups.forEach(function (group) {
      document.querySelectorAll(group[0]).forEach(function (el) {
        if (seen.has(el) || el.closest(".home-hero")) return;
        seen.add(el);
        el.setAttribute("data-reveal", group[1]);

        // Offset & delay: siblings enter one after another, capped.
        var siblings = el.parentElement ? Array.prototype.filter.call(
          el.parentElement.children,
          function (child) { return seen.has(child); }
        ) : [];
        el.style.setProperty("--i", Math.min(siblings.indexOf(el), 4));
        items.push(el);
      });
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach(function (el) { io.observe(el); });

    // Failsafe: never leave content hidden.
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add("is-in"); });
    }, 4000);
  }

  function setupJumpSpy() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.jump-card a[href^="#"]')
    );
    if (!links.length || !("IntersectionObserver" in window)) return;

    var sections = [];
    links.forEach(function (link) {
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (target && sections.indexOf(target) === -1) sections.push(target);
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = "#" + entry.target.id;
          links.forEach(function (link) {
            var current = link.getAttribute("href") === id;
            link.classList.toggle("is-current", current);
            if (current) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    sections.forEach(function (section) { io.observe(section); });
  }
})();
