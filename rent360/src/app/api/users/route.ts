import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/validations';
import { z } from 'zod';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = requireRole(request, 'admin');
    
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Construir filtro con Prisma
    const where: any = {};
    
    if (role) {
      where.role = role.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Obtener usuarios con Prisma
    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          avatar: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    if (error instanceof Error) {
      if (error.message.includes('No autorizado') || error.message.includes('Acceso denegado')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireRole(request, 'admin');
    
    const data = await request.json();
    
    // Validar los datos de entrada
    const validatedData = registerSchema.parse(data);
    
    const {
      name,
      email,
      password,
      role,
    } = validatedData;
    
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
    
    // Hash de la contraseña antes de crear el usuario
    const hashedPassword = await hashPassword(password);
    
    // Crear usuario con Prisma
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        isActive: true,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        avatar: true,
      },
    });
    
    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: newUser,
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    // Manejar errores de validación
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message.includes('No autorizado') || error.message.includes('Acceso denegado')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}