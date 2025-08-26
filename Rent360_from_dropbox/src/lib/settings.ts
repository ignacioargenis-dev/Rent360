import { db } from '@/lib/db'

export async function getSettingValue(key: string): Promise<string | undefined> {
	try {
		const setting = await db.systemSetting.findUnique({ where: { key } })
		return setting?.value ?? undefined
	} catch (error) {
		return undefined
	}
}

export async function getSettingBoolean(key: string, defaultValue = false): Promise<boolean> {
	const value = await getSettingValue(key)
	if (value === undefined) return defaultValue
	return value === 'true' || value === '1' || value.toLowerCase() === 'yes'
}

export async function getKhipuConfigFromSettings() {
	const [enabled, receiverId, secretKey, notificationToken] = await Promise.all([
		getSettingBoolean('khipu.enabled', false),
		getSettingValue('khipu.receiver_id'),
		getSettingValue('khipu.secret_key'),
		getSettingValue('khipu.notification_token')
	])
	return {
		enabled,
		receiverId,
		secretKey,
		notificationToken,
	}
}

export async function getPaymentsEnabled(): Promise<boolean> {
	return getSettingBoolean('payments.enabled', true)
}