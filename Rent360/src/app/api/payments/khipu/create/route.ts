import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface KhipuPaymentRequest {
  amount: number
  currency: string
  subject: string
  body: string
  return_url: string
  cancel_url: string
  notify_url: string
  payer_email?: string
  payer_name?: string
  contract_id?: string
  user_id: string
}

export async function POST(request: NextRequest) {
  try {
    const body: KhipuPaymentRequest = await request.json()
    
    // Validar datos requeridos
    if (!body.amount || !body.subject || !body.return_url || !body.cancel_url || !body.notify_url) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Cargar configuración de Khipu (desde DB y/o variables de entorno)
    const settings = await db.systemSetting.findMany({
      where: {
        key: { in: ['khipuEnabled', 'khipuReceiverId', 'khipuSecretKey', 'khipuEnvironment'] }
      }
    })

    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value])) as Record<string, string>

    const khipuEnabled = (process.env.KHIPU_ENABLED ?? settingsMap['khipuEnabled'] ?? 'true').toString() === 'true'
    const receiverId = process.env.KHIPU_RECEIVER_ID ?? settingsMap['khipuReceiverId']
    const secretKey = process.env.KHIPU_SECRET_KEY ?? settingsMap['khipuSecretKey']
    const environment = (process.env.KHIPU_ENVIRONMENT ?? settingsMap['khipuEnvironment'] ?? 'test').toString()
    const apiBase = process.env.KHIPU_API_URL ?? (environment === 'production' 
      ? 'https://khipu.com/api/2.0/payments' 
      : 'https://sandbox.khipu.com/api/2.0/payments')

    if (!khipuEnabled) {
      return NextResponse.json(
        { error: 'Pagos con Khipu deshabilitados por configuración' },
        { status: 400 }
      )
    }

    if (!secretKey || !receiverId) {
      return NextResponse.json(
        { error: 'Configuración de Khipu incompleta' },
        { status: 500 }
      )
    }

    // Crear payment ID único
    const paymentId = `rent360_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Preparar datos para Khipu
    const khipuData = {
      receiver_id: receiverId,
      subject: body.subject,
      amount: body.amount.toString(),
      currency: body.currency || 'CLP',
      body: body.body,
      notify_url: body.notify_url,
      return_url: body.return_url,
      cancel_url: body.cancel_url,
      custom: JSON.stringify({
        payment_id: paymentId,
        contract_id: body.contract_id,
        user_id: body.user_id,
        platform: 'rent360'
      }),
      payer_email: body.payer_email,
      payer_name: body.payer_name,
      expires_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      transaction_id: paymentId
    }

    // Enviar solicitud a Khipu
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`
      },
      body: JSON.stringify(khipuData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error de Khipu:', errorData)
      return NextResponse.json(
        { error: 'Error al crear pago en Khipu', details: errorData },
        { status: 500 }
      )
    }

    const khipuResponse = await response.json()

    // Guardar información del pago en la base de datos
    const payment = await db.payment.create({
      data: {
        paymentNumber: paymentId,
        contractId: body.contract_id,
        amount: body.amount,
        dueDate: new Date(),
        status: 'PENDING',
        method: 'KHIPU',
        transactionId: khipuResponse.payment_id,
        notes: `Pago Khipu: ${body.subject}`
      }
    })

    // Retornar respuesta con datos del pago
    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      khipu_payment_id: khipuResponse.payment_id,
      payment_url: khipuResponse.payment_url || khipuResponse.simplified_transfer_url,
      amount: body.amount,
      currency: body.currency,
      status: 'pending',
      expires_at: khipuResponse.expires_date,
      created_at: new Date().toISOString(),
      database_payment_id: payment.id
    })

  } catch (error) {
    console.error('Error en creación de pago Khipu:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}