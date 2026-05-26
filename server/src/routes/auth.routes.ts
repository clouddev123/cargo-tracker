import { Router } from 'express';
import { z } from 'zod';
import { saveCredentials, getAuthStatus } from '../services/auth.service.js';

export const authRouter = Router();

const credentialsSchema = z.object({
  cookie: z.string().min(1, 'cookie is required'),
});

function parseCookie(cookieStr: string): { accessToken: string; userdo: string } {
  const pairs = new Map<string, string>();
  for (const part of cookieStr.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    pairs.set(key, val);
  }

  const accessToken = pairs.get('95306-1.6.10-accessToken');
  const userdo = pairs.get('95306-1.6.10-userdo');

  if (!accessToken) throw new Error('Cookie 中未找到 95306-1.6.10-accessToken');
  if (!userdo) throw new Error('Cookie 中未找到 95306-1.6.10-userdo');

  return { accessToken, userdo };
}

authRouter.post('/credentials', (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  let accessToken: string;
  let userdoRaw: string;
  try {
    const result = parseCookie(parsed.data.cookie);
    accessToken = result.accessToken;
    userdoRaw = result.userdo;
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    return;
  }

  let userdoJson;
  try {
    userdoJson = JSON.parse(decodeURIComponent(userdoRaw));
  } catch {
    res.status(400).json({ error: '95306-1.6.10-userdo 必须是有效的 JSON（URL 解码后）' });
    return;
  }

  const creds = saveCredentials(accessToken, userdoJson);
  res.json({
    success: true,
    username: decodeURIComponent(creds.username),
    unitname: decodeURIComponent(creds.unitname),
  });
});

authRouter.get('/status', (_req, res) => {
  res.json(getAuthStatus());
});
