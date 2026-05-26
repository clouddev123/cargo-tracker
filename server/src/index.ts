import { createApp } from './app.js';
import { initDb } from './database/connection.js';
import { runMigrations } from './database/migrations.js';
import { PORT } from './config.js';

const db = initDb();
runMigrations(db);

const app = createApp();

app.listen(PORT, () => {
  console.log(`[Cargo Tracker] Server running on http://localhost:${PORT}`);
});
