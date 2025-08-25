import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import { z } from 'zod';
import { generateTokens, setAuthCookies, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validar los datos de entrada
    try {
      const validatedData = registerSchema.parse(data);
      data = validatedData;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validationError.errors },
          { status: 400 }
        );
      }
    }

    const { name, email, password, role } = data;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Roles permitidos para registro público
    const allowedPublicRoles = ['tenant', 'owner', 'broker', 'runner'];
    
    // Evitar que los usuarios se registren con roles no permitidos
    if (!allowedPublicRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Rol de usuario no permitido para registro público' },
        { status: 403 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear usuario base
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
    };

    let user = await db.user.create({
      data: userData,
    });

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.email,
      user.role.toLowerCase(),
      user.name
    );

    // Crear respuesta con cookies
    const response = NextResponse.json({
      message: 'Registro exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        avatar: user.avatar,
      },
    });

    // Establecer cookies HTTP-only
    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}