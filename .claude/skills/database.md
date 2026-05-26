# Database Work

When asked to create or modify database code in this project:

## Rules
- Use better-sqlite3 directly (no ORM) — import from `server/src/database/connection.js`
- Call `getDb()` to get the singleton instance
- All SQL uses parameterized queries with `?` placeholders — NEVER string interpolation
- Migrations go in `server/src/database/migrations.ts` using `CREATE TABLE IF NOT EXISTS`
- The DB file lives at `server/data/cargo-tracker.db`
- WAL mode and busy_timeout are set by `initDb()`

## Patterns

```ts
// Query
const db = getDb();
const rows = db.prepare('SELECT * FROM table WHERE id = ?').all(id);

// Insert
const result = db.prepare('INSERT INTO table (col1, col2) VALUES (?, ?)').run(val1, val2);
const newId = result.lastInsertRowid;

// Update
db.prepare('UPDATE table SET col = ? WHERE id = ?').run(val, id);

// Transaction
const insertMany = db.transaction((items: Item[]) => {
  for (const item of items) {
    db.prepare('INSERT ...').run(...);
  }
});
insertMany(items);
```

## Tables
- `auth_credentials` — 95306 auth tokens
- `search_queries` — query history
- `trajectory_cache` — 24h trajectory cache
- `tracked_box_numbers` — tracked box numbers (soft delete with is_active)
