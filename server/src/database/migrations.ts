import type Database from 'better-sqlite3';

export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS auth_credentials (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      access_token  TEXT    NOT NULL,
      userid        TEXT,
      username      TEXT,
      unitid        TEXT,
      unitname      TEXT,
      bureauid      TEXT,
      bureaudm      TEXT,
      usertype      TEXT,
      is_active     INTEGER DEFAULT 1,
      created_at    TEXT    DEFAULT (datetime('now')),
      updated_at    TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS search_queries (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      box_number      TEXT    NOT NULL,
      type            TEXT    NOT NULL,
      result_data     TEXT,
      is_success      INTEGER DEFAULT 0,
      error_message   TEXT,
      response_time_ms INTEGER,
      created_at      TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS trajectory_cache (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      ydid           TEXT    NOT NULL UNIQUE,
      box_number     TEXT,
      fs_main        TEXT,
      events         TEXT,
      transit_stops  TEXT,
      full_response  TEXT,
      cached_at      TEXT    DEFAULT (datetime('now')),
      expires_at     TEXT
    );

    CREATE TABLE IF NOT EXISTS tracked_box_numbers (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      box_number    TEXT    NOT NULL UNIQUE,
      label         TEXT,
      shipping_ydid TEXT,
      receiving_ydid TEXT,
      latest_status TEXT,
      last_queried_at TEXT,
      is_active     INTEGER DEFAULT 1,
      created_at    TEXT    DEFAULT (datetime('now')),
      updated_at    TEXT    DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_search_queries_box ON search_queries(box_number);
    CREATE INDEX IF NOT EXISTS idx_trajectory_ydid ON trajectory_cache(ydid);
  `);

  console.log('[DB] Migrations complete');
}
