import { getDb } from '../database/connection.js';
import type { UserdoPayload } from '../types/cargo.types.js';

interface AuthCredentials {
  id: number;
  access_token: string;
  userid: string;
  username: string;
  unitid: string;
  unitname: string;
  bureauid: string;
  bureaudm: string;
  usertype: string;
}

let cached: AuthCredentials | null = null;

export function getActiveCredentials(): AuthCredentials | null {
  if (cached) return cached;
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM auth_credentials WHERE is_active = 1 ORDER BY updated_at DESC LIMIT 1')
    .get() as AuthCredentials | undefined;
  if (row) cached = row;
  return row || null;
}

export function saveCredentials(accessToken: string, userdo: UserdoPayload): AuthCredentials {
  const db = getDb();
  db.prepare('UPDATE auth_credentials SET is_active = 0 WHERE is_active = 1').run();
  const stmt = db.prepare(`
    INSERT INTO auth_credentials (access_token, userid, username, unitid, unitname, bureauid, bureaudm, usertype)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const username = encodeURIComponent(userdo.userName);
  const unitname = encodeURIComponent(userdo.unitName);
  const result = stmt.run(
    accessToken,
    userdo.userId,
    username,
    userdo.unitId,
    unitname,
    userdo.bureauId,
    userdo.bureauDm,
    userdo.userType,
  );
  cached = {
    id: Number(result.lastInsertRowid),
    access_token: accessToken,
    userid: userdo.userId,
    username,
    unitid: userdo.unitId,
    unitname,
    bureauid: userdo.bureauId,
    bureaudm: userdo.bureauDm,
    usertype: userdo.userType,
  };
  return cached;
}

export function invalidateCredentials(): void {
  const db = getDb();
  db.prepare('UPDATE auth_credentials SET is_active = 0 WHERE is_active = 1').run();
  cached = null;
}

export function getAuthStatus(): { hasCredentials: boolean; username?: string; unitname?: string } {
  const creds = getActiveCredentials();
  if (!creds) return { hasCredentials: false };
  return {
    hasCredentials: true,
    username: decodeURIComponent(creds.username),
    unitname: decodeURIComponent(creds.unitname),
  };
}
