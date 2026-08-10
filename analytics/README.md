# Visitor analytics

Counts how many people open the Cakery site, and shows it in **Admin → 📊 Analytics**.

Runs on Cloudflare's free tier. No cookies, no IP addresses stored, no third‑party
trackers — just a random id in the visitor's own browser.

## What you get

- **Opens** per minute, per hour, per day (the two graphs share one switch)
- **People** — unique visitors, with first‑timers split out
- Who's on the site right now
- Most-viewed items vs. how many actually tapped Order
- What people searched for (and which searches found nothing)
- Where visitors came from, phone vs computer, city, busiest hours of the week

## One-time setup

You need a free Cloudflare account and `npx` (comes with Node.js).

```sh
cd analytics
npx wrangler login

# 1. Create the database
npx wrangler d1 create cakery-analytics
#    → copy the database_id it prints into wrangler.toml

# 2. Create the tables
npx wrangler d1 execute cakery-analytics --remote --file=schema.sql

# 3. Pick a password for reading your stats, then set it as a secret.
#    Type any long random phrase when prompted — you'll paste the same one
#    into the Admin → Analytics tab once.
npx wrangler secret put STATS_KEY

# 4. Deploy
npx wrangler deploy
#    → copy the https://cakery-analytics.<you>.workers.dev URL it prints
```

Then paste that Worker URL into **`js/analytics-config.js`**:

```js
window.CAKERY_ANALYTICS = { endpoint: "https://cakery-analytics.<you>.workers.dev" };
```

Commit and push, open Admin → 📊 Analytics, paste your `STATS_KEY` once, and the
numbers start filling in.

## Setting it up through the Cloudflare website instead

`wrangler login` needs a browser round-trip that is easy to have time out. Everything
above can be done by clicking instead, and that is how this one was actually set up:

1. **Storage & Databases → D1 SQLite Database → Create**, named `cakery-analytics`,
   then its **Console** tab to create the tables.
   The console is a *single-line* box: it strips newlines, which turns a leading
   `--` comment into a comment over the whole file and fails with "Requests without
   any query are not supported." Paste one statement at a time, without comments.
2. **Compute → Workers & Pages → Create → Start with Hello World**, named
   `cakery-analytics`, then **Edit code** and paste `worker.js` over the template.
   (Not "Workers for Platforms" — that is a paid product and not this.)
3. **Bindings** tab → **Add binding → D1 database**, variable name `DB`.
4. **Settings** tab → **Variables and secrets**: `ALLOWED_ORIGINS` as Text,
   `STATS_KEY` as **Secret**.

Check it works by opening the Worker URL — `Not found` is the healthy response for
the root path, since only `/e` and `/stats` are routed.

## Notes

- `ALLOWED_ORIGINS` in `wrangler.toml` limits who may post events. Add
  `http://localhost:8000` there while testing locally, and redeploy.
- Events older than 400 days are pruned nightly by the cron trigger.
- Bots and link-preview fetchers are filtered out on both the browser and server side.
- The admin page loads only the endpoint config, never the tracker, so your own
  editing sessions are never counted as visits.
