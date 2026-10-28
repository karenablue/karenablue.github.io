/* Clickable prototype of the Sigma Gamma Rho navigation, rendered on the case study page.
   Same structure as the coded site's nav data; destinations are placeholder pages. */
(function () {
  "use strict";
  var root = document.getElementById("nav-demo");
  if (!root) return;

  var NAV = [
    ["About", ["Herstory", "Our Founders", "Notable Sigmas", "Anti-Hazing Policy"]],
    ["Leadership", ["International Grand Basileus", "Board of Directors", "Regional Leadership", "Past Grand Basilei", "International Corporate Headquarters"]],
    ["Membership", ["Become a Member", "Reactivate Membership", "Chapter Locator", "Affiliates", "Membership Accountability"]],
    ["Programs & Initiatives", ["National Programs", "Partner Foundations", "Corporate Partnerships"]],
    ["News & Events", ["Latest News", "Upcoming Events", "Highlights & Stories", "Media Relations"]],
    ["Resources", ["Help Center", "Vendor", "Contact Us", "Careers"]]
  ];
  var DESKTOP_W = 960;
  // Proposed helper copy; not part of the original tree test or Figma captures.
  var DESCRIPTIONS = {
    "International Grand Basileus": "Current international leader",
    "Past Grand Basilei": "Former international leaders"
  };
  function label(l) {
    return esc(l) + (DESCRIPTIONS[l] ? '<small class="nd-description">' + esc(DESCRIPTIONS[l]) + '</small>' : '');
  }
  var screen = root.querySelector(".nd-screen");
  var stage = root.querySelector(".nd-stage");
  var status = root.querySelector(".nd-status");
  var state;

  function reset(view) {
    state = { view: view || (state && state.view) || "desktop", open: null, drawer: false, expanded: null,
      page: null, search: false, query: "" };
  }
  reset("desktop");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  var chevron = '<svg class="nd-chev" viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="M1.5 1.5l4.5 4.5 4.5-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var searchIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  function brand(small) {
    return '<button type="button" class="nd-brand' + (small ? " small" : "") + '" data-home aria-label="Home">' +
      '<img src="images/sgrho/sgrho-crest.png" alt="" width="96" height="128">' +
      '<span class="nd-wordmark"><b>Sigma Gamma Rho</b><small>Sorority, Inc.®</small></span></button>';
  }
  function body() {
    if (!state.page) {
      return '<div class="nd-page home"><p class="nd-hint">Home page content</p>' +
        '<p class="nd-try">Try it: open <strong>Membership</strong> and choose <strong>Become a Member</strong>.</p></div>';
    }
    return '<div class="nd-page"><p class="nd-crumb">Home / ' + esc(state.page[0]) + " / " + esc(state.page[1]) + "</p>" +
      '<span class="nd-rule"></span><h4>' + esc(state.page[1]) + "</h4>" +
      '<p class="nd-note">Placeholder page. Only the navigation is part of this prototype.</p></div>';
  }
  function searchPanel() {
    var q = state.query.trim().toLowerCase();
    var hits = [];
    if (q) NAV.forEach(function (s) { s[1].forEach(function (l) { if ((l + " " + (DESCRIPTIONS[l] || "")).toLowerCase().indexOf(q) > -1) hits.push([s[0], l]); }); });
    return '<div class="nd-search-panel"><label class="nd-search-label" for="nd-q">Search the site</label>' +
      '<div class="nd-field">' + searchIcon + '<input id="nd-q" type="search" autocomplete="off" placeholder="Try membership, chapters, programs…" value="' + esc(state.query) + '"></div>' +
      (q ? (hits.length ? hits.slice(0, 6).map(function (h) {
        return '<button type="button" class="nd-result" data-go="' + esc(h[0]) + "|" + esc(h[1]) + '"><span>' + label(h[1]) + "</span><span>→</span></button>";
      }).join("") : '<p class="nd-empty">No matching pages.</p>') : "") + "</div>";
  }
  function desktop() {
    var nav = NAV.map(function (s) {
      var open = state.open === s[0];
      var current = state.page && state.page[0] === s[0];
      return '<li class="nd-item' + (open ? " is-open" : "") + (current ? " is-current" : "") + '">' +
        '<button type="button" class="nd-link" data-menu="' + esc(s[0]) + '" aria-expanded="' + open + '">' + esc(s[0]) + "</button>" +
        (open ? '<ul class="nd-menu">' + s[1].map(function (l) {
          return '<li><button type="button" data-go="' + esc(s[0]) + "|" + esc(l) + '">' + label(l) + "</button></li>";
        }).join("") + "</ul>" : "") + "</li>";
    }).join("");
    return '<div class="nd-desktop">' +
      '<div class="nd-mast">' + brand(false) + '<div class="nd-actions">' +
      '<button type="button" class="nd-searchbtn" data-search aria-expanded="' + state.search + '">' + searchIcon + "Search</button>" +
      '<button type="button" class="nd-btn" data-go="Membership|Become a Member">Join</button>' +
      '<button type="button" class="nd-btn solid" data-ext="Poodle Portal">Poodle Portal</button>' +
      '<button type="button" class="nd-btn" data-go="Programs & Initiatives|Partner Foundations">Donate</button></div></div>' +
      '<nav class="nd-ribbon" aria-label="Prototype navigation"><ul>' + nav + "</ul></nav>" +
      (state.search ? searchPanel() : "") + body() + "</div>";
  }
  function phone() {
    var drawer = "";
    if (state.drawer) {
      drawer = '<div class="nd-drawer"><ul>' + NAV.map(function (s) {
        var ex = state.expanded === s[0];
        return '<li class="' + (ex ? "is-open" : "") + '"><button type="button" class="nd-row" data-acc="' + esc(s[0]) + '" aria-expanded="' + ex + '">' + esc(s[0]) + chevron + "</button>" +
          (ex ? '<ul class="nd-sub">' + s[1].map(function (l) {
            return '<li><button type="button" data-go="' + esc(s[0]) + "|" + esc(l) + '">' + label(l) + "</button></li>";
          }).join("") + "</ul>" : "") + "</li>";
      }).join("") + "</ul>" +
        '<div class="nd-drawer-actions"><button type="button" class="nd-btn ghost" data-go="Membership|Become a Member">Join</button>' +
        '<button type="button" class="nd-btn solid" data-ext="Poodle Portal">Poodle Portal</button>' +
        '<button type="button" class="nd-btn ghost" data-go="Programs & Initiatives|Partner Foundations">Donate</button></div></div>';
    }
    return '<div class="nd-phone"><div class="nd-phone-scroll">' +
      '<div class="nd-mast">' + brand(true) + '<button type="button" class="nd-searchbtn square" data-search aria-label="Search" aria-expanded="' + state.search + '">' + searchIcon + "</button></div>" +
      '<div class="nd-ribbon-m"><div class="nd-bar-m"><button type="button" class="nd-menu-toggle" data-drawer aria-expanded="' + state.drawer + '">' +
      (state.drawer ? '<span class="nd-x" aria-hidden="true"></span>' : '<span class="nd-burger" aria-hidden="true"><i></i><i></i><i></i></span>') + "Menu</button>" +
      '<button type="button" class="nd-explore" data-go="Membership|Become a Member">Explore Membership →</button></div>' + drawer + "</div>" +
      (state.search ? searchPanel() : "") + body() + "</div></div>";
  }
  function fit() {
    if (state.view !== "desktop") { screen.style.transform = ""; stage.style.height = ""; return; }
    var w = stage.clientWidth, s = Math.min(1, w / DESKTOP_W);
    screen.style.transform = "scale(" + s + ")";
    stage.style.height = Math.ceil(screen.offsetHeight * s) + "px";
  }
  function render(focusSel) {
    screen.className = "nd-screen " + state.view;
    screen.innerHTML = state.view === "desktop" ? desktop() : phone();
    root.querySelectorAll("[data-view]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === state.view)); });
    fit();
    if (focusSel) { var f = screen.querySelector(focusSel); if (f) { f.focus(); if (f.setSelectionRange) f.setSelectionRange(f.value.length, f.value.length); } }
  }
  function say(msg) { if (status) status.textContent = msg; }

  screen.addEventListener("click", function (e) {
    // Re-rendering detaches the clicked node, so keep the outside-click handler from seeing it.
    e.stopPropagation();
    var t = e.target.closest("button");
    if (!t) return;
    if (t.hasAttribute("data-menu")) {
      var m = t.getAttribute("data-menu");
      state.open = state.open === m ? null : m; state.search = false;
      render('[data-menu="' + m.replace(/"/g, "") + '"]');
    } else if (t.hasAttribute("data-go")) {
      var g = t.getAttribute("data-go").split("|");
      state.page = g; state.open = null; state.drawer = false; state.expanded = null; state.search = false; state.query = "";
      render(); say("Went to " + g[1] + ".");
    } else if (t.hasAttribute("data-ext")) {
      say("Poodle Portal opens the member portal on the real site; it is not part of this prototype.");
    } else if (t.hasAttribute("data-home")) {
      reset(); render(); say("Back to the home page.");
    } else if (t.hasAttribute("data-search")) {
      state.search = !state.search; state.open = null; render(state.search ? "#nd-q" : "[data-search]");
    } else if (t.hasAttribute("data-drawer")) {
      state.drawer = !state.drawer; if (!state.drawer) state.expanded = null; render("[data-drawer]");
    } else if (t.hasAttribute("data-acc")) {
      var a = t.getAttribute("data-acc"); state.expanded = state.expanded === a ? null : a; render('[data-acc="' + a.replace(/"/g, "") + '"]');
    }
  });
  screen.addEventListener("input", function (e) {
    if (e.target.id === "nd-q") { state.query = e.target.value; render("#nd-q"); }
  });
  document.addEventListener("click", function (e) {
    if (!root.contains(e.target) && (state.open || state.search)) { state.open = null; state.search = false; render(); }
  });
  root.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && (state.open || state.search || state.drawer)) {
      state.open = null; state.search = false; state.drawer = false; state.expanded = null; render();
    }
  });
  root.querySelectorAll("[data-view]").forEach(function (b) {
    b.addEventListener("click", function () { reset(b.getAttribute("data-view")); render(); say(""); });
  });
  var restart = root.querySelector(".nd-restart");
  if (restart) restart.addEventListener("click", function () { reset(); render(); say("Prototype restarted."); });
  if (window.ResizeObserver) new ResizeObserver(fit).observe(stage); else window.addEventListener("resize", fit);
  // On narrow screens the scaled desktop view is too small to read, so start on the phone view.
  if (stage.clientWidth < 600) reset("phone");
  render();
})();
