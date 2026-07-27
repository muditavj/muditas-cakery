/* ============================================================================
   SWEET SLICE — by Mudita's Cakery
   MENU DATA  ·  THIS IS THE ONLY FILE YOU NEED TO EDIT TO UPDATE THE MENU
   ----------------------------------------------------------------------------
   HOW TO EDIT:
   • Change a price ............ edit the `price` number.
   • Price with sizes .......... use an array, e.g.
                                  price: [{ label: "200g", value: 50 },
                                          { label: "300g", value: 65 }]
   • Add an item ............... copy a { ... } block inside a category's items.
   • Remove an item ............ delete its { ... } block.
   • Use YOUR OWN photo ........ set  image: "images/my-cake.jpg"
                                  (put the file in the /images folder)
   • Tags (little badges) ...... "bestseller" | "seasonal" | "sugarfree" |
                                  "signature" | "new" | "notice"
   Prices are in Indian Rupees (₹).
   ============================================================================ */

/* A small pool of tasteful placeholder photos (swap for your own anytime). */
const IMG = {
  chocolate:  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1100&q=80",
  slice:      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1100&q=80",
  strawberry: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1100&q=80",
  cupcakes:   "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1100&q=80",
  cookies:    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1100&q=80",
  bread:      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1100&q=80",
  cinnamon:   "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1100&q=80",
  doughnuts:  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1100&q=80",
  doughnuts2: "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=1100&q=80",
  cheesecake: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1100&q=80",
  brownie:    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1100&q=80",
  berry:      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1100&q=80",
  macarons:   "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=1100&q=80",
  croissant:  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1100&q=80",
  vanilla:    "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1100&q=80",
  redvelvet:  "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1100&q=80",
  tart:       "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1100&q=80",
  bundt:      "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1100&q=80",
  muffins:    "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1100&q=80",
  pastry:     "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1100&q=80",
};

