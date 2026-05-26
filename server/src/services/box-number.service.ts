import { getDb } from '../database/connection.js';
import { queryByBoxNumber } from './cargo.service.js';

export interface TrackedBoxNumber {
  id: number;
  box_number: string;
  label: string | null;
  shipping_ydid: string | null;
  receiving_ydid: string | null;
  latest_status: string | null;
  last_queried_at: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export function listAll(): TrackedBoxNumber[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM tracked_box_numbers WHERE is_active = 1 ORDER BY updated_at DESC')
    .all() as TrackedBoxNumber[];
}

export function addBoxNumber(boxNumber: string, label?: string): TrackedBoxNumber {
  const db = getDb();
  const existing = db
    .prepare('SELECT id FROM tracked_box_numbers WHERE box_number = ?')
    .get(boxNumber) as { id: number } | undefined;
  if (existing) {
    // Reactivate if previously deleted
    db.prepare('UPDATE tracked_box_numbers SET is_active = 1, label = COALESCE(?, label), updated_at = datetime(\'now\') WHERE id = ?')
      .run(label || null, existing.id);
    return db.prepare('SELECT * FROM tracked_box_numbers WHERE id = ?').get(existing.id) as TrackedBoxNumber;
  }
  db.prepare(
    'INSERT INTO tracked_box_numbers (box_number, label) VALUES (?, ?)',
  ).run(boxNumber, label || null);
  return db
    .prepare('SELECT * FROM tracked_box_numbers WHERE box_number = ?')
    .get(boxNumber) as TrackedBoxNumber;
}

export function updateBoxNumber(id: number, boxNumber?: string, label?: string): TrackedBoxNumber | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM tracked_box_numbers WHERE id = ?').get(id) as TrackedBoxNumber | undefined;
  if (!row) return null;

  const updates: string[] = ['updated_at = datetime(\'now\')'];
  const params: (string | number)[] = [];

  if (boxNumber !== undefined) {
    updates.push('box_number = ?');
    params.push(boxNumber);
  }
  if (label !== undefined) {
    updates.push('label = ?');
    params.push(label);
  }

  if (params.length > 0) {
    params.push(id);
    db.prepare(`UPDATE tracked_box_numbers SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }

  return db.prepare('SELECT * FROM tracked_box_numbers WHERE id = ?').get(id) as TrackedBoxNumber;
}

export function removeBoxNumber(id: number): boolean {
  const db = getDb();
  const result = db.prepare('UPDATE tracked_box_numbers SET is_active = 0 WHERE id = ?').run(id);
  return result.changes > 0;
}

export async function refreshBoxNumber(id: number): Promise<TrackedBoxNumber | null> {
  const db = getDb();
  const row = db.prepare('SELECT * FROM tracked_box_numbers WHERE id = ?').get(id) as TrackedBoxNumber | undefined;
  if (!row) return null;

  try {
    const result = await queryByBoxNumber(row.box_number);
    const shipping = result.shipping[0] || null;
    const receiving = result.receiving[0] || null;

    db.prepare(
      `UPDATE tracked_box_numbers
       SET shipping_ydid = ?, receiving_ydid = ?, latest_status = ?,
           last_queried_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?`,
    ).run(
      shipping?.ydid || null,
      receiving?.ydid || null,
      shipping?.ztgjjc || receiving?.ztgjjc || null,
      id,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[BoxNumber] Refresh failed for ${row.box_number}: ${message}`);
    db.prepare(
      `UPDATE tracked_box_numbers SET last_queried_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
    ).run(id);
  }

  return db.prepare('SELECT * FROM tracked_box_numbers WHERE id = ?').get(id) as TrackedBoxNumber;
}

export async function refreshAll(): Promise<TrackedBoxNumber[]> {
  const all = listAll();
  const results: TrackedBoxNumber[] = [];
  for (const item of all) {
    const updated = await refreshBoxNumber(item.id);
    if (updated) results.push(updated);
  }
  return results;
}
