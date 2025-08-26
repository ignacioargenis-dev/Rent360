import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { z } from 'zod';
import { generateTokens, setAuthCookies, verifyPassword } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando proceso de login...');
    const data = await request.json();
    console.log('Datos recibidos:', { email: data.email, password: '***' });

    // Validar los datos de entrada
    const validatedData = loginSchema.parse(data);
    console.log('Datos validados exitosamente');

    const { email, password } = validatedData;

    console.log('Buscando usuario con Prisma...');
    
    // Usar Prisma para buscar usuario
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        isActive: true,
        avatar: true,
      },
    });
    
    console.log('Usuario encontrado:', user ? 'Sí' : 'No');

    if (!user) {
      console.log('Usuario no encontrado');
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('Verificando si usuario está activo...');
    // Verificar si el usuario está activo
    if (!user.isActive) {
      console.log('Usuario inactivo');
      return NextResponse.json(
        { error: 'Tu cuenta ha sido desactivada' },
        { status: 403 }
      );
    }

    console.log('Verificando contraseña...');
    // Verificar contraseña
    const isPasswordValid = await verifyPassword(password, user.password);
    console.log('Contraseña válida:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Contraseña inválida');
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    console.log('Determinando rol del usuario...');
    // Determinar el rol del usuario
    let role = user.role.toLowerCase();

    console.log('Generando tokens...');
    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.email,
      role,
      user.name
    );

    console.log('Creando respuesta...');
    // Crear respuesta con cookies
    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role,
        avatar: user.avatar,
      },
    });

    console.log('Estableciendo cookies...');
    // Establecer cookies HTTP-only
    setAuthCookies(response, accessToken, refreshToken);

    console.log('Login completado exitosamente');
    return response;
  } catch (error) {
    console.error('Error en login:', error);
    
    // Manejar errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    // Manejar otros errores
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}