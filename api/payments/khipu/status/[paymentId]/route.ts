import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID de pago no proporcionado' },
        { status: 400 }
      )
    }

    // Configuración de Khipu
    const KHIPU_API_URL = `${process.env.KHIPU_API_URL || 'https://khipu.com/api/2.0/payments'}/${paymentId}`
    const KHIPU_SECRET_KEY = process.env.KHIPU_SECRET_KEY

    if (!KHIPU_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Configuración de Khipu no encontrada' },
        { status: 500 }
      )
    }

    // Consultar estado del pago a Khipu
    const response = await fetch(KHIPU_API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${KHIPU_SECRET_KEY}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error consultando estado de pago en Khipu:', errorData)
      return NextResponse.json(
        { error: 'Error al consultar estado de pago', details: errorData },
        { status: 500 }
      )
    }

    const khipuResponse = await response.json()

    // Mapear estado de Khipu a nuestro sistema
    let status = 'unknown'
    switch (khipuResponse.status) {
      case 'completed':
        status = 'completed'
        break
      case 'pending':
        status = 'pending'
        break
      case 'failed':
        status = 'failed'
        break
      case 'expired':
        status = 'expired'
        break
      case 'cancelled':
        status = 'cancelled'
        break
      default:
        status = 'unknown'
    }

    // Actualizar estado en base de datos si es necesario
    // Aquí iría la lógica con Prisma

    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      khipu_payment_id: khipuResponse.payment_id,
      status: status,
      amount: parseFloat(khipuResponse.amount),
      currency: khipuResponse.currency,
      receiver_id: khipuResponse.receiver_id,
      subject: khipuResponse.subject,
      body: khipuResponse.body,
      payer_name: khipuResponse.payer_name,
      payer_email: khipuResponse.payer_email,
      payment_url: khipuResponse.payment_url || khipuResponse.simplified_transfer_url,
      created_at: khipuResponse.created_at,
      expires_at: khipuResponse.expires_date,
      completed_at: khipuResponse.completed_at,
      transaction_id: khipuResponse.transaction_id,
      notification_url: khipuResponse.notify_url,
      return_url: khipuResponse.return_url,
      cancel_url: khipuResponse.cancel_url,
      custom: khipuResponse.custom ? JSON.parse(khipuResponse.custom) : null
    })

  } catch (error) {
    console.error('Error consultando estado de pago:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}