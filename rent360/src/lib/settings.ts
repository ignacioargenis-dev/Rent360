import { db } from '@/lib/db'

export type KhipuConfig = {
	enabled: boolean
	receiverId: string | null
	secretKey: string | null
	notificationToken: string | null
	environment: 'production' | 'test'
}

function toBoolean(value: string | null | undefined, defaultValue = false): boolean {
	if (value == null) return defaultValue
	const normalized = value.toString().trim().toLowerCase()
	return ['1', 'true', 'yes', 'on'].includes(normalized)
}

export async function loadKhipuConfig(): Promise<KhipuConfig> {
	const keys = [
		'khipuEnabled',
		'khipuReceiverId',
		'khipuSecretKey',
		'khipuNotificationToken',
		'khipuEnvironment',
	]

	const settings = await db.systemSetting.findMany({
		where: { key: { in: keys } },
	})

	const map = new Map(settings.map((s) => [s.key, s.value]))

	const enabled = toBoolean(map.get('khipuEnabled'), toBoolean(process.env.KHIPU_ENABLED, false))
	const receiverId = map.get('khipuReceiverId') ?? process.env.KHIPU_RECEIVER_ID ?? null
	const secretKey = map.get('khipuSecretKey') ?? process.env.KHIPU_SECRET_KEY ?? null
	const notificationToken = map.get('khipuNotificationToken') ?? process.env.KHIPU_NOTIFICATION_TOKEN ?? null
	const envValue = (map.get('khipuEnvironment') ?? process.env.KHIPU_ENVIRONMENT ?? 'test').toString().toLowerCase()
	const environment: 'production' | 'test' = envValue === 'production' ? 'production' : 'test'

	return {
		enabled,
		receiverId,
		secretKey,
		notificationToken,
		environment,
	}
}