window.SITE = {
  brand: {
    name: "Mudita's Cakery",                 // ← primary brand (shown big everywhere)
    mark: "Sweet Slice",                      // ← small logo mark / sub-label
    tagline: "Small batches, baked fresh — just for you.",
    intro: "A small-batch home bakery where every cake is baked to order, iced by hand, and finished with the kind of care you can taste. From celebration centrepieces to warm morning breads — this is baking as it should be.",
  },

  contact: {
    phone: "9588890392",
    whatsapp: "919588890392",              // full intl. format for wa.me links
    address: "191, Sabzibazar, Nayapura",
    instagram: "@muditas_cakery",
    instagramUrl: "https://www.instagram.com/muditas_cakery",
  },

  /* Site-wide notes shown near ordering info */
  notes: [
    "Please order at least 1–2 days in advance.",
    "Cheesecake orders require at least 3 days' notice.",
    "Sugar-free options available on most cakes & cookies.",
    "Seasonal flavours available only while in season.",
  ],

  currency: "₹",

  /* --------------------------------------------------------------------------
     STORY / ABOUT  (edit this freely)
     -------------------------------------------------------------------------- */
  story: {
    kicker: "Our Story",
    title: "Baked by hand,<br>in small batches.",
    body: [
      "Mudita's Cakery began at home in Nayapura, with a simple belief — that a cake made with real butter, real cream and a little patience always tastes better. And that you should never have to choose between pure-veg and delicious, so every single cake we make is 100% eggless.",
      "Every order is baked fresh, just for you. Nothing sits on a shelf; nothing is mass-made. From celebration centrepieces to warm morning breads, each bake leaves our kitchen the way we'd serve it to our own family.",
    ],
    stats: [
      { n: "100%", l: "Eggless, always" },
      { n: "80+",  l: "Cakes & bakes" },
      { n: "1–3",  l: "Days' notice" },
    ],
    image: "images/signature-cakes-black-forest.jpg",
  },

  /* --------------------------------------------------------------------------
     HOW TO ORDER + DELIVERY  (edit this freely)
     -------------------------------------------------------------------------- */
  howToOrder: {
    kicker: "How to Order",
    title: "Ordering is<br><em>simple.</em>",
    steps: [
      { t: "Browse & choose",      d: "Pick your cake, flavour and any bakes you love from the menu." },
      { t: "Message us",           d: "Send your choice, size and date on WhatsApp — or give us a call." },
      { t: "Confirm the details",  d: "We'll confirm price, timing and any customisation, then take your order." },
      { t: "Fresh-baked & ready",  d: "Collect from our kitchen, or ask about local delivery on your day." },
    ],
    delivery: [
      "Please order at least 1–2 days in advance. Cheesecakes need at least 3 days' notice.",
      "Pickup from 191, Sabzibazar, Nayapura.",
      "Local delivery available on request — share your area when you order.",
      "Every cake & bake is 100% eggless. Sugar-free options available on most items — just ask.",
    ],
  },

  /* --------------------------------------------------------------------------
     FAQ  (edit / add / remove freely)
     -------------------------------------------------------------------------- */
  faq: [
    { q: "How far in advance should I order?", a: "Most cakes and bakes need 1–2 days' notice. Cheesecakes require at least 3 days. For large or fully-custom orders, please message us as early as you can." },
    { q: "Are your cakes eggless?", a: "Yes — 100% eggless, always. Every cake and bake at Mudita's Cakery is made completely without eggs; being a pure eggless bakery is exactly what we specialise in. Sugar-free options are also available on most items — just ask." },
    { q: "How do I place an order?", a: "Message us on WhatsApp or call 9588890392 with your flavour, size and date. We'll confirm the details and share payment options." },
    { q: "Can I customise the flavour, size or design?", a: "Absolutely. Tell us the occasion and what you have in mind — we'll tailor the cake to you. Custom sizes beyond the menu are available on request." },
    { q: "Do you deliver?", a: "Pickup is from our kitchen in Nayapura. Local delivery is available on request — please share your area when ordering so we can confirm." },
    { q: "How are prices calculated?", a: "Cakes are priced per 500g and cookies per 250g unless a size is listed. Boxes and loaves are priced as shown. Custom sizes are quoted on request." },
  ],

  /* --------------------------------------------------------------------------
     GALLERY  (swap these for your own photos anytime)
     -------------------------------------------------------------------------- */
  gallery: [
    "images/cheesecakes-burnt-basque.jpg",
    "images/signature-cakes-black-forest.jpg",
    "images/brownies-truffle-chocolate-truffle-cake.jpg",
    "images/doughnuts-rolls-honey-cinnamon-rolls.jpg",
    "images/cheesecakes-kunafa.jpg",
    "images/signature-cakes-strawberry.jpg",
    "images/cookies-chocolate.jpg",
    "images/specials-banto-cakes.jpg",
    "images/cheesecakes-mango.jpg",
    "images/breads-focaccia.jpg",
    "images/signature-cakes-chocolate-nutella.jpg",
    "images/specials-cupcakes.jpg",
  ],

  /* --------------------------------------------------------------------------
     CATEGORIES
     `unit` prints under the price (e.g. per 500g). `note` shows as a banner.
     -------------------------------------------------------------------------- */
  categories: [

    {
      id: "signature-cakes",
      name: "Cakes by Flavour",
      kicker: "The Cake Collection",
      blurb: "Soft, moist sponge layered and iced by hand. Choose your flavour — we bake it fresh for your day.",
      unit: "per 500g",
      note: "Priced per 500g · Please order 1–2 days prior",
      image: IMG.slice,
      items: [
        // — Classic fruit —
        { name: "Vanilla",        collection: "Classic Fruit", price: 450, image: IMG.vanilla,    desc: "The timeless one. Fragrant Madagascar-style vanilla sponge, cloud-soft and delicately sweet." },
        { name: "Pineapple",      collection: "Classic Fruit", price: 500, image: IMG.slice,      desc: "Light vanilla sponge with juicy pineapple and fresh cream — an evergreen crowd-pleaser." },
        { name: "Butterscotch",   collection: "Classic Fruit", price: 500, image: IMG.slice,      desc: "Golden butterscotch cream with a praline crunch running through every layer." },
        { name: "Strawberry",     collection: "Classic Fruit", price: 500, image: IMG.strawberry, desc: "Berry-kissed cream and ripe strawberry folded into pillowy sponge." },
        { name: "Mixed Fruits",   collection: "Classic Fruit", price: 650, image: IMG.berry,      desc: "A generous medley of seasonal fruit and cream — fresh, bright, and celebratory." },
        { name: "Black Forest",   collection: "Classic Fruit", price: 550, image: IMG.chocolate,  desc: "Chocolate sponge, dark cherries and whipped cream — the classic done properly.", tags: ["bestseller"] },
        { name: "White Forest",   collection: "Classic Fruit", price: 550, image: IMG.slice,      desc: "The elegant cousin — white chocolate, cream and cherry in soft vanilla sponge." },
        { name: "Blueberry",      collection: "Classic Fruit", price: 700, image: IMG.berry,      desc: "Vanilla sponge swept with tangy blueberry compote and smooth cream." },

        // — Exotic —
        { name: "Chocolate",         collection: "Exotic", price: 700, image: IMG.chocolate,  desc: "Deep, fudgy and unapologetically rich — for the serious chocolate lover.", tags: ["bestseller"] },
        { name: "Cookie & Cream",    collection: "Exotic", price: 650, image: IMG.slice,      desc: "Crushed cream biscuits folded through velvety vanilla — nostalgia in every bite." },
        { name: "Red Velvet",        collection: "Exotic", price: 650, image: IMG.redvelvet,  desc: "Ruby-hued cocoa sponge with tangy cream-cheese frosting.", tags: ["signature"] },
        { name: "Lotus Biscoff",     collection: "Exotic", price: 700, image: IMG.pastry,     desc: "Caramelised Biscoff spread and crumb, layered into a warm-spiced dream.", tags: ["signature"] },
        { name: "Chocolate Nutella", collection: "Exotic", price: 700, image: IMG.chocolate,  desc: "Chocolate sponge drenched in hazelnut Nutella cream — decadence, doubled." },
        { name: "Funfetti Vanilla",  collection: "Exotic", price: 650, image: IMG.cupcakes,   desc: "Confetti-flecked vanilla sponge — a party baked right into the cake." },
        { name: "Dalgona Coffee",    collection: "Exotic", price: 650, image: IMG.slice,      desc: "Whipped dalgona coffee cream over soft sponge — a grown-up caffeine hit." },

        // — Indian touch —
        { name: "Rasmalai",   collection: "Indian Touch", price: 700, image: IMG.slice,   desc: "Saffron-cardamom cream and rasmalai soak — mithai reimagined as a cake.", tags: ["signature"] },
        { name: "Paan",       collection: "Indian Touch", price: 550, image: IMG.slice,   desc: "Cooling gulkand-and-paan cream — a refreshing after-dinner delight." },
        { name: "Gulab Jamun", collection: "Indian Touch", price: 700, image: IMG.slice,  desc: "Warm-spiced sponge crowned with syrup-soaked gulab jamun." },
      ],
    },

    {
      id: "dry-cakes",
      name: "Dry Cakes & Tea Cakes",
      kicker: "Everyday Bakes",
      blurb: "Buttery loaf-style cakes made for chai-time — no frosting, all comfort.",
      unit: "per 500g",
      note: "Priced per 500g · Sugar-free options available",
      image: IMG.bundt,
      items: [
        { name: "Vanilla",           price: 500, image: IMG.vanilla,  desc: "A plain, perfect butter tea-cake — soft crumb, gentle vanilla." },
        { name: "Funfetti",          price: 600, image: IMG.cupcakes, desc: "Buttery loaf shot through with rainbow sprinkles." },
        { name: "Butterscotch",      price: 600, image: IMG.bundt,    desc: "Caramelised butterscotch crumb with a praline crunch." },
        { name: "Rasmalai",          price: 700, image: IMG.bundt,    desc: "Saffron and cardamom baked into a tender tea-cake." },
        { name: "Fruit & Nuts",      price: 700, image: IMG.bundt,    desc: "Loaded with candied fruit and toasted nuts — rich and old-world." },
        { name: "Honey Almond",      price: 700, image: IMG.bundt,    desc: "Fragrant honey crumb topped with toasted almond flakes." },
        { name: "Rose & Pistachio",  price: 700, image: IMG.pastry,   desc: "Delicate rose and slivered pistachio — floral and nutty.", tags: ["signature"] },
        { name: "Chocolate",         price: 700, image: IMG.chocolate,desc: "Dense, cocoa-dark loaf for pure chocolate comfort." },
        { name: "Choco Chips",       price: 700, image: IMG.chocolate,desc: "Vanilla crumb studded with melting chocolate chips." },
        { name: "Mawa Cake",         price: 700, image: IMG.bundt,    desc: "The Parsi-bakery classic — rich mawa and cardamom.", tags: ["bestseller"] },
        { name: "Mint & Tutti-Frutti", price: 600, image: IMG.cupcakes, desc: "Cool mint crumb dotted with colourful tutti-frutti." },
        { name: "Marble",            price: 600, image: IMG.bundt,    desc: "Swirls of vanilla and chocolate in one handsome loaf." },
        { name: "Red Velvet",        price: 600, image: IMG.redvelvet,desc: "Cocoa-kissed red velvet in an easy everyday loaf." },
      ],
    },

    {
      id: "cheesecakes",
      name: "Cheesecakes",
      kicker: "The Cheesecake Bar",
      blurb: "Slow-set, ultra-creamy cheesecakes — our most-requested indulgence.",
      unit: "per 500g",
      note: "Priced per 500g · Please order at least 3 days prior",
      image: IMG.cheesecake,
      items: [
        { name: "New York",        price: 1000, image: IMG.cheesecake, desc: "The benchmark — dense, tangy and impossibly smooth on a buttery base.", tags: ["bestseller"] },
        { name: "Fig & Mawa",      price: 1200, image: IMG.cheesecake, desc: "Rich mawa cheesecake with jammy fig — luxurious and Indian at heart." },
        { name: "Rasmalai",        price: 1200, image: IMG.cheesecake, desc: "Saffron-cardamom cheesecake with a rasmalai soul.", tags: ["signature"] },
        { name: "Lotus Biscoff",   price: 1200, image: IMG.pastry,     desc: "Caramel-spiced Biscoff swirl over a cookie crumb base." },
        { name: "Caramel Popcorn", price: 1200, image: IMG.cheesecake, desc: "Salted caramel cheesecake crowned with buttery popcorn." },
        { name: "Blueberry",       price: 1200, image: IMG.berry,      desc: "Tangy blueberry compote rippled through silky cheese." },
        { name: "Strawberry",      price: 1000, image: IMG.strawberry, desc: "Fresh strawberry glaze over classic creamy cheesecake." },
        { name: "Chocolate",       price: 1200, image: IMG.chocolate,  desc: "Dark-chocolate cheesecake — dense, glossy, decadent." },
        { name: "Espresso",        price: 1200, image: IMG.cheesecake, desc: "A deep coffee hit set into velvety cheesecake." },
        { name: "Oreo",            price: 1000, image: IMG.cheesecake, desc: "Cookies-and-cream cheesecake for the young at heart." },
        { name: "Gulab Jamun",     price: 1200, image: IMG.cheesecake, desc: "Syrup-soaked gulab jamun folded into creamy cheese." },
        { name: "Kunafa",          price: 1400, image: IMG.pastry,     desc: "Crisp golden kunafa over rich cheesecake — a Middle-Eastern showstopper.", tags: ["signature"] },
        { name: "Mango",           price: 1200, image: IMG.tart,       desc: "Sunny Alphonso mango cheesecake — pure summer.", tags: ["seasonal"] },
        { name: "Mint",            price: 1000, image: IMG.cheesecake, desc: "Cool, fresh mint set into a smooth, light cheesecake." },
        { name: "Burnt Basque",    price: 1500, image: IMG.cheesecake, desc: "The caramelised, custardy Basque cheesecake — deeply toasted top, molten centre.", tags: ["signature"] },
      ],
    },

    {
      id: "brownies-truffle",
      name: "Brownies & Truffle",
      kicker: "For the Chocoholics",
      blurb: "Fudgy, gooey and gloriously over the top.",
      image: IMG.brownie,
      items: [
        { name: "Fudge Brownies",        price: 600,  unit: "per 1 lb (≈450g)", image: IMG.brownie,   desc: "Dense, gooey and crackle-topped — the ultimate fudge brownie.", tags: ["bestseller"] },
        { name: "Chocolate Truffle Cake", price: 1000, unit: "per 1 lb (≈450g)", image: IMG.chocolate, desc: "Layers of chocolate sponge and silky truffle ganache — celebration-grade.", tags: ["signature"] },
      ],
    },

    {
      id: "doughnuts-rolls",
      name: "Doughnuts, Bombolonis & Rolls",
      kicker: "Boxed to Share",
      blurb: "Pillowy fried doughnuts, cream-filled bombolonis and sticky cinnamon rolls — sold by the box.",
      image: IMG.doughnuts,
      items: [
        { name: "Doughnuts / Bombolonis", image: IMG.doughnuts,  desc: "Soft, fluffy and filled — glazed doughnuts and cream-stuffed bombolonis.", tags: ["bestseller"],
          price: [ { label: "Box of 2", value: 150 }, { label: "Box of 4", value: 250 }, { label: "Box of 6", value: 400 } ] },
        { name: "Honey Cinnamon Rolls", image: IMG.cinnamon, desc: "Warm, gooey swirls of cinnamon finished with a honey glaze.",
          price: [ { label: "Box of 3", value: 300 }, { label: "Box of 6", value: 500 } ] },
      ],
    },

    {
      id: "cookies",
      name: "Cookies",
      kicker: "The Cookie Jar",
      blurb: "Baked in small batches — buttery, crumbly and dangerously moreish.",
      unit: "per 250g",
      note: "Priced per 250g · Sugar-free options available",
      image: IMG.cookies,
      items: [
        { name: "Nankhatai",         price: 200, image: IMG.cookies, desc: "The melt-in-the-mouth Indian shortbread — ghee-rich and cardamom-scented." },
        { name: "Choco Chip",        price: 300, image: IMG.cookies, desc: "The forever favourite — buttery cookie loaded with chocolate.", tags: ["bestseller"] },
        { name: "Kesar Pista",       price: 350, image: IMG.cookies, desc: "Saffron and pistachio shortbread — festive and fragrant." },
        { name: "Rose Pistachio",    price: 350, image: IMG.cookies, desc: "Delicate rose crumb studded with pistachio." },
        { name: "Watermelon",        price: 250, image: IMG.cookies, desc: "Playful pink-and-green cookies with a fruity twist." },
        { name: "Namkeen",           price: 200, image: IMG.cookies, desc: "Savoury-spiced tea-time cookies for the not-so-sweet." },
        { name: "Red Velvet",        price: 250, image: IMG.redvelvet, desc: "Cocoa-red cookies with white-chocolate chunks." },
        { name: "Oats & Dry Fruits", price: 300, image: IMG.cookies, desc: "Wholesome oat cookie packed with nuts and raisins." },
        { name: "Coconut",           price: 200, image: IMG.cookies, desc: "Toasted coconut macaroon-style crumb." },
        { name: "Raagi",             price: 260, image: IMG.cookies, desc: "Nutty finger-millet cookie — the guilt-free treat." },
        { name: "Granola",           price: 300, image: IMG.cookies, desc: "Crunchy granola-clustered cookie, seeds and all." },
        { name: "Lime Coconut",      price: 200, image: IMG.cookies, desc: "Zesty lime meets toasted coconut." },
        { name: "Oatmeal Choco Chip", price: 250, image: IMG.cookies, desc: "Chewy oatmeal cookie with melting chocolate." },
        { name: "Multigrain",        price: 250, image: IMG.cookies, desc: "Hearty multigrain cookie — wholesome and crunchy." },
        { name: "Chocolate",         price: 300, image: IMG.chocolate, desc: "Double-chocolate cookie, crisp edge and fudgy middle." },
        { name: "Peanut Butter",     price: 250, image: IMG.cookies, desc: "Rich, nutty peanut-butter cookie with a soft bite." },
        { name: "Good Day Style",    price: 200, image: IMG.cookies, desc: "The nostalgic buttery biscuit — homemade." },
        { name: "Jam Filled",        price: 200, image: IMG.cookies, desc: "Buttery thumbprint cookies with a jewel of fruit jam." },
      ],
    },

    {
      id: "specials",
      name: "Signatures & Seasonal",
      kicker: "Chef's Specials",
      blurb: "Small-batch stars, festive bakes and only-in-season treasures.",
      image: IMG.tart,
      items: [
        { name: "Mango Cake",        price: 600, image: IMG.tart,    desc: "Fresh mango and cream on soft sponge — only while mangoes are at their best.", tags: ["seasonal"] },
        { name: "Mava Malai Cake",   price: 800, image: IMG.bundt,   desc: "Ultra-rich mava-malai cake — dense, creamy and indulgent.", tags: ["signature"] },
        { name: "Almond Caramel Cake", price: 800, image: IMG.pastry, desc: "Toasted almond sponge under a glossy caramel veil." },
        { name: "Sandwich Cake",     price: 500, unit: "per 1 lb (≈450g)", image: IMG.slice, desc: "A layered cream sandwich cake — light, pretty and party-ready." },
        { name: "Banto Cakes",       price: 300, unit: "starting from", image: IMG.cupcakes, desc: "Adorable mini bento-style cakes for one — hand-decorated on request.", tags: ["new"] },
        { name: "Bundt Cake",        price: 700, image: IMG.bundt,   desc: "A beautifully sculpted ring cake with a tender, buttery crumb." },
        { name: "Vrat / Fasting Cakes", price: 700, image: IMG.vanilla, desc: "Faral-friendly cakes made with permitted flours for fasting days." },
        { name: "Muffins",           price: 50,  unit: "each", image: IMG.muffins,  desc: "Bakery-style domed muffins — grab-and-go goodness." },
        { name: "Cupcakes",          price: 50,  unit: "each", image: IMG.cupcakes, desc: "Swirled, sprinkled and frosted by hand." },
      ],
    },

    {
      id: "mava",
      name: "Mava Pizza",
      kicker: "A House Curiosity",
      blurb: "Our sweet mava 'pizza' — a rich, shareable indulgence you won't find just anywhere.",
      image: IMG.tart,
      items: [
        { name: "Mava Pizza", image: IMG.tart, desc: "A decadent sweet 'pizza' base loaded with rich mava — sliced and shared.", tags: ["signature"],
          price: [ { label: '6"', value: 300 }, { label: '8"', value: 500 } ] },
      ],
    },

    {
      id: "breads",
      name: "Artisan Breads",
      kicker: "The Bakery Counter",
      blurb: "Slow-fermented, baked fresh each morning — real bread, nothing added.",
      image: IMG.bread,
      items: [
        { name: "Sandwich Bread",  image: IMG.bread, desc: "Soft everyday white loaf — perfect for toast and tiffin.",
          price: [ { label: "200g", value: 50 }, { label: "300g", value: 65 } ] },
        { name: "Multigrain Bread", image: IMG.bread, desc: "Hearty loaf packed with grains and seeds.", tags: ["bestseller"],
          price: [ { label: "200g", value: 70 }, { label: "300g", value: 90 } ] },
        { name: "Wheat Bread", image: IMG.bread, desc: "Wholesome 100% wheat loaf, soft-crumbed and light.",
          price: [ { label: "200g", value: 50 }, { label: "300g", value: 60 } ] },
        { name: "Suji Bread", image: IMG.bread, desc: "Semolina loaf with a lovely golden crust and tender bite.",
          price: [ { label: "200g", value: 70 }, { label: "300g", value: 90 } ] },
        { name: "Focaccia", price: 180, unit: "loaf · 400g", image: IMG.bread, desc: "Dimpled Italian flatbread, olive-oil rich and rosemary-scented.", tags: ["signature"] },
        { name: "Ciabatta", price: 170, unit: "loaf · 350g", image: IMG.bread, desc: "Rustic, airy Italian loaf with a crackling crust." },
      ],
    },

    {
      id: "buns-pav",
      name: "Buns & Pav",
      kicker: "The Bakery Counter",
      blurb: "Soft, fresh and made for burgers, vada-pav and everything in between.",
      image: IMG.croissant,
      items: [
        { name: "Burger Buns (White)", price: 60, unit: "2 pieces", image: IMG.bread, desc: "Soft, glossy white burger buns — pillowy and sturdy." },
        { name: "Burger Buns (Atta)",  price: 70, unit: "2 pieces", image: IMG.bread, desc: "Wholewheat burger buns for a wholesome bite." },
        { name: "Laadi Pav",           price: 60, unit: "6 pieces", image: IMG.bread, desc: "Classic soft ladi-pav — for vada-pav, pav-bhaji and misal.", tags: ["bestseller"] },
      ],
    },

  ],
};
