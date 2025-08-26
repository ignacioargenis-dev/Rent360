import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';

const paymentSchema = z.object({
  contractId: z.string(),
  amount: z.number().positive(),
  dueDate: z.string(),
  paymentMethod: z.enum(['transfer', 'cash', 'check', 'online']),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).optional().default('PENDING'),
  notes: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    
    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const contractId = searchParams.get('contractId');
    const tenantId = searchParams.get('tenantId');
    const ownerId = searchParams.get('ownerId');
    
    const skip = (page - 1) * limit;
    
    // Construir filtro
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (contractId) {
      where.contractId = contractId;
    }
    
    if (tenantId) {
      where.contract = {
        tenantId: tenantId
      };
    }
    
    if (ownerId) {
      where.contract = {
        ownerId: ownerId
      };
    }
    
    // Filtrar según el rol
    if (user.role !== 'admin') {
      switch (user.role) {
        case 'owner':
          where.contract = {
            ownerId: user.id
          };
          break;
        case 'tenant':
          where.contract = {
            tenantId: user.id
          };
          break;
        case 'broker':
          where.contract = {
            brokerId: user.id
          };
          break;
      }
    }
    
    // Obtener pagos
    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        include: {
          contract: {
            include: {
              property: {
                select: {
                  id: true,
                  title: true,
                  address: true
                }
              },
              tenant: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              },
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          dueDate: 'asc'
        },
        skip,
        take: limit,
      }),
      db.payment.count({ where }),
    ]);
    
    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
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
    
    // Solo admin, owner, tenant pueden crear pagos
    if (!['admin', 'owner', 'tenant'].includes(user.role)) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear pagos' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validar los datos de entrada
    try {
      const validatedData = paymentSchema.parse(data);
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
      contractId,
      amount,
      dueDate,
      paymentMethod,
      status,
      notes
    } = data;
    
    // Verificar que el contrato exista
    const contract = await db.contract.findUnique({
      where: { id: contractId },
      include: {
        property: true,
        owner: true,
        tenant: true
      }
    });
    
    if (!contract) {
      return NextResponse.json(
        { error: 'Contrato no encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar permisos según el rol
    if (user.role === 'tenant' && contract.tenantId !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear pagos para este contrato' },
        { status: 403 }
      );
    }
    
    if (user.role === 'owner' && contract.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear pagos para este contrato' },
        { status: 403 }
      );
    }
    
    // Generar número de pago
    const paymentNumber = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Crear pago
    const payment = await db.payment.create({
      data: {
        paymentNumber,
        contractId,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        paymentMethod,
        status: status || 'PENDING',
        notes: notes || ''
      },
      include: {
        contract: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                address: true
              }
            },
            tenant: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    return NextResponse.json({
      message: 'Pago creado exitosamente',
      payment
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear pago:', error);
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