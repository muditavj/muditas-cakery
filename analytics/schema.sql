-- Mudita's Cakery — analytics store (Cloudflare D1)
-- Apply with:  npx wrangler d1 execute cakery-analytics --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS visitors (
  vid        TEXT PRIMARY KEY,
  first_seen INTEGER NOT NULL,
  last_seen  INTEGER NOT NULL,
  hits       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS events (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      INTEGER NOT NULL,   -- epoch ms, server clock
  day     TEXT    NOT NULL,   -- YYYY-MM-DD in IST
  hour    INTEGER NOT NULL,   -- 0-23 IST
  dow     INTEGER NOT NULL,   -- 0=Sun, IST
  type    TEXT    NOT NULL,   -- view | order_click | search | tel | instagram | dwell
  path    TEXT,               -- hash route, e.g. #item/truffle-cake
  label   TEXT,               -- item slug, category id, or search term
  num     INTEGER,            -- search result count, or seconds spent for 'dwell'
  vid     TEXT    NOT NULL,
  is_new  INTEGER NOT NULL DEFAULT 0,  -- 1 when this vid was seen for the first time
  ref     TEXT,               -- referring hostname, '' for direct
  device  TEXT,               -- mobile | tablet | desktop
  city    TEXT,
  country TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_ts    ON events(ts);
CREATE INDEX IF NOT EXISTS idx_events_day   ON events(day);
CREATE INDEX IF NOT EXISTS idx_events_type  ON events(type, day);
CREATE INDEX IF NOT EXISTS idx_events_label ON events(type, label);
