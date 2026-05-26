import { createApp } from './app.js';
import { initDb } from './database/connection.js';
import { runMigrations } from './database/migrations.js';
import { PORT, HOST } from './config.js';

const db = initDb();
runMigrations(db);

const app = createApp();

app.listen(PORT, HOST, () => {
  const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`[Cargo Tracker] Server running on http://${displayHost}:${PORT}`);
  if (HOST === '0.0.0.0') {
    console.log(`[Cargo Tracker] Accessible from any network interface on port ${PORT}`);
  }
});
