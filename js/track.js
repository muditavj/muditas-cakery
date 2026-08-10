/* Mudita's Cakery — visitor tracking.
   Cookie-free: one random id in localStorage, no IP stored, no third parties.
   Every failure path is silent; analytics must never break the site. */
(function () {
  "use strict";
  var EP = String(((window.CAKERY_ANALYTICS || {}).endpoint) || "").replace(/\/+$/, "");
  if (!EP) return;

  var ua = navigator.userAgent || "";
  if (/bot|crawler|spider|slurp|preview|headless|lighthouse|monitor/i.test(ua)) return;

  var vid;
  try {
    vid = localStorage.getItem("cakery_vid");
    if (!vid) {
      vid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
          : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("cakery_vid", vid);
    }
  } catch (e) {
    // Private mode with storage blocked: still count the visit, just always as new.
    vid = "nostore-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  var device = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|Android/i.test(ua) ? "mobile" : "desktop";

  var ref = "";
  try {
    if (document.referrer) {
      ref = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (ref === location.hostname) ref = "";   // internal navigation isn't a source
    }
  } catch (e) { ref = ""; }

  function send(type, path, label, num) {
    var body = JSON.stringify({
      v: vid, t: type, p: path || null, l: label || null,
      n: (typeof num === "number" ? num : null), r: ref, d: device
    });
    try {
      // text/plain keeps this a "simple" request, so no CORS preflight per event.
      if (navigator.sendBeacon) navigator.sendBeacon(EP + "/e", new Blob([body], { type: "text/plain" }));
      else fetch(EP + "/e", { method: "POST", body: body, keepalive: true, mode: "no-cors" });
    } catch (e) { /* ignore */ }
  }

  /* ---- route views ---- */
  function route() {
    var h = location.hash || "#", m;
    if ((m = h.match(/^#item\/(.+)/))) { var s = decodeURIComponent(m[1]); return ["#item/" + s, s]; }
    if ((m = h.match(/^#cat\/(.+)/)))  { return ["#cat/" + m[1], decodeURIComponent(m[1])]; }
    return [h, null];
  }

  var lastPath = null, lastAt = 0;
  function view() {
    var r = route(), now = Date.now();
    if (r[0] === lastPath && now - lastAt < 800) return;   // hashchange can double-fire
    lastPath = r[0]; lastAt = now;
    send("view", r[0], r[1]);
    beginDwell(r[0], r[1]);
  }

  /* ---- time spent on each screen ----
     Only counts while the tab is actually visible, so a phone left in a pocket
     doesn't log an hour on the truffle cake. Capped at CAP_S for the same reason;
     read the result as a median, not a mean. */
  var CAP_S = 300;
  var dPath = null, dLabel = null, dStart = 0, dAccum = 0;

  function beginDwell(path, label) {
    endDwell();
    dPath = path; dLabel = label; dAccum = 0;
    dStart = document.hidden ? 0 : Date.now();
  }
  function endDwell() {
    if (!dPath) return;
    if (dStart) dAccum += Date.now() - dStart;
    var secs = Math.round(dAccum / 1000);
    // under 2s is a pass-through, not a look
    if (secs >= 2) send("dwell", dPath, dLabel, Math.min(secs, CAP_S));
    dPath = null; dLabel = null; dStart = 0; dAccum = 0;
  }

  document.addEventListener("visibilitychange", function () {
    if (!dPath) return;
    if (document.hidden) { if (dStart) { dAccum += Date.now() - dStart; dStart = 0; } }
    else if (!dStart) dStart = Date.now();
  });
  // pagehide fires on mobile back/close where unload does not
  window.addEventListener("pagehide", endDwell);
  window.addEventListener("beforeunload", endDwell);

  view();
  window.addEventListener("hashchange", view);

  /* ---- outbound intent ---- */
  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (/^https:\/\/wa\.me\//i.test(href)) send("order_click", location.hash || "#", a.getAttribute("data-item"));
    else if (/^tel:/i.test(href)) send("tel", location.hash || "#");
    else if (/instagram\.com/i.test(href)) send("instagram", location.hash || "#");
  }, true);

  /* ---- search, debounced so one query isn't logged per keystroke ---- */
  var searchTimer;
  window.cakeryTrackSearch = function (term, count) {
    clearTimeout(searchTimer);
    term = String(term || "").trim().toLowerCase();
    if (term.length < 2) return;
    searchTimer = setTimeout(function () { send("search", "#search", term.slice(0, 60), count); }, 900);
  };
})();
