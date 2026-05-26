# API Development

When asked to create or modify Express API routes or services:

## Rules
- Routes in `server/src/routes/*.ts`, services in `server/src/services/*.ts`
- Use Zod for request validation: `z.object({...}).safeParse(req.body)`
- All async route handlers MUST have try/catch → `next(err)`
- Errors use `AppError` class from `server/src/middleware/errorHandler.js`
- 95306 API calls go through `create95306Client()` which injects auth headers
- Use `retry()` from `server/src/utils/retry.js` for external API calls

## Route Pattern
```ts
import { Router } from 'express';
import { z } from 'zod';

export const myRouter = Router();

const schema = z.object({
  field: z.string().min(1),
});

myRouter.post('/endpoint', async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors[0].message });
      return;
    }
    const result = await myService(parsed.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
```

## Service Pattern
```ts
import { getDb } from '../database/connection.js';
import { AppError } from '../middleware/errorHandler.js';

export async function myService(input: string): Promise<Result> {
  // business logic
  const db = getDb();
  // ...
}
```

## API Routes
- `POST /api/auth/credentials` — save 95306 cookie
- `GET /api/auth/status` — auth status
- `POST /api/cargo/track` — search by box number
- `GET /api/cargo/trajectory/:ydid` — trajectory lookup
- `GET /api/cargo/history` — paginated history
- `DELETE /api/cargo/history/:id` — delete history
- `GET/POST /api/box-numbers` — list/add box numbers
- `PUT/DELETE /api/box-numbers/:id` — update/soft-delete
- `POST /api/box-numbers/:id/refresh` — refresh single
- `POST /api/box-numbers/refresh-all` — refresh all
