import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Role-based route access configuration
const roleAccess = {
  '/admin': ['admin'],
  '/tenant': ['tenant', 'admin'],
  '/owner': ['owner', 'admin'],
  '/broker': ['broker', 'admin'],
  '/runner': ['runner', 'admin'],
  '/support': ['support', 'admin'],
};

// Static assets that should not be processed by middleware
const staticAssets = [
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
  '/public/',
  '/images/',
  '/assets/'
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static assets
  if (staticAssets.some(asset => pathname.startsWith(asset))) {
    return NextResponse.next();
  }

  // Obtener token de la cookie
  const token = request.cookies.get('auth-token')?.value;
  const refreshToken = request.cookies.get('refresh-token')?.value;

  // Rutas que no requieren autenticación
  const publicPaths = [
    '/',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/logout',
    '/api/auth/refresh',
    '/api/health',
    '/auth/login',
    '/auth/register',
    '/properties/search',
    '/about',
    '/contact',
  ];

  // Verificar si la ruta actual es pública
  const isPublicPath = publicPaths.some(path => 
    pathname.startsWith(path)
  );

  // Si es una ruta pública, permitir acceso
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Si no hay token y la ruta no es pública, redirigir al login
  if (!token) {
    // Si hay refresh token, intentar renovar automáticamente
    if (refreshToken && pathname.startsWith('/api/')) {
      // Para rutas API, devolver error 401 para que el cliente maneje la renovación
      return NextResponse.json(
        { error: 'Token expirado', code: 'TOKEN_EXPIRED' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Asegurarse de que el token tenga la información necesaria
    if (!decoded.id || !decoded.role || !decoded.email) {
      throw new Error('Invalid token structure');
    }
    
    // Verificar acceso basado en rol
    const userRole = decoded.role.toLowerCase();
    
    // Buscar si la ruta requiere un rol específico
    for (const [routePrefix, allowedRoles] of Object.entries(roleAccess)) {
      if (pathname.startsWith(routePrefix)) {
        if (!allowedRoles.includes(userRole)) {
          // Si no tiene permiso, redirigir al dashboard correspondiente
          const dashboardUrl = getDashboardUrl(userRole);
          return NextResponse.redirect(new URL(dashboardUrl, request.url));
        }
        break;
      }
    }
    
    // Agregar información del usuario a los headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', decoded.id);
    requestHeaders.set('user-role', decoded.role);
    requestHeaders.set('user-email', decoded.email);

    // Continuar con la solicitud
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token inválido o expirado
    if (refreshToken && !pathname.startsWith('/api/')) {
      // Para rutas de página, intentar renovar el token automáticamente
      return NextResponse.redirect(new URL('/api/auth/refresh', request.url));
    }
    
    console.error('Middleware error:', error);
    
    // Token inválido o expirado, redirigir al login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    
    // Clear the invalid token cookies
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    
    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    
    return response;
  }
}

// Función para obtener la URL del dashboard según el rol
function getDashboardUrl(role: string): string {
  switch (role.toLowerCase()) {
    case 'admin':
      return '/admin/dashboard';
    case 'tenant':
      return '/tenant/dashboard';
    case 'owner':
      return '/owner/dashboard';
    case 'broker':
      return '/broker/dashboard';
    case 'runner':
      return '/runner/dashboard';
    case 'support':
      return '/support/dashboard';
    default:
      return '/';
  }
}

// Configurar el middleware para que se ejecute en rutas específicas
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};