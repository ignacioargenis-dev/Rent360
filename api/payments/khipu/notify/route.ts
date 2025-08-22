import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Khipu envía notificaciones como form data
    const formData = await request.formData()
    
    const notificationToken = formData.get('notification_token')
    const paymentId = formData.get('payment_id')
    const transactionId = formData.get('transaction_id')
    const amount = formData.get('amount')
    const currency = formData.get('currency')
    const status = formData.get('status')
    const custom = formData.get('custom')

    // Verificar token de notificación (debería coincidir con el configurado en Khipu)
    const NOTIFICATION_TOKEN = process.env.KHIPU_NOTIFICATION_TOKEN
    
    if (!notificationToken || notificationToken !== NOTIFICATION_TOKEN) {
      console.error('Token de notificación inválido:', notificationToken)
      return NextResponse.json(
        { error: 'Token de notificación inválido' },
        { status: 401 }
      )
    }

    console.log('Notificación de Khipu recibida:', {
      paymentId,
      transactionId,
      amount,
      currency,
      status,
      custom
    })

    // Parsear datos personalizados
    let customData = {}
    try {
      if (custom) {
        customData = JSON.parse(custom.toString())
      }
    } catch (error) {
      console.error('Error al parsear datos personalizados:', error)
    }

    // Actualizar estado del pago en la base de datos
    // Aquí iría la lógica con Prisma para actualizar el pago
    const paymentStatus = status === 'completed' ? 'completed' : 
                           status === 'failed' ? 'failed' : 
                           status === 'pending' ? 'pending' : 'unknown'

    // Ejemplo de lo que se haría con Prisma:
    /*
    await prisma.payment.update({
      where: { id: customData.payment_id },
      data: {
        status: paymentStatus,
        khipu_payment_id: paymentId,
        transaction_id: transactionId,
        completed_at: paymentStatus === 'completed' ? new Date() : null,
        metadata: {
          notification_received: true,
          received_at: new Date().toISOString(),
          raw_data: Object.fromEntries(formData)
        }
      }
    })
    */

    // Si el pago se completó, realizar acciones adicionales
    if (paymentStatus === 'completed') {
      console.log('Pago completado, ejecutando acciones post-pago...')
      
      // Aquí podrías:
      // 1. Actualizar estado del contrato
      // 2. Enviar notificación al usuario
      // 3. Generar comprobante
      // 4. Actualizar estadísticas
      
      if (customData.contract_id) {
        console.log('Actualizando contrato:', customData.contract_id)
        // await prisma.contract.update({
        //   where: { id: customData.contract_id },
        //   data: { payment_status: 'paid' }
        // })
      }
    }

    // Responder a Khipu que recibimos la notificación
    return NextResponse.json({
      success: true,
      message: 'Notificación recibida y procesada'
    })

  } catch (error) {
    console.error('Error procesando notificación de Khipu:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Khipu también puede enviar notificaciones GET para verificación
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const notificationToken = searchParams.get('notification_token')

    if (!notificationToken || notificationToken !== process.env.KHIPU_NOTIFICATION_TOKEN) {
      return NextResponse.json(
        { error: 'Token de notificación inválido' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Endpoint de notificación activo'
    })

  } catch (error) {
    console.error('Error en verificación de endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}