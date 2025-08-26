import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getKhipuConfigFromSettings } from '@/lib/settings'

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
    const settings = await getKhipuConfigFromSettings()
    const NOTIFICATION_TOKEN = settings.notificationToken || process.env.KHIPU_NOTIFICATION_TOKEN
    
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
    const paymentStatus = status === 'completed' ? 'COMPLETED' : 
                           status === 'failed' ? 'FAILED' : 
                           status === 'pending' ? 'PENDING' : 'UNKNOWN'

    // Buscar el pago por el transaction_id o payment_id
    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { transactionId: paymentId?.toString() },
          { paymentNumber: (customData as any).payment_id?.toString() }
        ]
      }
    })

    if (payment) {
      // Actualizar el pago
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentStatus,
          transactionId: transactionId?.toString(),
          paidDate: paymentStatus === 'COMPLETED' ? new Date() : null,
          notes: payment.notes ? `${payment.notes}\nNotificación Khipu: ${status}` : `Notificación Khipu: ${status}`
        }
      })

      console.log(`Pago ${payment.id} actualizado a estado: ${paymentStatus}`)
    } else {
      console.warn('No se encontró pago para la notificación:', { paymentId, customData })
    }

    // Si el pago se completó, realizar acciones adicionales
    if (paymentStatus === 'COMPLETED') {
      console.log('Pago completado, ejecutando acciones post-pago...')
      
      // Actualizar estado del contrato si existe
      if ((customData as any).contract_id) {
        try {
          await db.contract.update({
            where: { id: (customData as any).contract_id },
            data: { 
              status: 'ACTIVE'
            }
          })
          console.log('Contrato actualizado:', (customData as any).contract_id)
        } catch (error) {
          console.error('Error actualizando contrato:', error)
        }
      }

      // Crear notificación para el usuario
      if ((customData as any).user_id) {
        try {
          await db.notification.create({
            data: {
              userId: (customData as any).user_id,
              title: 'Pago Completado',
              message: `Tu pago de ${amount} ${currency} ha sido procesado exitosamente.`,
              type: 'SUCCESS',
              data: JSON.stringify({
                payment_id: payment?.id,
                amount: amount,
                currency: currency,
                transaction_id: transactionId
              })
            }
          })
          console.log('Notificación creada para usuario:', (customData as any).user_id)
        } catch (error) {
          console.error('Error creando notificación:', error)
        }
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

    const settings = await getKhipuConfigFromSettings()
    const NOTIFICATION_TOKEN = settings.notificationToken || process.env.KHIPU_NOTIFICATION_TOKEN

    if (!notificationToken || notificationToken !== NOTIFICATION_TOKEN) {
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