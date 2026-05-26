import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PORT = parseInt(process.env.PORT || '3001', 10);
export const DB_PATH = path.join(__dirname, '..', 'data', 'cargo-tracker.db');
export const API95306_BASE = 'https://ec.95306.cn';
