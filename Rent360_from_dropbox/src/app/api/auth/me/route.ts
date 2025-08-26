import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Obtener token de la cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Buscar usuario en la base de datos usando SQLite directo
    const user = await new Promise((resolve, reject) => {
      const db = new sqlite3.Database('/home/z/my-project/dev.db');
      
      db.get(
        'SELECT id, email, name, role, avatar, createdAt FROM users WHERE id = ?',
        [decoded.id],
        (err, row) => {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Determinar el rol del usuario
    let role = user.role.toLowerCase();

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { error: 'Token inválido' },
          { status: 401 }
        );
      }
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json(
          { error: 'Token expirado' },
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