import { Router } from 'express';
import { z } from 'zod';
import * as svc from '../services/box-number.service.js';

export const boxNumbersRouter = Router();

boxNumbersRouter.get('/', (_req, res) => {
  const list = svc.listAll();
  res.json(list);
});

const addSchema = z.object({
  boxNumber: z.string().min(3),
  label: z.string().optional(),
});

boxNumbersRouter.post('/', (req, res) => {
  const parsed = addSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }
  const result = svc.addBoxNumber(parsed.data.boxNumber, parsed.data.label);
  res.json(result);
});

const updateSchema = z.object({
  boxNumber: z.string().min(3).optional(),
  label: z.string().optional(),
});

boxNumbersRouter.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }
  const result = svc.updateBoxNumber(id, parsed.data.boxNumber, parsed.data.label);
  if (!result) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(result);
});

boxNumbersRouter.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const removed = svc.removeBoxNumber(id);
  if (!removed) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ success: true });
});

boxNumbersRouter.post('/:id/refresh', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    const result = await svc.refreshBoxNumber(id);
    if (!result) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

boxNumbersRouter.post('/refresh-all', async (_req, res, next) => {
  try {
    const results = await svc.refreshAll();
    res.json({ count: results.length, list: results });
  } catch (err) {
    next(err);
  }
});
