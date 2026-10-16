/* Clickable prototype of the SHEIN filter-recovery and quick-add concept, rendered on the
   case study page. Fictional catalog; independent concept, not affiliated with SHEIN. */
(function () {
  "use strict";
  var root = document.getElementById("shein-demo");
  if (!root) return;

  var SIZES = ["XS", "S", "M", "L", "XL"];
  var COLORS = ["Black", "White", "Beige", "Blue"];
  var PRICES = [["u25", "Under $25"], ["m", "$25–$50"], ["o50", "Over $50"]];
  var NAMES = ["EZwear Ribbed Tank Top", "Frenchy Cotton Button Shirt", "MOD Square Neck Top", "Essnce Everyday Crew Tee",
    "Basics Fitted Tee", "EZwear Knit Cami", "MOD Puff Sleeve Top", "Frenchy Boxy Tee"];
  var DESKTOP_W = 1040;

  /* Deterministic catalog of 128 items. Black items: 24 under $25 (never in XS), 8 at $25+,
     so XS + Black + Under $25 returns nothing and Black + Under $25 returns 24. */
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  var items = [];
  for (var i = 0; i < 128; i++) {
    var color = COLORS[i % 4], k = Math.floor(i / 4), price, sizes;
    if (color === "Black") {
      if (k < 24) { price = 6 + rnd() * 18; sizes = ["S", "M", "L", "XL"].filter(function () { return rnd() > 0.25; }); }
      else { price = 26 + rnd() * 22; sizes = SIZES.filter(function () { return rnd() > 0.35; }); }
    } else { price = 8 + rnd() * 50; sizes = SIZES.filter(function () { return rnd() > 0.4; }); }
    if (sizes.indexOf("M") < 0 && rnd() > 0.3) sizes.push("M");
    if (!sizes.length) sizes = ["M"];
    items.push({ id: i, name: "SHEIN " + NAMES[(k + i) % NAMES.length] + ", " + color, color: color,
      price: Math.round(price * 100) / 100, disc: rnd() > 0.5 ? Math.round(10 + rnd() * 20) : 0,
      sizes: SIZES.filter(function (z) { return sizes.indexOf(z) > -1; }), img: "images/shein/product-" + (1 + ((k + i) % 4)) + ".jpg" });
  }

  var screen = root.querySelector(".sd-screen"), stage = root.querySelector(".sd-stage"), status = root.querySelector(".sd-status");
  var state;
  function reset(view) {
    state = { view: view || (state && state.view) || "desktop", size: ["M"], color: ["Black"], price: null,
      pop: null, open: null, chosen: null, added: {}, bag: 0, sheet: null, toast: null };
  }
  reset("desktop");

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function matches(it, s) {
    if (s.size.length && !s.size.some(function (z) { return it.sizes.indexOf(z) > -1; })) return false;
    if (s.color.length && s.color.indexOf(it.color) < 0) return false;
    if (s.price === "u25" && !(it.price < 25)) return false;
    if (s.price === "m" && !(it.price >= 25 && it.price <= 50)) return false;
    if (s.price === "o50" && !(it.price > 50)) return false;
    return true;
  }
  function list(s) { return items.filter(function (it) { return matches(it, s || state); }); }
  function without(g) { var c = { size: state.size.slice(), color: state.color.slice(), price: state.price }; if (g === "price") c.price = null; else c[g] = []; return c; }
  function groups() { var g = []; if (state.size.length) g.push("size"); if (state.color.length) g.push("color"); if (state.price) g.push("price"); return g; }
  function label(g) {
    if (g === "size") return "Size: " + state.size.join(", ");
    if (g === "color") return "Color: " + state.color.join(", ");
    return "Price: " + PRICES.filter(function (p) { return p[0] === state.price; })[0][1];
  }
  function money(v) { return "$" + v.toFixed(2); }

  var I = {
    cart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2.5l2 11h10.5l2-7.5H7"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/><path d="M13 7.5v5M10.5 10h5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M7 10l5 5 5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    heart: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-8-4.6-8-10.7A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.8c0 6.1-8 10.7-8 10.7z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  function header(phone) {
    var bag = '<span class="sd-bag">' + I.bag + '<b>' + state.bag + '</b></span>';
    var search = '<div class="sd-search"><span>fall outfit for women</span><i>' + I.search + '</i></div>';
    if (phone) return '<div class="sd-head phone"><div class="sd-row"><strong class="sd-logo">SHEIN</strong><span class="sd-icons">' + I.heart + bag + '</span></div>' + search + '</div>';
    return '<div class="sd-head"><strong class="sd-logo">SHEIN</strong><nav class="sd-depts"><b>Women</b><span>Curve</span><span>Men</span><span>Kids</span></nav>' + search + '<span class="sd-icons">' + I.heart + bag + '</span></div>';
  }
  function pill(g, name) {
    var n = g === "price" ? (state.price ? 1 : 0) : state[g].length;
    var opts = g === "size" ? SIZES.map(function (z) { return [z, z]; }) : g === "color" ? COLORS.map(function (c) { return [c, c]; }) : PRICES;
    var on = function (v) { return g === "price" ? state.price === v : state[g].indexOf(v) > -1; };
    return '<div class="sd-pillwrap"><button type="button" class="sd-pill' + (n ? " active" : "") + '" data-pop="' + g + '" aria-expanded="' + (state.pop === g) + '">' + name + (n ? " (" + n + ")" : "") + I.chev + "</button>" +
      (state.pop === g ? '<div class="sd-pop" role="group" aria-label="' + name + ' options">' + opts.map(function (o) {
        return '<button type="button" class="sd-opt" data-f="' + g + '|' + o[0] + '" aria-pressed="' + on(o[0]) + '">' + esc(o[1]) + "</button>"; }).join("") + "</div>" : "") + "</div>";
  }
  function toolbar(phone) {
    var g = groups();
    var chips = g.length ? '<div class="sd-chips"><span class="sd-applied">Applied:</span>' + g.map(function (x) {
      return '<button type="button" class="sd-chip" data-rm="' + x + '" aria-label="Remove ' + esc(label(x)) + '">' + esc(label(x)) + I.x + "</button>"; }).join("") +
      '<button type="button" class="sd-clear" data-clear>Clear all</button></div>' : "";
    return '<div class="sd-top"><div class="sd-title"><b>Women Tops</b><span>' + list().length.toLocaleString() + " items</span></div>" +
      '<div class="sd-sort"><b>Recommended</b><span>Most Popular</span><span>Price</span></div>' +
      '<div class="sd-pills">' + pill("size", "Size") + pill("color", "Color") + pill("price", "Price") + (phone ? "" : '<span class="sd-pill ghost">Style' + I.chev + '</span><span class="sd-pill ghost">Sleeve Length' + I.chev + "</span>") + "</div>" + chips + "</div>";
  }
  function card(it, phone) {
    var price = '<span class="sd-price' + (it.disc ? " sale" : "") + '">' + money(it.price) + (it.disc ? '<em>-' + it.disc + "%</em>" : "") + "</span>";
    var body;
    if (state.added[it.id]) body = '<div class="sd-added">' + I.check + "Added to bag · Size " + state.added[it.id] + "</div>";
    else if (!phone && state.open === it.id) {
      var carried = state.size.length === 1 && it.sizes.indexOf(state.size[0]) > -1 ? state.size[0] : null;
      var note = carried ? "Size " + carried + " from your filters. Change it if needed." : (state.size.length === 1 ? "Size " + state.size[0] + " isn't available. Pick another size." : "Choose a size.");
      body = '<p class="sd-note">' + note + '</p><div class="sd-sizes">' + SIZES.map(function (z) {
        var ok = it.sizes.indexOf(z) > -1;
        return '<button type="button" class="sd-size" data-sz="' + z + '" aria-pressed="' + (state.chosen === z) + '"' + (ok ? "" : " disabled") + ">" + z + "</button>"; }).join("") + "</div>" +
        '<button type="button" class="sd-primary" data-add="' + it.id + '"' + (state.chosen ? "" : " disabled") + ">" + (state.chosen ? "Add size " + state.chosen + " to bag" : "Choose a size") + "</button>";
    } else body = "";
    var qa = state.added[it.id] || (!phone && state.open === it.id) ? "" : '<button type="button" class="sd-qa" data-qa="' + it.id + '">' + I.cart + (phone ? "Add" : "Quick add") + "</button>";
    return '<article class="sd-card"><img src="' + it.img + '" alt="" loading="lazy"><div class="sd-info"><p class="sd-name">' + esc(it.name) + '</p><div class="sd-pricerow">' + price + qa + "</div>" + body + "</div></article>";
  }
  function results(phone) {
    var l = list();
    if (!l.length) {
      var rel = groups().map(function (g) { return { g: g, n: list(without(g)).length }; }).filter(function (r) { return r.n > 0; }).sort(function (a, b) { return b.n - a.n; });
      var top = rel[0], keep = groups().filter(function (g) { return !top || g !== top.g; }).map(label);
      return '<div class="sd-empty" role="region" aria-label="No results"><h4>A little too specific.</h4>' +
        (top ? "<p>" + esc(label(top.g)) + " has no matches with " + esc(keep.join(" and ")) + ". Remove just that to keep the rest.</p>" +
          '<button type="button" class="sd-primary" data-relax="' + top.g + '">Remove ' + esc(label(top.g).replace(": ", " ")) + " · see " + top.n + " items</button>" +
          '<p class="sd-keep">Keeps ' + esc(keep.join(" and ")) + "</p>" : "<p>Try a different combination.</p>") +
        '<button type="button" class="sd-secondary" data-clear>Reset filters</button></div>';
    }
    return '<div class="sd-grid">' + l.slice(0, phone ? 4 : 8).map(function (it) { return card(it, phone); }).join("") + "</div>";
  }
  function sheet() {
    var it = items[state.sheet]; if (!it) return "";
    var carried = state.size.length === 1 && it.sizes.indexOf(state.size[0]) > -1;
    return '<div class="sd-dim" data-close></div><div class="sd-sheet" role="dialog" aria-label="Select size"><div class="sd-sheet-head"><b>Select size</b><button type="button" class="sd-x" data-close aria-label="Close">' + I.x + "</button></div>" +
      '<div class="sd-sheet-item"><img src="' + it.img + '" alt=""><div><p>' + esc(it.name) + '</p><span class="sd-price sale">' + money(it.price) + "</span></div></div>" +
      '<div class="sd-sizes">' + SIZES.map(function (z) { var ok = it.sizes.indexOf(z) > -1; return '<button type="button" class="sd-size" data-sz="' + z + '" aria-pressed="' + (state.chosen === z) + '"' + (ok ? "" : " disabled") + ">" + z + "</button>"; }).join("") + "</div>" +
      '<p class="sd-note">' + (carried ? "Size " + state.size[0] + " carried over from your filters. Change it if needed." : "Choose a size.") + "</p>" +
      '<button type="button" class="sd-primary" data-add="' + it.id + '"' + (state.chosen ? "" : " disabled") + ">" + (state.chosen ? "Add size " + state.chosen + " to bag" : "Choose a size") + "</button></div>";
  }
  function fit() {
    if (state.view !== "desktop") { screen.style.transform = ""; stage.style.height = ""; return; }
    var s = Math.min(1, stage.clientWidth / DESKTOP_W);
    screen.style.transform = "scale(" + s + ")"; stage.style.height = Math.ceil(screen.offsetHeight * s) + "px";
  }
  function render(focus) {
    var phone = state.view === "phone";
    screen.className = "sd-screen " + state.view;
    var inner = header(phone) + toolbar(phone) + '<div class="sd-results">' + results(phone) + "</div>";
    screen.innerHTML = phone ? '<div class="sd-phone"><div class="sd-scroll">' + inner + "</div>" + (state.sheet !== null ? sheet() : "") + (state.toast ? '<div class="sd-toast">' + I.check + esc(state.toast) + "</div>" : "") + "</div>" : '<div class="sd-desktop">' + inner + "</div>";
    root.querySelectorAll("[data-view]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === state.view)); });
    fit();
    if (focus) { var f = screen.querySelector(focus); if (f) f.focus(); }
  }
  function say(m) { if (status) status.textContent = m; }
  function toggleFilter(g, v) {
    if (g === "price") state.price = state.price === v ? null : v;
    else { var a = state[g], x = a.indexOf(v); if (x > -1) a.splice(x, 1); else a.push(v); }
    state.open = null; state.chosen = null;
  }

  screen.addEventListener("click", function (e) {
    e.stopPropagation();
    var t = e.target.closest("[data-pop],[data-f],[data-rm],[data-clear],[data-relax],[data-qa],[data-sz],[data-add],[data-close]");
    if (!t) { if (state.pop) { state.pop = null; render(); } return; }
    if (t.hasAttribute("data-pop")) { var p = t.getAttribute("data-pop"); state.pop = state.pop === p ? null : p; render('[data-pop="' + p + '"]'); return; }
    if (t.hasAttribute("data-f")) { var f = t.getAttribute("data-f").split("|"); toggleFilter(f[0], f[1]); render('[data-f="' + f[0] + "|" + f[1] + '"]'); say(list().length + " items match."); return; }
    state.pop = null;
    if (t.hasAttribute("data-rm")) { var g = t.getAttribute("data-rm"); if (g === "price") state.price = null; else state[g] = []; state.open = null; render(); say("Filter removed. " + list().length + " items match."); }
    else if (t.hasAttribute("data-clear")) { state.size = []; state.color = []; state.price = null; state.open = null; render(); say("All filters cleared."); }
    else if (t.hasAttribute("data-relax")) { var r = t.getAttribute("data-relax"); var lbl = label(r); if (r === "price") state.price = null; else state[r] = []; render(); say("Removed " + lbl + ". Your other filters stayed. " + list().length + " items match."); }
    else if (t.hasAttribute("data-qa")) {
      var id = +t.getAttribute("data-qa"), it = items[id];
      state.chosen = state.size.length === 1 && it.sizes.indexOf(state.size[0]) > -1 ? state.size[0] : null;
      if (state.view === "phone") { state.sheet = id; state.toast = null; render(".sd-sheet .sd-x"); } else { state.open = id; render('[data-add="' + id + '"]'); }
    }
    else if (t.hasAttribute("data-sz")) { state.chosen = t.getAttribute("data-sz"); render('[data-sz="' + state.chosen + '"]'); }
    else if (t.hasAttribute("data-add")) {
      var aid = +t.getAttribute("data-add"); state.added[aid] = state.chosen; state.bag++; state.open = null;
      if (state.view === "phone") { state.sheet = null; state.toast = "Added to bag · Size " + state.chosen; }
      state.chosen = null; render(); say("Added to bag. Bag has " + state.bag + " item" + (state.bag === 1 ? "" : "s") + ".");
    }
    else if (t.hasAttribute("data-close")) { state.sheet = null; state.chosen = null; render(); }
  });
  document.addEventListener("click", function (e) { if (!root.contains(e.target) && state.pop) { state.pop = null; render(); } });
  root.addEventListener("keydown", function (e) { if (e.key === "Escape" && (state.pop || state.sheet !== null || state.open !== null)) { state.pop = null; state.sheet = null; state.open = null; state.chosen = null; render(); } });
  root.querySelectorAll("[data-view]").forEach(function (b) { b.addEventListener("click", function () { reset(b.getAttribute("data-view")); render(); say(""); }); });
  var restart = root.querySelector(".sd-restart"); if (restart) restart.addEventListener("click", function () { reset(); render(); say("Prototype restarted."); });
  var tryEmpty = root.querySelector(".sd-try"); if (tryEmpty) tryEmpty.addEventListener("click", function () {
    var v = state.view; reset(v); state.size = ["XS"]; state.price = "u25"; render(); say("Applied Size XS, Color Black and Price Under $25: no matches.");
  });
  if (window.ResizeObserver) new ResizeObserver(fit).observe(stage); else window.addEventListener("resize", fit);
  if (stage.clientWidth < 600) reset("phone");
  render();
})();
