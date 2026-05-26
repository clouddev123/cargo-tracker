import { Router } from 'express';
import { getDb } from '../database/connection.js';

export const historyRouter = Router();

historyRouter.get('/history', (req, res) => {
  const db = getDb();
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 20));
  const boxNumber = req.query.boxNumber as string | undefined;
  const offset = (page - 1) * pageSize;

  let where = '';
  const params: unknown[] = [];
  if (boxNumber) {
    where = 'WHERE box_number LIKE ?';
    params.push(`%${boxNumber}%`);
  }

  const countRow = db
    .prepare(`SELECT COUNT(*) as total FROM search_queries ${where}`)
    .get(...params) as { total: number };

  const rows = db
    .prepare(
      `SELECT * FROM search_queries ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, pageSize, offset);

  res.json({
    page,
    pageSize,
    total: countRow.total,
    list: rows,
  });
});

historyRouter.delete('/history/:id', (req, res) => {
  const db = getDb();
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const result = db.prepare('DELETE FROM search_queries WHERE id = ?').run(id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ success: true });
});
