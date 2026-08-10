/* ============================================================================
   SWEET SLICE — app-like, category-first menu (Modern & Playful)
   View router: Home → Category → Item → Search → Info (About/HowTo/Gallery/FAQ)
   ============================================================================ */
(function () {
  "use strict";

  const SITE = window.SITE;
  const CUR = SITE.currency;
  const UI = (k, d) => (SITE.ui && SITE.ui[k]) || d;
  const canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const app = $("#app");

  /* ------------------------------------------------------------ helpers */
  const money = (v) => `<span class="cur">${CUR}</span>${v}`;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const two = (n) => String(n).padStart(2, "0");
  const slugify = (s) => s.toLowerCase().replace(/["'’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const minPrice = (item) => Array.isArray(item.price) ? Math.min(...item.price.map((v) => v.value)) : item.price;
  const catMinPrice = (cat) => Math.min(...cat.items.map(minPrice));

  /* ------------------------------------------------------------ category styling (playful) */
  const CATSTYLE = {
    "signature-cakes":  { e: "🎂", c: "#ff5b8a" },
    "dry-cakes":        { e: "🧁", c: "#ff7a45" },
    "cheesecakes":      { e: "🍰", c: "#9b6cf0" },
    "brownies-truffle": { e: "🍫", c: "#c96a3f" },
    "doughnuts-rolls":  { e: "🍩", c: "#ffbe2e" },
    "cookies":          { e: "🍪", c: "#e0a24a" },
    "specials":         { e: "⭐", c: "#2ec9a5" },
    "mava":             { e: "🍕", c: "#46b6ff" },
    "breads":           { e: "🍞", c: "#d98a2b" },
    "buns-pav":         { e: "🥖", c: "#f0983c" },
  };
  const cstyle = (id) => CATSTYLE[id] || { e: "🍰", c: "#ff5b8a" };

  /* ------------------------------------------------------------ indexes */
  const INDEX = {};        // slug -> {item, cat}
  const ALL = [];          // {item, cat}
  const CATBYID = {};
  SITE.categories.forEach((cat) => {
    CATBYID[cat.id] = cat;
    cat.items.forEach((item) => {
      item._slug = cat.id + "-" + slugify(item.name);
      INDEX[item._slug] = { item, cat };
      ALL.push({ item, cat });
    });
  });
  const TOTAL = ALL.length;

  /* real photos: prefer a local image (images/<slug>.jpg) when we have one */
  const imgFor = (item, cat) => item.image || cat.image;
  const heroImg = (cat) => { const it = cat.items.find((i) => i.image); return it ? it.image : cat.image; };

  /* ------------------------------------------------------------ WhatsApp links */
  const waGeneral = `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent("Hi Mudita's Cakery! I'd like to place an order.")}`;
  const waItem = (item) => `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(`Hi Mudita's Cakery! I'd like to order: ${item.name}. Could you share details?`)}`;

  /* ------------------------------------------------------------ derivations (editable defaults) */
  function deriveSizes(item, cat) {
    if (Array.isArray(item.price)) return item.price.map((v) => ({ label: v.label, value: v.value }));
    return [{ label: item.unit || cat.unit || "each", value: item.price }];
  }
  const KW = [
    [/nutella/i, "Hazelnut cocoa spread"], [/lotus|biscoff/i, "Biscoff caramel biscuit"],
    [/chocolate|choco|truffle|brownie|black forest/i, "Cocoa / dark chocolate"],
    [/almond/i, "Almonds"], [/pista|pistachio/i, "Pistachios"], [/peanut/i, "Peanut butter"],
    [/coconut/i, "Coconut"], [/coffee|espresso|dalgona/i, "Coffee"], [/strawberr/i, "Strawberry"],
    [/blueberr/i, "Blueberries"], [/mango/i, "Mango"], [/rose/i, "Rose"],
    [/saffron|kesar|rasmalai/i, "Saffron & cardamom"], [/mava|malai|mawa/i, "Mava (khoya)"],
    [/oreo/i, "Cookies & cream"], [/caramel|butterscotch/i, "Caramel"], [/honey/i, "Honey"],
    [/cinnamon/i, "Cinnamon"], [/paan|gulkand/i, "Gulkand & paan"], [/gulab\s*jamun/i, "Gulab jamun"],
    [/multigrain|oat|raagi|granola|wheat|suji|fruit\s*&?\s*nut|dry\s*fruit/i, "Wholegrains, nuts & seeds"],
    [/fig/i, "Fig"], [/kunafa/i, "Kunafa pastry"],
  ];
  function deriveIngredients(item, cat) {
    if (item.ingredients) return item.ingredients;
    let base;
    if (cat.id === "cheesecakes") base = ["Cream cheese", "Fresh cream", "Butter-biscuit base", "Sugar"];
    else if (cat.id === "cookies") base = ["Wheat flour", "Butter", "Sugar"];
    else if (cat.id === "breads" || cat.id === "buns-pav") base = ["Flour", "Yeast", "Salt", "Butter / olive oil"];
    else if (cat.id === "doughnuts-rolls") base = ["Flour", "Yeast", "Butter", "Sugar"];
    else base = ["Refined flour", "Butter", "Sugar", "Fresh cream", "Milk"];
    const set = new Set(base);
    const hay = item.name + " " + (item.desc || "");
    KW.forEach(([re, ing]) => { if (re.test(hay)) set.add(ing); });
    return Array.from(set).slice(0, 7);
  }
  function deriveAllergens(item, cat) {
    if (item.allergens) return item.allergens;
    const hay = item.name + " " + (item.desc || "");
    const a = ["Gluten (wheat)", "Dairy"];   // never egg — all our bakes are 100% eggless
    if (/almond|pista|pistachio|nutella|nut|hazelnut/i.test(hay)) a.push("Tree nuts");
    if (/peanut/i.test(hay)) a.push("Peanuts");
    return a;
  }
  function deriveStory(item, cat) {
    if (item.story) return Array.isArray(item.story) ? item.story : [item.story];
    return [
      item.desc || `A house favourite from our ${cat.name.toLowerCase()}.`,
      `Like everything at Mudita's Cakery, your ${item.name} is 100% eggless, baked fresh to order and finished by hand — never mass-made, never sitting on a shelf.`,
    ];
  }
  const prepNote = (cat) => cat.id === "cheesecakes" ? "Please order at least 3 days in advance." : "Please order 1–2 days in advance.";

  /* ------------------------------------------------------------ shared markup */
  function tagsHTML(item) {
    if (!item.tags || !item.tags.length) return "";
    const label = { bestseller: "Bestseller", signature: "Signature", seasonal: "Seasonal", sugarfree: "Sugar-free", new: "New", notice: "Pre-order" };
    return `<div class="tags">${item.tags.map((t) => `<span class="tag tag--${t}">${label[t] || t}</span>`).join("")}</div>`;
  }
  const variantChips = (item) => `<div class="variants">${item.price.map((v) => `<span class="variant">${esc(v.label)}<b>${money(v.value)}</b></span>`).join("")}</div>`;

  /* ============================================================ VIEWS */

  /* ---- HOME ---- */
  // Food-safety mark. The licence number only shows once it's filled in via Admin.
  function fssaiHTML() {
    const lic = (SITE.contact && SITE.contact.fssai || "").trim();
    return `
      <div class="fssai stagger">
        <span class="fssai__seal" aria-hidden="true">
          <svg viewBox="0 0 44 44" fill="none">
            <path d="M22 3.4 38.2 9v13.1c0 8.5-6.4 15.6-16.2 18.5C12.2 37.7 5.8 30.6 5.8 22.1V9z"
                  fill="currentColor" opacity=".1"/>
            <path d="M22 3.4 38.2 9v13.1c0 8.5-6.4 15.6-16.2 18.5C12.2 37.7 5.8 30.6 5.8 22.1V9z"
                  stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
            <path d="m15.4 21.8 4.8 4.9 8.7-9.4" stroke="currentColor" stroke-width="2.6"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="fssai__txt">
          <b>FSSAI Registered</b>
          <em>${lic ? `Lic. No. ${esc(lic)}` : "Licensed home kitchen · food-safety compliant"}</em>
        </span>
      </div>`;
  }

  function viewHome() {
    if (layout === "tabs") return viewTabbed(SITE.categories[0]);
    if (layout === "accordion") return viewAccordion(null);
    const parts = SITE.brand.name.split(" ");
    const brandTitle = `<em>${esc(parts[0])}</em>${parts.length > 1 ? " " + esc(parts.slice(1).join(" ")) : ""}`;
    const cards = SITE.categories.map((cat) => {
      const st = cstyle(cat.id);
      const pics = cat.items.filter((i) => i.image).map((i) => i.image);
      const hero = pics[0] || cat.image;
      const thumbs = pics.slice(1, 4);
      while (thumbs.length < 3) thumbs.push(pics[0] || cat.image);
      return `
        <a class="deckcard stagger" href="#cat/${cat.id}" data-cursor>
          <span class="deckcard__media">
            <img src="${hero}" alt="${esc(cat.name)}" loading="lazy" crossorigin="anonymous" />
            <span class="deckcard__badge">${st.e}</span>
            <span class="deckcard__count">${cat.items.length} items</span>
          </span>
          <span class="deckcard__body">
            <span class="deckcard__title">${esc(cat.name)}</span>
            <span class="deckcard__thumbs">${thumbs.map((s) => `<img src="${s}" alt="" loading="lazy" crossorigin="anonymous" />`).join("")}</span>
            <span class="deckcard__btn">View all ${cat.items.length} · from ${CUR}${catMinPrice(cat)} <b>→</b></span>
          </span>
        </a>`;
    }).join("");

    app.innerHTML = `
      <section class="view home">
        <div class="hero">
          <span class="pill stagger">${esc(UI("heroPill", "Freshly Baked · Home Bakery"))}</span>
          <h1 class="stagger brand-name">${brandTitle}</h1>
          <p class="brand-mark stagger">${esc(SITE.brand.tagline)}</p>
          <span class="egg-badge stagger">${esc(UI("egglessBadge", "100% Eggless bakery"))}</span>
          <a class="searchbar stagger" href="#search" data-link>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><line x1="16" y1="16" x2="20.5" y2="20.5"/></svg>
            ${esc(UI("searchPlaceholder", "Search cakes, cookies, breads…"))}
          </a>
        </div>
        <div class="section-label">
          <h2>Browse the menu</h2>
          <span class="decknav"><button class="deckarrow" data-dir="-1" aria-label="Previous">‹</button><button class="deckarrow" data-dir="1" aria-label="Next">›</button></span>
        </div>
        <div class="deck" id="deck">${cards}</div>
        <div class="deckdots" id="deckdots"></div>
        <p class="deckhint">Swipe sideways, or tap the arrows, to see all ${SITE.categories.length} categories</p>
        ${fssaiHTML()}
        <div class="home__links">
          <a href="#about" data-link>Our Story</a>
          <a href="#howto" data-link>How to Order</a>
          <a href="#gallery" data-link>Gallery</a>
          <a href="#faq" data-link>FAQ</a>
        </div>
      </section>`;
    afterView();
  }

  /* ---- CATEGORY ---- */
  let catView = "compact";
  let layout = "tiles";   // "tiles" (category-first) | "tabs" (tabbed menu)
  function itemsHTML(cat, view) {
    let last = null, out = "";
    cat.items.forEach((item, i) => {
      if (item.collection && item.collection !== last) { out += `<div class="subhead">${esc(item.collection)}</div>`; last = item.collection; }
      const unit = item.unit || cat.unit;
      if (view === "rich") {
        const priceHTML = Array.isArray(item.price) ? variantChips(item)
          : `<span class="rrow__price price">${money(item.price)}</span>${unit ? `<span class="ccard__unit">${esc(unit)}</span>` : ""}`;
        out += `
          <article class="rrow stagger">
            <a class="rrow__media distort" href="#item/${item._slug}" data-cursor><img src="${imgFor(item, cat)}" alt="${esc(item.name)}" loading="lazy" crossorigin="anonymous" /></a>
            <div class="rrow__body">
              ${tagsHTML(item)}
              <h3 class="rrow__name">${esc(item.name)}</h3>
              ${item.desc ? `<p class="rrow__desc">${esc(item.desc)}</p>` : ""}
              <div class="rrow__meta">${priceHTML}</div>
              <div class="rrow__actions">
                <a class="btn-sm view" href="#item/${item._slug}">View details</a>
                <a class="btn-sm order" href="${waItem(item)}" data-item="${item._slug}" target="_blank" rel="noopener">Order</a>
              </div>
            </div>
          </article>`;
      } else {
        out += `
          <a class="ccard stagger" href="#item/${item._slug}" data-cursor>
            <div class="ccard__media distort">
              ${tagsHTML(item) ? `<div class="ccard__tags">${tagsHTML(item)}</div>` : ""}
              <img src="${imgFor(item, cat)}" alt="${esc(item.name)}" loading="lazy" crossorigin="anonymous" />
            </div>
            <div class="ccard__body">
              <div class="ccard__name">${esc(item.name)}</div>
              ${Array.isArray(item.price)
                ? `<div class="variants" style="margin-top:.4rem">${item.price.map((v) => `<span class="variant">${esc(v.label)}<b>${money(v.value)}</b></span>`).join("")}</div>`
                : `<div class="ccard__row"><span class="ccard__price price">${money(item.price)}</span></div>${unit ? `<span class="ccard__unit">${esc(unit)}</span>` : ""}`}
            </div>
          </a>`;
      }
    });
    return `<div class="items ${view}">${out}</div>`;
  }
  const toggleHTML = () => `
    <div class="viewtoggle" id="viewtoggle" data-view="${catView}">
      <span class="viewtoggle__pill"></span>
      <button data-view="compact" class="${catView === "compact" ? "is-active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Grid
      </button>
      <button data-view="rich" class="${catView === "rich" ? "is-active" : ""}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="7" rx="1"/><line x1="3" y1="16" x2="14" y2="16"/><line x1="3" y1="20" x2="10" y2="20"/></svg>Detailed
      </button>
    </div>`;

  function catHeaderHTML(cat) {
    const st = cstyle(cat.id);
    return `<div class="viewbar__title"><span class="e">${st.e}</span>${esc(cat.name)} <span class="count" style="background:${st.c}">${cat.items.length}</span></div><div class="viewbar__spacer"></div>${toggleHTML()}`;
  }

  function bindViewToggle(cat) {
    const toggle = $("#viewtoggle");
    if (!toggle) return;
    $$("button", toggle).forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.view;
      if (v === catView) return;
      catView = v; toggle.dataset.view = v;
      $$("button", toggle).forEach((x) => x.classList.toggle("is-active", x === b));
      $("#catItems").innerHTML = itemsHTML(cat, v);
      afterView();
    }));
  }

  /* TILES mode: single category with a "← All" back to the tile grid */
  function viewCategory(id) {
    const cat = CATBYID[id];
    if (!cat) { location.hash = ""; return; }
    if (layout === "tabs") return viewTabbed(cat);
    if (layout === "accordion") return viewAccordion(cat.id);
    app.innerHTML = `
      <section class="view catview">
        <div class="viewbar"><a class="back" href="#" data-link>← All</a>${catHeaderHTML(cat)}</div>
        ${cat.blurb ? `<p class="catview__blurb">${esc(cat.blurb)}</p>` : ""}
        ${cat.note ? `<div class="catnote">◆ ${esc(cat.note)}</div>` : ""}
        <div id="catItems">${itemsHTML(cat, catView)}</div>
      </section>`;
    bindViewToggle(cat);
    afterView();
  }

  /* TABS mode: sticky category tab-strip, items swap in place (no tile grid) */
  function viewTabbed(cat) {
    const tabs = SITE.categories.map((c) => {
      const s = cstyle(c.id);
      return `<a class="tabchip ${c.id === cat.id ? "is-active" : ""}" href="#cat/${c.id}" style="--tc:${s.c}"><span class="e">${s.e}</span>${esc(c.name)}</a>`;
    }).join("");
    app.innerHTML = `
      <section class="view tabbed">
        <div class="tabstrip" id="tabstrip">${tabs}</div>
        <div class="viewbar">${catHeaderHTML(cat)}</div>
        ${cat.blurb ? `<p class="catview__blurb">${esc(cat.blurb)}</p>` : ""}
        ${cat.note ? `<div class="catnote">◆ ${esc(cat.note)}</div>` : ""}
        <div id="catItems">${itemsHTML(cat, catView)}</div>
      </section>`;
    bindViewToggle(cat);
    const active = $("#tabstrip .is-active");
    if (active && active.scrollIntoView) active.scrollIntoView({ inline: "center", block: "nearest" });
    afterView();
  }

  /* ACCORDION mode: all categories listed & collapsed; expand one at a time */
  function viewAccordion(openId) {
    const first = openId || SITE.categories[0].id;
    const rows = SITE.categories.map((cat) => {
      const s = cstyle(cat.id);
      const open = cat.id === first;
      return `
        <div class="acc__item stagger ${open ? "is-open" : ""}" data-acc="${cat.id}">
          <button class="acc__head" style="--tc:${s.c}">
            <span class="acc__emoji" style="background:${s.c}">${s.e}</span>
            <span class="acc__label"><span class="acc__name">${esc(cat.name)}</span><span class="acc__count">${cat.items.length} items · from ${CUR}${catMinPrice(cat)}</span></span>
            <span class="acc__spacer"></span>
            <span class="acc__chev"></span>
          </button>
          <div class="acc__panel"><div class="acc__panel-inner">${itemsHTML(cat, "compact")}</div></div>
        </div>`;
    }).join("");

    app.innerHTML = `
      <section class="view accordion">
        <a class="searchbar stagger" href="#search" data-link style="margin:0 0 1.2rem"><span class="e">🔍</span> Search cakes, cookies, breads…</a>
        <div class="acc">${rows}</div>
      </section>`;

    const openItem = $(".acc__item.is-open", app);
    if (openItem) $(".acc__panel", openItem).style.height = "auto";

    $$(".acc__item", app).forEach((item) => {
      $(".acc__head", item).addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        $$(".acc__item.is-open", app).forEach((o) => {
          if (o !== item) { o.classList.remove("is-open"); gsap.to($(".acc__panel", o), { height: 0, duration: .4, ease: "power2.out" }); }
        });
        const panel = $(".acc__panel", item);
        if (isOpen) { item.classList.remove("is-open"); gsap.to(panel, { height: 0, duration: .4, ease: "power2.out" }); }
        else { item.classList.add("is-open"); gsap.set(panel, { height: "auto" }); gsap.from(panel, { height: 0, duration: .45, ease: "power2.out" }); }
      });
    });
    afterView();
  }

  /* ---- ITEM (detail) ---- */
  function relatedHTML(cat, current) {
    const rel = cat.items.filter((i) => i !== current).slice(0, 4);
    if (!rel.length) return "";
    const cards = rel.map((item) => `
      <a class="ccard stagger" href="#item/${item._slug}" data-cursor>
        <div class="ccard__media distort"><img src="${imgFor(item, cat)}" alt="${esc(item.name)}" loading="lazy" crossorigin="anonymous" /></div>
        <div class="ccard__body"><div class="ccard__name">${esc(item.name)}</div>
        ${!Array.isArray(item.price) ? `<div class="ccard__row"><span class="ccard__price price">${money(item.price)}</span></div>` : ""}</div>
      </a>`).join("");
    return `<section class="related"><h3>You may also like 🍽️</h3><div class="items compact">${cards}</div></section>`;
  }
  function viewItem(slug) {
    const rec = INDEX[slug];
    if (!rec) { location.hash = ""; return; }
    const { item, cat } = rec;
    const st = cstyle(cat.id);
    const sizes = deriveSizes(item, cat), ing = deriveIngredients(item, cat), alg = deriveAllergens(item, cat), story = deriveStory(item, cat);
    const from = Array.isArray(item.price) ? `from ${CUR}${minPrice(item)}` : `${CUR}${item.price}`;
    const unit = item.unit || cat.unit || "";

    app.innerHTML = `
      <section class="view detail">
        <div class="viewbar"><a class="back" href="#cat/${cat.id}" data-link>← ${esc(cat.name)}</a></div>
        <div class="detail__hero">
          <div class="detail__media distort stagger" data-cursor><img src="${imgFor(item, cat)}" alt="${esc(item.name)}" crossorigin="anonymous" /></div>
          <div class="stagger">
            <div class="detail__cat"><span style="color:${st.c}">${st.e}</span> ${esc(cat.kicker || cat.name)}</div>
            <h1 class="detail__title">${esc(item.name)}</h1>
            <div class="detail__badges"><span class="egg-badge">100% Eggless</span>${tagsHTML(item)}</div>
            ${item.desc ? `<p class="detail__lead">${esc(item.desc)}</p>` : ""}
            <div class="detail__price">${esc(from)}${unit ? `<small>${esc(unit)}</small>` : ""}</div>
            <div class="detail__buy">
              <a class="btn btn--wa magnetic" href="${waItem(item)}" data-item="${item._slug}" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.8-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2A10 10 0 002 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3A10 10 0 1012 2z"/></svg>
                Order on WhatsApp
              </a>
              <a class="btn btn--soft magnetic" href="tel:${SITE.contact.phone}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 16.9v2.6a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19 19 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.6A2 2 0 0 1 3.9 2h2.6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.6 9.7a15.5 15.5 0 0 0 5.9 5.9l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg> Call</a>
            </div>
          </div>
        </div>
        <div class="detail__body">
          <div class="dcard dcard--full stagger"><h3>✦ The bake</h3>${story.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          <div class="dcard stagger"><h3>📏 Sizes &amp; pricing</h3>
            <table class="spec-table">${sizes.map((s) => `<tr><td>${esc(s.label)}</td><td>${money(s.value)}</td></tr>`).join("")}</table>
            <div class="note-box">Custom sizes &amp; designs available on request.</div>
          </div>
          <div class="dcard stagger"><h3>🧾 Ingredients</h3><div class="chips">${ing.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div></div>
          <div class="dcard dcard--full stagger"><h3>⚠️ Allergens</h3><div class="chips">${alg.map((a) => `<span class="chip chip--allergen">${esc(a)}</span>`).join("")}</div>
            <div class="note-box"><b>100% eggless.</b> Every cake &amp; bake we make is completely egg-free. The allergens above are indicative defaults — kindly confirm ingredients &amp; sugar-free options before ordering, especially for allergies. ${esc(prepNote(cat))}</div>
          </div>
        </div>
        ${relatedHTML(cat, item)}
      </section>`;
    afterView();
  }

  /* ---- SEARCH ---- */
  function viewSearch() {
    app.innerHTML = `
      <section class="view search">
        <div class="search__head">
          <label class="search__field"><span>🔍</span><input id="q" type="search" placeholder="${esc(UI("searchPlaceholder", "Search cakes, cookies, breads…"))}" autocomplete="off" /></label>
          <a class="search__x" href="#" data-link aria-label="Close search">✕</a>
        </div>
        <div id="results"><p class="search__hint">Start typing to find your treat 🍪</p></div>
      </section>`;
    const q = $("#q"), results = $("#results");
    const run = () => {
      const term = q.value.trim().toLowerCase();
      if (!term) { results.innerHTML = `<p class="search__hint">Start typing to find your treat 🍪</p>`; return; }
      const hits = ALL.filter(({ item }) => item.name.toLowerCase().includes(term) || (item.desc || "").toLowerCase().includes(term));
      if (window.cakeryTrackSearch) window.cakeryTrackSearch(term, hits.length);
      if (!hits.length) { results.innerHTML = `<p class="search__hint">No matches for “${esc(term)}” 🤔<br>Try “chocolate”, “bread” or “eggless”.</p>`; return; }
      results.innerHTML = `<p class="search__count">${hits.length} result${hits.length > 1 ? "s" : ""}</p>` +
        hits.map(({ item, cat }) => `
          <a class="result stagger" href="#item/${item._slug}" data-cursor>
            <img src="${imgFor(item, cat)}" alt="${esc(item.name)}" loading="lazy" crossorigin="anonymous" />
            <div><div class="result__name">${esc(item.name)}</div><div class="result__cat">${cstyle(cat.id).e} ${esc(cat.name)}</div></div>
            <div class="result__price">${Array.isArray(item.price) ? "from " : ""}${CUR}${minPrice(item)}</div>
          </a>`).join("");
      afterView();
    };
    q.addEventListener("input", run);
    afterView();
    setTimeout(() => q.focus(), 60);
  }

  /* ---- INFO (about / howto / gallery / faq) ---- */
  function viewInfo(page) {
    let body = "";
    if (page === "about") {
      const s = SITE.story;
      body = `
        <h1>${s.title.replace(/<br>/g, "<br>")}</h1>
        <div class="about__media stagger"><img src="${s.image}" alt="Mudita's Cakery" loading="lazy" crossorigin="anonymous" /></div>
        <p class="info__lead stagger">${esc(s.body[0])}</p>
        ${s.body.slice(1).map((p) => `<p class="stagger">${esc(p)}</p>`).join("")}
        <div class="stats stagger">${s.stats.map((st) => `<div><b>${esc(st.n)}</b><span>${esc(st.l)}</span></div>`).join("")}</div>`;
    } else if (page === "howto") {
      const h = SITE.howToOrder;
      body = `
        <h1>How to <em>Order</em></h1>
        <div class="steps">${h.steps.map((st, i) => `<div class="step stagger"><div class="step__n">${two(i + 1)}</div><h3>${esc(st.t)}</h3><p>${esc(st.d)}</p></div>`).join("")}</div>
        <div class="delivery stagger"><h3>Pickup &amp; delivery</h3><ul>${h.delivery.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div>
        <a class="btn btn--wa magnetic stagger" style="margin-top:1.4rem" href="${waGeneral}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.7-.83-2-.93-.26-.1-.45-.15-.64.15-.19.28-.73.92-.9 1.1-.16.19-.33.21-.62.07-1.6-.8-2.64-1.43-3.7-3.23-.28-.48.28-.45.8-1.48.09-.18.04-.34-.02-.48-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35-.26.28-1 .98-1 2.4s1.02 2.78 1.17 2.97c.14.19 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.8.12.55-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2A10 10 0 0 0 2 12c0 1.77.46 3.45 1.28 4.95L2 22l5.2-1.36A10 10 0 1 0 12 2z"/></svg> Order on WhatsApp</a>`;
    } else if (page === "gallery") {
      body = `<h1>${esc(UI("galleryTitle", "Our Gallery"))}</h1><div class="gallery">${SITE.gallery.map((src) => `<figure class="stagger distort" data-cursor><img src="${src}" alt="Mudita's Cakery bake" loading="lazy" crossorigin="anonymous" /></figure>`).join("")}</div>`;
    } else { // faq
      body = `<h1>${esc(UI("faqTitle", "Frequently Asked"))}</h1><div class="faq">${SITE.faq.map((f) => `<div class="faq__item stagger"><button class="faq__q">${esc(f.q)}<i></i></button><div class="faq__a"><p>${esc(f.a)}</p></div></div>`).join("")}</div>`;
    }
    app.innerHTML = `<section class="view info"><div class="viewbar"><a class="back" href="#" data-link>← Menu</a></div>${body}</section>`;

    if (page === "faq") {
      $$(".faq__item", app).forEach((item) => {
        const a = $(".faq__a", item);
        $(".faq__q", item).addEventListener("click", () => {
          if (item.classList.contains("is-open")) { gsap.to(a, { height: 0, duration: .4, ease: "power2.out" }); item.classList.remove("is-open"); }
          else { item.classList.add("is-open"); gsap.set(a, { height: "auto" }); gsap.from(a, { height: 0, duration: .45, ease: "power2.out" }); }
        });
      });
    }
    afterView();
  }

  /* ============================================================ ROUTER */
  let lenis = null;
  function scrollTop() { if (lenis) lenis.scrollTo(0, { immediate: true }); else window.scrollTo(0, 0); }

  function router() {
    closeSheet();
    const h = location.hash; let m;
    if ((m = h.match(/^#item\/(.+)/))) viewItem(decodeURIComponent(m[1]));
    else if ((m = h.match(/^#cat\/(.+)/))) viewCategory(m[1]);
    else if (h === "#search") viewSearch();
    else if (h === "#about") viewInfo("about");
    else if (h === "#howto") viewInfo("howto");
    else if (h === "#gallery") viewInfo("gallery");
    else if (h === "#faq") viewInfo("faq");
    else viewHome();
    setActiveTab(h);
    scrollTop();
  }

  function setActiveTab(h) {
    const tab = h === "#search" ? "search" : (h === "" || h === "#") ? "home" : "";
    $$("#tabbar a[data-tab]").forEach((a) => a.classList.toggle("is-active", a.dataset.tab === tab));
  }

  /* ============================================================ EFFECTS */
  const disp = $("#liquid-disp");
  function bindDistort(scope) {
    if (!canHover || reduceMotion || !disp) return;
    $$(".distort", scope).forEach((el) => {
      if (el.dataset.dz) return; el.dataset.dz = "1";
      const img = $("img", el); if (!img) return;
      el.addEventListener("mouseenter", () => { img.style.filter = "url(#liquid)"; gsap.killTweensOf(disp); gsap.fromTo(disp, { attr: { scale: 0 } }, { attr: { scale: 22 }, duration: .5, ease: "power2.out" }); });
      el.addEventListener("mouseleave", () => { gsap.killTweensOf(disp); gsap.to(disp, { attr: { scale: 0 }, duration: .55, ease: "power3.out", onComplete: () => (img.style.filter = "") }); });
    });
  }
  function bindMagnetic(scope) {
    if (!canHover) return;
    $$(".magnetic", scope).forEach((el) => {
      if (el.dataset.mag) return; el.dataset.mag = "1";
      el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * .25, y: (e.clientY - (r.top + r.height / 2)) * .25, duration: .5, ease: "power3.out" }); });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: .55, ease: "elastic.out(1,.4)" }));
    });
  }
  function afterView() {
    const els = $$(".stagger", app).filter((e) => !e.dataset.shown);
    els.forEach((e) => (e.dataset.shown = "1"));
    if (!reduceMotion && els.length) gsap.to(els, { opacity: 1, y: 0, duration: .5, ease: "power2.out", stagger: 0.03 });
    else els.forEach((e) => { e.style.opacity = 1; e.style.transform = "none"; });
    bindDistort(app); bindMagnetic(app); initDeck();
  }

  /* swipeable category deck: arrows + progress dots + active tracking */
  function initDeck() {
    const deck = $("#deck", app);
    if (!deck) return;
    const cards = $$(".deckcard", deck);
    if (!cards.length) return;
    const dotsWrap = $("#deckdots", app);
    if (dotsWrap) dotsWrap.innerHTML = cards.map((_, i) => `<button class="deckdot${i === 0 ? " is-active" : ""}" data-i="${i}" aria-label="Go to category ${i + 1}"></button>`).join("");
    const dots = dotsWrap ? $$(".deckdot", dotsWrap) : [];
    const step = () => (cards[0] ? cards[0].offsetWidth + 16 : deck.clientWidth * 0.8);
    const sync = () => { const idx = Math.max(0, Math.min(cards.length - 1, Math.round(deck.scrollLeft / step()))); dots.forEach((d, i) => d.classList.toggle("is-active", i === idx)); };
    deck.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    dots.forEach((d, i) => d.addEventListener("click", () => deck.scrollTo({ left: i * step(), behavior: "smooth" })));
    $$(".deckarrow", app).forEach((a) => a.addEventListener("click", () => deck.scrollBy({ left: (+a.dataset.dir) * step(), behavior: "smooth" })));
  }

  /* ---- custom cursor (desktop) ---- */
  function initCursor() {
    if (!canHover) return;
    const cur = $(".cursor"), dot = $(".cursor-dot"), label = $(".cursor__label");
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, dx = mx, dy = my;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener("mouseleave", () => cur.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cur.classList.remove("is-hidden"));
    gsap.ticker.add(() => { cx += (mx - cx) * .18; cy += (my - cy) * .18; dx += (mx - dx) * .5; dy += (my - dy) * .5; cur.style.transform = `translate(${cx}px,${cy}px)`; dot.style.transform = `translate(${dx}px,${dy}px)`; });
    document.addEventListener("mouseover", (e) => {
      const view = e.target.closest("[data-cursor]"), link = e.target.closest("a,button,.magnetic");
      if (view) { cur.classList.add("is-view"); cur.classList.remove("is-hover"); label.textContent = "View"; }
      else if (link) { cur.classList.add("is-hover"); cur.classList.remove("is-view"); }
    });
    document.addEventListener("mouseout", (e) => { const rt = e.relatedTarget; if (!rt || (!rt.closest("[data-cursor]") && !rt.closest("a,button,.magnetic"))) cur.classList.remove("is-hover", "is-view"); });
  }

  /* ---- sheet menu ---- */
  function closeSheet() { document.body.classList.remove("sheet-open"); $("#sheet").classList.remove("is-open"); $("#burger").setAttribute("aria-expanded", "false"); }
  function initSheet() {
    $("#burger").addEventListener("click", () => {
      const open = document.body.classList.toggle("sheet-open");
      $("#sheet").classList.toggle("is-open", open);
      $("#burger").setAttribute("aria-expanded", open);
    });
    $("#sheet").addEventListener("click", (e) => { if (e.target.closest("a")) closeSheet(); });
  }

  /* ---- smooth scroll ---- */
  function initScroll() {
    if (reduceMotion || typeof Lenis === "undefined") return null;
    lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  /* ---- static wiring ---- */
  function wire() {
    $("#waTop").href = waGeneral;
    $("#waTab").href = waGeneral;
    const c = SITE.contact;
    $("#sheetFoot").innerHTML = `
      <a href="${waGeneral}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.7-.83-2-.93-.26-.1-.45-.15-.64.15-.19.28-.73.92-.9 1.1-.16.19-.33.21-.62.07-1.6-.8-2.64-1.43-3.7-3.23-.28-.48.28-.45.8-1.48.09-.18.04-.34-.02-.48-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.35-.26.28-1 .98-1 2.4s1.02 2.78 1.17 2.97c.14.19 2.02 3.08 4.9 4.32.68.3 1.22.47 1.63.6.69.22 1.31.19 1.8.12.55-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2A10 10 0 0 0 2 12c0 1.77.46 3.45 1.28 4.95L2 22l5.2-1.36A10 10 0 1 0 12 2z"/></svg> Order on WhatsApp</a>
      <a href="tel:${c.phone}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 16.9v2.6a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19 19 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.6A2 2 0 0 1 3.9 2h2.6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.6 9.7a15.5 15.5 0 0 0 5.9 5.9l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg> +91 ${esc(c.phone)}</a>
      <a href="${c.instagramUrl}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg> ${esc(c.instagram)}</a>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10.3" r="2.4"/></svg> ${esc(c.address)}</span>`;
  }

  /* ---- preloader ---- */
  function preload(done) {
    const bar = $("#loaderBar"), loader = $("#loader"), word = $(".loader__word"), mark = $(".loader__mark");
    if (reduceMotion) { loader.style.display = "none"; done(); return; }
    const tl = gsap.timeline();
    tl.from(word, { yPercent: 40, opacity: 0, duration: .7, ease: "back.out(1.6)" }, 0);
    if (mark) tl.from(mark, { opacity: 0, y: 8, duration: .5, ease: "power2.out" }, .25);
    tl.to(bar, { scaleX: 1, duration: 1, ease: "power2.inOut" }, .2);
    tl.to(loader, { yPercent: -100, duration: .8, ease: "expo.inOut" }, "+=.1");
    tl.add(done, "-=.5");
  }

  /* ---- boot ---- */
  function boot() {
    wire();
    initScroll();
    initSheet();
    if (canHover) initCursor();
    window.addEventListener("hashchange", router);
    router();
  }
  document.addEventListener("DOMContentLoaded", () => preload(boot));
})();
