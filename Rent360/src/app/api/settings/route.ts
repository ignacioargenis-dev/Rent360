import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = requireRole(request, 'admin');
    
    // Obtener todas las configuraciones
    const settings = await db.systemSetting.findMany({
      orderBy: {
        category: 'asc',
      },
    });
    
    // Agrupar por categoría
    const settingsByCategory = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = {};
      }
      acc[setting.category][setting.key] = {
        value: setting.value,
        description: setting.description,
        isActive: setting.isActive,
        isSystem: setting.isSystem,
      };
      return acc;
    }, {} as Record<string, Record<string, any>>);
    
    return NextResponse.json({
      settings: settingsByCategory,
    });
  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
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
    const user = requireRole(request, 'admin');
    const { settings } = await request.json();

    // Soporte para 2 formatos de payload:
    // 1) Categorizado: { [category]: { [key]: { value, isActive, description } } }
    // 2) Plano: { [key]: primitive | { value, isActive, description } }

    const isCategorized = settings && typeof settings === 'object' &&
      Object.values(settings).every((v: any) => v && typeof v === 'object' && !Array.isArray(v));

    const updates: Array<ReturnType<typeof db.systemSetting.upsert>> = [] as any;

    if (isCategorized) {
      for (const [category, categorySettings] of Object.entries(settings as Record<string, any>)) {
        for (const [key, settingData] of Object.entries(categorySettings as Record<string, any>)) {
          const value = typeof settingData === 'object' && settingData !== null && 'value' in settingData
            ? String(settingData.value)
            : String(settingData);
          const isActive = typeof settingData === 'object' && settingData !== null && 'isActive' in settingData
            ? Boolean((settingData as any).isActive)
            : true;
          const description = typeof settingData === 'object' && settingData !== null && 'description' in settingData
            ? String((settingData as any).description || '')
            : '';

          updates.push(db.systemSetting.upsert({
            where: { key },
            update: { value, isActive, category },
            create: { key, value, category, description, isActive },
          }) as any);
        }
      }
    } else {
      // Plano: determinar categoría heurística por clave
      const getCategoryForKey = (key: string): string => {
        const lower = key.toLowerCase();
        if (lower.startsWith('khipu') || lower.includes('payment')) return 'payments';
        if (lower.includes('smtp') || lower.includes('email')) return 'email';
        if (lower.includes('twofactor') || lower.includes('password') || lower.includes('session') || lower.includes('security')) return 'security';
        if (lower.includes('google') || lower.includes('webhook') || lower.includes('api')) return 'integrations';
        return 'general';
      };

      for (const [key, settingData] of Object.entries(settings as Record<string, any>)) {
        const category = getCategoryForKey(key);
        const value = typeof settingData === 'object' && settingData !== null && 'value' in settingData
          ? String(settingData.value)
          : String(settingData);
        const isActive = typeof settingData === 'object' && settingData !== null && 'isActive' in settingData
          ? Boolean((settingData as any).isActive)
          : true;
        const description = typeof settingData === 'object' && settingData !== null && 'description' in settingData
          ? String((settingData as any).description || '')
          : '';

        updates.push(db.systemSetting.upsert({
          where: { key },
          update: { value, isActive, category },
          create: { key, value, category, description, isActive },
        }) as any);
      }
    }

    await Promise.all(updates);
    
    return NextResponse.json({
      message: 'Configuraciones guardadas exitosamente',
    });
  } catch (error) {
    console.error('Error al guardar configuraciones:', error);
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