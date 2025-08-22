import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!JWT_REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required');
}

// Validate JWT secrets are strong enough
if (JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

if (JWT_REFRESH_SECRET.length < 32) {
  throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

export interface DecodedRefreshToken {
  id: string;
  type: 'refresh';
  iat: number;
  exp: number;
}

export function verifyToken(request: NextRequest): DecodedToken | null {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded as DecodedToken;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(request: NextRequest): DecodedRefreshToken | null {
  try {
    // Obtener refresh token de la cookie
    const refreshToken = request.cookies.get('refresh-token')?.value;
    
    if (!refreshToken) {
      return null;
    }

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as DecodedRefreshToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(request: NextRequest): DecodedToken {
  const decoded = verifyToken(request);
  
  if (!decoded) {
    throw new Error('No autorizado');
  }
  
  return decoded;
}

export function requireRole(request: NextRequest, requiredRole: string): DecodedToken {
  const decoded = requireAuth(request);
  
  if (decoded.role !== requiredRole) {
    throw new Error('Acceso denegado: rol insuficiente');
  }
  
  return decoded;
}

export function requireAnyRole(request: NextRequest, allowedRoles: string[]): DecodedToken {
  const decoded = requireAuth(request);
  
  if (!allowedRoles.includes(decoded.role)) {
    throw new Error('Acceso denegado: rol no permitido');
  }
  
  return decoded;
}

export function generateTokens(userId: string, email: string, role: string, name: string) {
  const accessToken = jwt.sign(
    { id: userId, email, role, name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: userId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
}

export function setAuthCookies(response: any, accessToken: string, refreshToken: string) {
  // Establecer cookie de acceso (HTTP-only, secure, SameSite=strict)
  response.cookies.set('auth-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hora
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
  });

  // Establecer cookie de refresh (HTTP-only, secure, SameSite=strict)
  response.cookies.set('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 días
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
  });
}

export function clearAuthCookies(response: any) {
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
  });

  response.cookies.set('refresh-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
  });
}