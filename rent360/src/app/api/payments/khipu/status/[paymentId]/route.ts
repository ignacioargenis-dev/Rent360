import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { loadKhipuConfig } from '@/lib/settings'

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

		// Primero, intentar obtener el estado desde nuestra base de datos
		const dbPayment = await db.payment.findFirst({
			where: {
				OR: [
					{ paymentNumber: paymentId },
					{ transactionId: paymentId }
				]
			}
		})

		// Cargar configuración de Khipu
		const cfg = await loadKhipuConfig()
		if (!cfg.secretKey) {
			return NextResponse.json(
				{ error: 'Configuración de Khipu no encontrada' },
				{ status: 500 }
			)
		}

		// Determinar el ID correcto para consultar a Khipu
		const khipuId = dbPayment?.transactionId ?? paymentId

		// Consultar estado del pago a Khipu
		const KHIPU_API_URL = `${process.env.KHIPU_API_URL || 'https://khipu.com/api/2.0/payments'}/${khipuId}`
		const response = await fetch(KHIPU_API_URL, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${cfg.secretKey}`
			}
		})

		if (!response.ok) {
			const errorData = await response.json()
			console.error('Error consultando estado de pago en Khipu:', errorData)
			
			// Si falla la consulta a Khipu, devolver el estado de la base de datos si existe
			if (dbPayment) {
				return NextResponse.json({
					success: true,
					payment_id: paymentId,
					status: dbPayment.status.toLowerCase(),
					amount: dbPayment.amount,
					currency: 'CLP',
					database_only: true,
					created_at: dbPayment.createdAt.toISOString(),
					paid_at: dbPayment.paidDate?.toISOString(),
					notes: dbPayment.notes
				})
			}
			
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

		// Actualizar estado en base de datos si es necesario y si hay cambios
		if (dbPayment && dbPayment.status.toUpperCase() !== status.toUpperCase()) {
			const newStatus = status.toUpperCase() as any
			await db.payment.update({
				where: { id: dbPayment.id },
				data: {
					status: newStatus,
					transactionId: khipuResponse.payment_id || khipuResponse.transaction_id || dbPayment.transactionId,
					paidDate: status === 'completed' ? new Date() : null,
					notes: dbPayment.notes ? `${dbPayment.notes}\nActualizado desde Khipu: ${status}` : `Actualizado desde Khipu: ${status}`
				}
			})
			console.log(`Pago ${dbPayment.id} actualizado desde Khipu a estado: ${newStatus}`)
		}

		// Parsear datos personalizados
		let customData = null
		try {
			if (khipuResponse.custom) {
				customData = JSON.parse(khipuResponse.custom)
			}
		} catch (error) {
			console.error('Error al parsear datos personalizados:', error)
		}

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
			custom: customData,
			database_payment_id: dbPayment?.id,
			database_status: dbPayment?.status
		})

	} catch (error) {
		console.error('Error consultando estado de pago:', error)
		return NextResponse.json(
			{ error: 'Error interno del servidor' },
			{ status: 500 }
		)
	}
}