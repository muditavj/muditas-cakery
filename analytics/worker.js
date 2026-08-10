/**
 * Mudita's Cakery — analytics collector + read API.
 *
 *   POST /e       collect one event. Public, called by js/track.js.
 *   GET  /stats   aggregated dashboard payload. Needs the X-Cakery-Key header.
 *
 * Days and hours are bucketed in IST (fixed +05:30, no DST) so "today" means
 * today in Nayapura rather than in UTC.
 */

const IST_OFFSET = 330 * 60 * 1000;
const TYPES = ["view", "order_click", "search", "tel", "instagram", "dwell"];
const RETAIN_DAYS = 400;

function istParts(ts) {
  const d = new Date(ts + IST_OFFSET);
  return { day: d.toISOString().slice(0, 10), hour: d.getUTCHours(), dow: d.getUTCDay() };
}

/** YYYY-MM-DD of the IST day `back` days before `ts`. */
function istDay(ts, back = 0) {
  return new Date(ts + IST_OFFSET - back * 86400000).toISOString().slice(0, 10);
}

function cors(origin, allowed) {
  const ok = allowed.includes(origin) ? origin : allowed[0];
  return {
    "Access-Control-Allow-Origin": ok,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-Cakery-Key",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, headers, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

const clip = (v, n) => (v == null ? null : String(v).slice(0, n));

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const allowed = (env.ALLOWED_ORIGINS || "*").split(",").map((s) => s.trim());
    const head = cors(request.headers.get("Origin") || "", allowed);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: head });
    if (url.pathname === "/e" && request.method === "POST") return collect(request, env, ctx, head);
    if (url.pathname === "/stats" && request.method === "GET") return stats(request, env, head);
    return new Response("Not found", { status: 404, headers: head });
  },

  /** Nightly prune so the table can't grow without bound. */
  async scheduled(event, env) {
    await env.DB.prepare("DELETE FROM events WHERE day < ?")
      .bind(istDay(Date.now(), RETAIN_DAYS))
      .run();
  },
};

