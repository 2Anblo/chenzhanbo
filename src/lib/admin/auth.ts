'use server';

import { cookies } from 'next/headers';
import { randomBytes, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';
const SESSION_BYTES = 32;

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

export async function createSession(): Promise<void> {
  const token = randomBytes(SESSION_BYTES).toString('hex');
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8 hours
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
  return Boolean(session?.value) && session!.value.length === SESSION_BYTES * 2;
}

export async function checkAdminEnabled(): Promise<boolean> {
  return Boolean(getAdminPassword());
}
