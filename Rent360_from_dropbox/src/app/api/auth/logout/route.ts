import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth';

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Logout exitoso',
    });

    // Eliminar las cookies de autenticación
    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}