async function collect(request, env, ctx, head) {
  // sendBeacon posts text/plain, which keeps this a simple request (no preflight).
  let b;
  try {
    b = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 204, headers: head });
  }

  const type = TYPES.includes(b.t) ? b.t : null;
  const vid = clip(b.v, 64);
  if (!type || !vid) return new Response(null, { status: 204, headers: head });

  const ua = request.headers.get("User-Agent") || "";
  if (/bot|crawler|spider|slurp|preview|headless|lighthouse|monitor/i.test(ua)) {
    return new Response(null, { status: 204, headers: head });
  }

  const ts = Date.now();
  const { day, hour, dow } = istParts(ts);
  const cf = request.cf || {};

  // First sighting of this visitor id decides new-vs-returning, server side.
  const seen = await env.DB.prepare("SELECT vid FROM visitors WHERE vid = ?").bind(vid).first();
  const isNew = seen ? 0 : 1;

  const writes = [
    env.DB.prepare(
      `INSERT INTO visitors (vid, first_seen, last_seen, hits) VALUES (?, ?, ?, 1)
       ON CONFLICT(vid) DO UPDATE SET last_seen = excluded.last_seen, hits = hits + 1`
    ).bind(vid, ts, ts),
    env.DB.prepare(
      `INSERT INTO events (ts, day, hour, dow, type, path, label, num, vid, is_new, ref, device, city, country)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      ts, day, hour, dow, type,
      clip(b.p, 160), clip(b.l, 80),
      typeof b.n === "number" ? b.n : null,
      vid, isNew,
      clip(b.r, 80) || "",
      clip(b.d, 12),
      clip(cf.city, 60), clip(cf.country, 4)
    ),
  ];

  ctx.waitUntil(env.DB.batch(writes));
  return new Response(null, { status: 204, headers: head });
}

async function stats(request, env, head) {
  if (!env.STATS_KEY || request.headers.get("X-Cakery-Key") !== env.STATS_KEY) {
    return json({ error: "unauthorized" }, head, 401);
  }

  const now = Date.now();
  const today = istDay(now);
  const yday = istDay(now, 1);
  const d30 = istDay(now, 29);
  const since60m = now - 60 * 60000;
  const since30m = now - 30 * 60000;
  const since24h = now - 24 * 3600000;

  const q = (sql, ...binds) => env.DB.prepare(sql).bind(...binds);

  const rows = await env.DB.batch([
    // 0 — today / yesterday headline numbers
    q(`SELECT day,
              SUM(type='view') AS opens,
              COUNT(DISTINCT vid) AS uniques,
              COUNT(DISTINCT CASE WHEN is_new=1 THEN vid END) AS news,
              SUM(type='order_click') AS orders
       FROM events WHERE day IN (?,?) GROUP BY day`, today, yday),
    // 1 — per-minute, last hour
    q(`SELECT ts/60000 AS m, SUM(type='view') AS opens,
              COUNT(DISTINCT vid) AS uniques,
              COUNT(DISTINCT CASE WHEN is_new=1 THEN vid END) AS news
       FROM events WHERE ts >= ? GROUP BY m ORDER BY m`, since60m),
    // 2 — per-hour, last 24h
    q(`SELECT day, hour, SUM(type='view') AS opens, COUNT(DISTINCT vid) AS uniques,
              COUNT(DISTINCT CASE WHEN is_new=1 THEN vid END) AS news
       FROM events WHERE ts >= ? GROUP BY day, hour ORDER BY day, hour`, since24h),
    // 3 — per-day, last 30
    q(`SELECT day, SUM(type='view') AS opens, COUNT(DISTINCT vid) AS uniques,
              COUNT(DISTINCT CASE WHEN is_new=1 THEN vid END) AS news,
              SUM(type='order_click') AS orders
       FROM events WHERE day >= ? GROUP BY day ORDER BY day`, d30),
    // 4 — who's on the site right now
    q(`SELECT COUNT(DISTINCT vid) AS n FROM events WHERE ts >= ?`, since30m),
    // 5 — item interest vs order clicks
    q(`SELECT label,
              SUM(type='view' AND path LIKE '#item/%') AS views,
              SUM(type='order_click') AS orders
       FROM events
       WHERE day >= ? AND label IS NOT NULL
         AND ((type='view' AND path LIKE '#item/%') OR type='order_click')
       GROUP BY label ORDER BY views DESC, orders DESC LIMIT 30`, d30),
    // 6 — category interest
    q(`SELECT label, COUNT(*) AS views FROM events
       WHERE type='view' AND path LIKE '#cat/%' AND day >= ? AND label IS NOT NULL
       GROUP BY label ORDER BY views DESC LIMIT 20`, d30),
    // 7 — searches, with the empty-handed ones flagged
    q(`SELECT label, COUNT(*) AS n, SUM(COALESCE(num,0)=0) AS zero FROM events
       WHERE type='search' AND day >= ? AND label IS NOT NULL
       GROUP BY label ORDER BY n DESC LIMIT 40`, d30),
    // 8 — where visitors came from
    q(`SELECT CASE WHEN ref IS NULL OR ref='' THEN 'direct' ELSE ref END AS ref,
              COUNT(DISTINCT vid) AS n
       FROM events WHERE day >= ? GROUP BY ref ORDER BY n DESC LIMIT 12`, d30),
    // 9 — devices
    q(`SELECT COALESCE(device,'?') AS device, COUNT(DISTINCT vid) AS n
       FROM events WHERE day >= ? GROUP BY device ORDER BY n DESC`, d30),
    // 10 — cities
    q(`SELECT city, COUNT(DISTINCT vid) AS n FROM events
       WHERE day >= ? AND city IS NOT NULL AND city <> ''
       GROUP BY city ORDER BY n DESC LIMIT 12`, d30),
    // 11 — outbound intent clicks
    q(`SELECT type, COUNT(*) AS n FROM events
       WHERE day >= ? AND type IN ('order_click','tel','instagram') GROUP BY type`, d30),
    // 12 — busiest times, day-of-week x hour
    q(`SELECT dow, hour, COUNT(*) AS opens FROM events
       WHERE type='view' AND day >= ? GROUP BY dow, hour`, d30),
    // 13 — lifetime totals
    q(`SELECT COUNT(*) AS visitors, MIN(first_seen) AS since FROM visitors`),
    // 14 — time spent per item. Median, not mean: one phone left open all night
    //      would drag an average into nonsense.
    q(`WITH d AS (
         SELECT label, num AS s,
                ROW_NUMBER() OVER (PARTITION BY label ORDER BY num) AS rn,
                COUNT(*)     OVER (PARTITION BY label)              AS c
         FROM events
         WHERE type='dwell' AND day >= ? AND label IS NOT NULL AND num > 0
           AND path LIKE '#item/%'
       )
       SELECT label, MAX(c) AS looks,
              AVG(CASE WHEN rn IN ((c+1)/2, (c+2)/2) THEN s END) AS median_s
       FROM d GROUP BY label ORDER BY looks DESC LIMIT 30`, d30),
    // 15 — time spent per category
    q(`WITH d AS (
         SELECT label, num AS s,
                ROW_NUMBER() OVER (PARTITION BY label ORDER BY num) AS rn,
                COUNT(*)     OVER (PARTITION BY label)              AS c
         FROM events
         WHERE type='dwell' AND day >= ? AND label IS NOT NULL AND num > 0
           AND path LIKE '#cat/%'
       )
       SELECT label, MAX(c) AS looks,
              AVG(CASE WHEN rn IN ((c+1)/2, (c+2)/2) THEN s END) AS median_s
       FROM d GROUP BY label ORDER BY looks DESC LIMIT 20`, d30),
    // 16 — last screen a visitor was on before leaving, per visit-day
    q(`WITH last AS (
         SELECT path, ROW_NUMBER() OVER (PARTITION BY vid, day ORDER BY ts DESC) AS rn
         FROM events WHERE type='view' AND day >= ?
       )
       SELECT path, COUNT(*) AS n FROM last WHERE rn=1
       GROUP BY path ORDER BY n DESC LIMIT 12`, d30),
    // 17 — how many different items each visit looked at
    q(`WITH v AS (
         SELECT vid, day, COUNT(DISTINCT label) AS c FROM events
         WHERE type='view' AND path LIKE '#item/%' AND day >= ? AND label IS NOT NULL
         GROUP BY vid, day
       )
       SELECT CASE WHEN c >= 5 THEN 5 ELSE c END AS bucket, COUNT(*) AS n,
              (SELECT AVG(c) FROM v) AS avg_items
       FROM v GROUP BY bucket ORDER BY bucket`, d30),
    // 18 — order clicks by day-of-week x hour (when to be ready for messages)
    q(`SELECT dow, hour, COUNT(*) AS n FROM events
       WHERE type='order_click' AND day >= ? GROUP BY dow, hour`, d30),
    // 19 — 30-day totals behind the conversion rate
    q(`SELECT COUNT(DISTINCT vid) AS people,
              COUNT(DISTINCT CASE WHEN type='order_click' THEN vid END) AS orderers,
              SUM(type='order_click') AS order_clicks
       FROM events WHERE day >= ?`, d30),
  ]);

  const r = (i) => rows[i].results || [];
  const byDay = {};
  for (const row of r(0)) byDay[row.day] = row;
  const blank = { opens: 0, uniques: 0, news: 0, orders: 0 };
  const clicks = { order_click: 0, tel: 0, instagram: 0 };
  for (const row of r(11)) clicks[row.type] = row.n;

  return json(
    {
      generated: now,
      timezone: "Asia/Kolkata",
      live: { active30m: (r(4)[0] || {}).n || 0 },
      today: { ...blank, ...(byDay[today] || {}) },
      yesterday: { ...blank, ...(byDay[yday] || {}) },
      minutes: r(1),
      hours: r(2),
      days: r(3),
      items: r(5),
      categories: r(6),
      searches: r(7),
      sources: r(8),
      devices: r(9),
      cities: r(10),
      clicks,
      heatmap: r(12),
      lifetime: r(13)[0] || { visitors: 0, since: null },
      dwellItems: r(14),
      dwellCategories: r(15),
      exits: r(16),
      depth: { buckets: r(17), avg: (r(17)[0] || {}).avg_items || 0 },
      orderTimes: r(18),
      reach: r(19)[0] || { people: 0, orderers: 0, order_clicks: 0 },
    },
    head
  );
}
