import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const SESSION_MAX_AGE = 8 * 60 * 60;

export function signSession(password: string, now = Date.now()): string {
  const payload = `${randomBytes(32).toString('hex')}.${Math.floor(now / 1000) + SESSION_MAX_AGE}`;
  const signature = createHmac('sha256', password).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function validateSession(token: string, password: string, now = Date.now()): boolean {
  const match = /^([a-f0-9]{64})\.(\d{10})\.([a-f0-9]{64})$/.exec(token);
  if (!match || Number(match[2]) <= Math.floor(now / 1000)) return false;
  const expected = createHmac('sha256', password).update(`${match[1]}.${match[2]}`).digest();
  return timingSafeEqual(expected, Buffer.from(match[3], 'hex'));
}
