# Sweet Slice — Digital Menu 🍰
*by Mudita's Cakery*

A modern, cinematic, mobile-friendly digital menu. No build step, no server — just static files you can host free.

---

## 👀 Preview it on your computer

A local preview is already running at:

**→ http://localhost:8777**

To start it again later, open Terminal in this folder and run:

```bash
python3 -m http.server 8777
```

Then open **http://localhost:8777** in your browser.
(Tip: view the menu, then click the **Compact / Rich** toggle at the top to switch views.)

---

## ✏️ How to update the menu (the ONLY file you edit)

Everything — items, prices, descriptions, contact info — lives in:

```
js/menu-data.js
```

Open it in any text editor. It's written with plain-English comments. Examples:

- **Change a price** → edit the `price:` number.
- **Add an item** → copy one `{ ... }` block inside a category and change the text.
- **Remove an item** → delete its `{ ... }` block.
- **Multiple sizes** →
  ```js
  price: [ { label: "200g", value: 50 }, { label: "300g", value: 65 } ]
  ```
- **Add a badge** → `tags: ["bestseller"]` (options: bestseller, signature, seasonal, new, sugarfree).

Save the file and refresh the browser — done.

### Detail pages (each cake has its own page)
Click any cake → it opens a full detail page with its own shareable link
(e.g. `.../#item/cheesecakes-kunafa`). Each page shows a description, a
**sizes & pricing** table, **ingredients**, **allergens**, a prep-time note, and
**related bakes**.

The ingredients/allergens/story are **auto-generated sensible defaults**. To
write your own for any item, just add these fields in `js/menu-data.js`:
```js
{
  name: "Chocolate", price: 700, image: "images/choc.jpg",
  desc: "Deep, fudgy and rich.",
  story: ["First paragraph...", "Second paragraph..."],   // optional
  ingredients: ["Dark chocolate 70%", "Butter", "Eggs"],  // optional
  allergens: ["Gluten", "Dairy", "Egg"]                   // optional
}
```

> ⚠️ **IMPORTANT — allergens:** the auto-generated allergen info is a *guess based
> on the name*. Before you share the site publicly, please review the allergens
> on each item (add your own `allergens: [...]` where needed). Wrong allergen
> info can be dangerous for customers with allergies.

### Editing the extra sections
About / How-to-Order / FAQ / Gallery all live in `js/menu-data.js` too —
look for `story`, `howToOrder`, `faq`, and `gallery` near the top.

---

## 📸 Using YOUR OWN photos (from Instagram, etc.)

Right now the menu uses beautiful **placeholder** photos so you can see the design.
To use your real cakes:

1. Save your photos into the **`images/`** folder in this project.
   (e.g. `images/chocolate-cake.jpg`, `images/red-velvet.jpg`)
2. In `js/menu-data.js`, set that item's `image:` to your file, e.g.
   ```js
   { name: "Chocolate", price: 700, image: "images/chocolate-cake.jpg", desc: "..." }
   ```
3. Refresh. That's it.

> Tip: square or portrait photos look best. ~1000px wide is plenty.

---

## 🚀 Put it online for FREE (Netlify — easiest)

1. Go to **https://app.netlify.com/drop**
2. Drag this whole **Cakery** folder onto the page.
3. Netlify instantly gives you a live URL like `https://sweet-slice-xyz.netlify.app` — share it with customers!

To update later: make your edits, then drag the folder onto Netlify again (or connect it to auto-update).
You can also set a nicer custom name/domain in Netlify's site settings — all free.

---

## 📁 What's in here

```
index.html          → the page structure
css/styles.css      → all the styling (colours are CSS variables at the top)
js/menu-data.js     → YOUR MENU — edit this
js/app.js           → the animations/interactions (no need to touch)
images/             → put your own photos here
source/             → your original PDF menu (kept for reference)
```

## 📱 How the site is laid out (app-like)
It works like a friendly food app so customers barely scroll:
- **Home** — colourful category tiles + a search bar
- **Tap a tile** → just that category (with a Grid / Detailed toggle)
- **Tap an item** → its own detail page (shareable link, e.g. `…/#item/cheesecakes-kunafa`)
- **Search** (🔍 in the bottom bar) → find any bake instantly
- **Bottom bar** (mobile): 🏠 Home · 🔍 Search · 💬 Order (WhatsApp)
- **☰ menu**: About, How to Order, Gallery, FAQ

## 🎨 Want to tweak the colours?
Current theme is **"Modern & Playful"** (warm cream + candy accents). The palette
is at the top of `css/styles.css` under `:root { ... }`:
`--bg` (cream), `--ink` (text), `--pink`, `--orange`, `--mint`, `--purple`,
`--yellow` (candy accents), `--wa` (WhatsApp green). Change a value, refresh.

**Category tile emoji + colour** live near the top of `js/app.js` in the
`CATSTYLE` map — e.g. `"cheesecakes": { e: "🍰", c: "#9b6cf0" }`. Change the
emoji or hex to restyle a tile.
