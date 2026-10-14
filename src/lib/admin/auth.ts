'use server';

import { cookies } from 'next/headers';
import { timingSafeEqual } from 'crypto';
import { signSession, validateSession, SESSION_MAX_AGE } from './session';

const COOKIE_NAME = 'admin_session';

function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

export async function verifyPassword(input: string): Promise<boolean> {
  const password = getAdminPassword();
  if (!password) return false;

  try {
    const inputBuffer = Buffer.from(input);
    const passwordBuffer = Buffer.from(password);

    if (inputBuffer.length !== passwordBuffer.length) {
      // Prevent timing attacks by comparing against a dummy buffer of the same length
      timingSafeEqual(inputBuffer, Buffer.alloc(inputBuffer.length));
      return false;
    }

    return timingSafeEqual(inputBuffer, passwordBuffer);
  } catch {
    return false;
  }
}

export async function createSession(input: string): Promise<void> {
  if (!(await verifyPassword(input))) throw new Error('Unauthorized');
  const token = signSession(getAdminPassword()!);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  const password = getAdminPassword();
  return Boolean(password && session?.value && validateSession(session.value, password));
}

export async function checkAdminEnabled(): Promise<boolean> {
  return Boolean(getAdminPassword());
}
