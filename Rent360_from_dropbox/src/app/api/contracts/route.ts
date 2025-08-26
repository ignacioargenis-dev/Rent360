import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { contractSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const propertyId = searchParams.get('propertyId');
    const ownerId = searchParams.get('ownerId');
    const tenantId = searchParams.get('tenantId');
    const brokerId = searchParams.get('brokerId');
    
    const skip = (page - 1) * limit;
    
    // Construir filtro
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (propertyId) {
      where.propertyId = propertyId;
    }
    
    if (ownerId) {
      where.ownerId = ownerId;
    }
    
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    if (brokerId) {
      where.brokerId = brokerId;
    }
    
    // Filtrar según el rol
    if (user.role !== 'admin') {
      switch (user.role) {
        case 'owner':
          where.ownerId = user.id;
          break;
        case 'tenant':
          where.tenantId = user.id;
          break;
        case 'broker':
          where.brokerId = user.id;
          break;
      }
    }
    
    // Obtener contratos
    const [contracts, total] = await Promise.all([
      db.contract.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
              city: true,
              commune: true
            }
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          tenant: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          broker: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
      }),
      db.contract.count({ where }),
    ]);
    
    return NextResponse.json({
      contracts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener contratos:', error);
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
    
    // Solo admin, owner, broker pueden crear contratos
    if (!['admin', 'owner', 'broker'].includes(user.role)) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear contratos' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validar los datos de entrada
    try {
      const validatedData = contractSchema.parse(data);
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
      propertyId,
      tenantId,
      brokerId,
      startDate,
      endDate,
      monthlyRent,
      deposit,
      terms
    } = data;
    
    // Verificar que la propiedad exista
    const property = await db.property.findUnique({
      where: { id: propertyId }
    });
    
    if (!property) {
      return NextResponse.json(
        { error: 'Propiedad no encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar que el tenant exista
    const tenant = await db.user.findUnique({
      where: { id: tenantId }
    });
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'Inquilino no encontrado' },
        { status: 404 }
      );
    }
    
    // Si se especifica broker, verificar que exista
    if (brokerId) {
      const broker = await db.user.findUnique({
        where: { id: brokerId }
      });
      
      if (!broker || broker.role !== 'broker') {
        return NextResponse.json(
          { error: 'Corredor no encontrado' },
          { status: 404 }
        );
      }
    }
    
    // Generar número de contrato
    const contractNumber = `CON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Crear contrato
    const contract = await db.contract.create({
      data: {
        contractNumber,
        propertyId,
        ownerId: property.ownerId,
        tenantId,
        brokerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        monthlyRent: parseFloat(monthlyRent),
        deposit: parseFloat(deposit),
        status: 'DRAFT',
        terms: terms || ''
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            commune: true
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        broker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json({
      message: 'Contrato creado exitosamente',
      contract
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear contrato:', error);
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