import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const tags = formData.getAll('tags') as string[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron archivos' }, { status: 400 })
    }

    const uploadedFiles = []
    
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generar nombre de archivo único
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileExtension = path.extname(file.name)
      const fileName = `${timestamp}_${randomId}${fileExtension}`
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'documents', fileName)

      // Crear directorio si no existe
      import * as fs from 'fs'
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      // Guardar archivo
      await writeFile(filePath, buffer)

      // Guardar información en la base de datos
      const document = await db.document.create({
        data: {
          title: title || file.name,
          description: description || '',
          category: category || 'other',
          file_name: file.name,
          file_path: `/uploads/documents/${fileName}`,
          file_size: file.size,
          file_type: file.type,
          tags: tags || [],
          uploaded_by: session.user.id,
          status: 'active'
        }
      })

      uploadedFiles.push({
        id: document.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: `/uploads/documents/${fileName}`,
        status: 'completed'
      })
    }

    return NextResponse.json({
      message: 'Documentos subidos exitosamente',
      files: uploadedFiles
    })

  } catch (error) {
    console.error('Error al subir documentos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const where: any = {
      uploaded_by: session.user.id,
      status: 'active'
    }

    if (category && category !== 'all') {
      where.category = category
    }

    const documents = await db.document.findMany({
      where,
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit
    })

    const total = await db.document.count({ where })

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error al obtener documentos:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}