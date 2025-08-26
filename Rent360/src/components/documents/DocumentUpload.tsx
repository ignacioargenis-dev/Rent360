'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Plus,
  Image as ImageIcon,
  File,
  FileVideo,
  FileAudio,
  Archive
} from 'lucide-react'

interface DocumentFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  status: 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
}

interface DocumentUploadProps {
  onUploadComplete?: (files: DocumentFile[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  allowedTypes?: string[]
  category?: 'contract' | 'agreement' | 'receipt' | 'form' | 'property' | 'maintenance' | 'other'
  showPreview?: boolean
}

export default function DocumentUpload({
  onUploadComplete,
  maxFiles = 10,
  maxSize = 10,
  allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  category = 'other',
  showPreview = true
}: DocumentUploadProps) {
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (type.includes('video')) return <FileVideo className="w-8 h-8 text-purple-500" />
    if (type.includes('audio')) return <FileAudio className="w-8 h-8 text-green-500" />
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-8 h-8 text-orange-500" />
    return <File className="w-8 h-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      return `El archivo excede el tamaño máximo de ${maxSize}MB`
    }
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo de archivo no permitido'
    }
    return null
  }

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: DocumentFile[] = []
    
    Array.from(selectedFiles).forEach(file => {
      const error = validateFile(file)
      const documentFile: DocumentFile = {
        id: `file_${Date.now()}_${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'uploading',
        progress: 0,
        error: error || undefined
      }
      newFiles.push(documentFile)
    })

    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
    
    // Simulate upload progress
    newFiles.filter(f => f.status === 'uploading').forEach(file => {
      simulateUpload(file.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', progress: 100 }
            : f
        ))
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress }
            : f
        ))
      }
    }, 500)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleUpload = () => {
    if (files.length === 0) {
      alert('Por favor selecciona al menos un archivo')
      return
    }

    const completedFiles = files.filter(f => f.status === 'completed')
    if (completedFiles.length !== files.length) {
      alert('Por favor espera a que todos los archivos terminen de subir')
      return
    }

    // Simulate document creation
    const documentData = {
      title: title || files[0].name,
      description,
      category: selectedCategory,
      tags,
      files: completedFiles,
      created_at: new Date().toISOString()
    }

    console.log('Documento creado:', documentData)
    onUploadComplete?.(completedFiles)
    
    // Reset form
    setFiles([])
    setTitle('')
    setDescription('')
    setTags([])
    setNewTag('')
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'contract': return 'Contrato'
      case 'agreement': return 'Acuerdo'
      case 'receipt': return 'Recibo'
      case 'form': return 'Formulario'
      case 'property': return 'Propiedad'
      case 'maintenance': return 'Mantenimiento'
      default: return 'Otro'
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Documentos
          </CardTitle>
          <CardDescription>
            Sube archivos para crear un nuevo documento. Máximo {maxFiles} archivos, {maxSize}MB cada uno.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Arrastra archivos aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Formatos soportados: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, WEBP
            </p>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Seleccionar Archivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document Details */}
      {(files.length > 0 || title || description) && (
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ingresa un título para el documento"
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el contenido del documento"
                rows={3}
              />
            </div>

            <div>
              <Label>Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="agreement">Acuerdo</SelectItem>
                  <SelectItem value="receipt">Recibo</SelectItem>
                  <SelectItem value="form">Formulario</SelectItem>
                  <SelectItem value="property">Propiedad</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Etiquetas</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Agregar etiqueta"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button variant="outline" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <XCircle 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Archivos ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {file.status === 'uploading' && (
                      <div className="flex items-center gap-2">
                        <Progress value={file.progress} className="w-24" />
                        <span className="text-sm text-gray-500">{Math.round(file.progress)}%</span>
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completado
                      </Badge>
                    )}
                    
                    {file.status === 'error' && (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {files.some(f => f.error) && (
              <Alert className="mt-4">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Algunos archivos no pudieron ser procesados. Por favor verifica los requisitos y vuelve a intentarlo.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setFiles([])}>
                Cancelar
              </Button>
              <Button onClick={handleUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Subir Documento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}