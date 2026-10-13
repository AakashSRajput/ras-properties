import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { UserRole, UserSession } from '@/types';

const COOKIE_NAME = 'ras_auth_token';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET or AUTH_SECRET must be configured in production.');
  }
  return 'ras-properties-local-development-secret';
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: object): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '30d' });
}

export function verifyToken<T>(token: string): T | null {
  try {
    return jwt.verify(token, getJwtSecret()) as T;
  } catch {
    return null;
  }
}

export async function setAuthCookie(user: UserSession) {
  const token = signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
  });

  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return token;
}

export async function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const decoded = verifyToken<UserSession>(token);
    if (!decoded || !decoded.id) return null;

    // Optional: quick verify user is not suspended
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, phone: true, role: true, avatar: true, isSuspended: true },
    });

    if (!user || user.isSuspended) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as UserRole,
      avatar: user.avatar,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<UserSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireAdmin(): Promise<UserSession> {
  const session = await requireAuth();
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}
