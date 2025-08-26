import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAnyRole } from '@/lib/auth';
import { ticketSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    
    const skip = (page - 1) * limit;
    
    // Construir filtro
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Filtrar según el rol
    if (user.role !== 'admin' && user.role !== 'support') {
      where.userId = user.id;
    }
    
    // Obtener tickets
    const [tickets, total] = await Promise.all([
      db.ticket.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 5,
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      db.ticket.count({ where }),
    ]);
    
    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener tickets:', error);
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
    const user = requireAuth(request);
    
    const data = await request.json();
    
    // Validar los datos de entrada
    try {
      const validatedData = ticketSchema.parse(data);
      data = validatedData;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validationError.errors },
          { status: 400 }
        );
      }
    }
    
    const {
      title,
      description,
      priority,
      category,
    } = data;
    
    // Generar número de ticket único
    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
    
    // Crear ticket
    const ticket = await db.ticket.create({
      data: {
        ticketNumber,
        title,
        description,
        priority: priority || 'MEDIUM',
        category: category || 'general',
        status: 'OPEN',
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    
    return NextResponse.json({
      message: 'Ticket creado exitosamente',
      ticket,
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear ticket:', error);
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