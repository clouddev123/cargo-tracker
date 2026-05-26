import { Router } from 'express';
import { z } from 'zod';
import { queryByBoxNumber } from '../services/cargo.service.js';
import { getTrajectory } from '../services/trajectory.service.js';

export const cargoRouter = Router();

const trackSchema = z.object({
  boxNumber: z.string().min(3, 'boxNumber must be at least 3 characters'),
});

cargoRouter.post('/track', async (req, res, next) => {
  try {
    const parsed = trackSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const result = await queryByBoxNumber(parsed.data.boxNumber);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

cargoRouter.get('/trajectory/:ydid', async (req, res, next) => {
  try {
    const { ydid } = req.params;
    if (!ydid || ydid.length < 5) {
      res.status(400).json({ error: 'Invalid ydid' });
      return;
    }
    const result = await getTrajectory(ydid);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
