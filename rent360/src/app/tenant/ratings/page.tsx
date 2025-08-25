'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  User, 
  Building, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Award,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Rating {
  id: string
  targetId: string
  targetType: 'property' | 'owner' | 'broker' | 'runner'
  targetName: string
  rating: number
  review: string
  categories: {
    communication: number
    professionalism: number
    value: number
    responsiveness: number
    overall: number
  }
  anonymous: boolean
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
  response?: {
    message: string
    createdAt: string
    fromUser: string
  }
  helpful: number
  reported: boolean
}

interface RatingStats {
  averageRating: number
  totalRatings: number
  distribution: { rating: number; count: number; percentage: number }[]
  topCategories: { category: string; average: number }[]
  monthlyTrend: { month: string; average: number; count: number }[]
}

const mockRatings: Rating[] = [
  {
    id: '1',
    targetId: 'prop1',
    targetType: 'property',
    targetName: 'Departamento Las Condes',
    rating: 5,
    review: 'Excelente departamento, muy bien ubicado y con todas las comodidades necesarias. El propietario fue muy atento y profesional durante todo el proceso.',
    categories: {
      communication: 5,
      professionalism: 5,
      value: 4,
      responsiveness: 5,
      overall: 5
    },
    anonymous: false,
    createdAt: '2024-01-15',
    status: 'approved',
    helpful: 12,
    reported: false
  },
  {
    id: '2',
    targetId: 'owner1',
    targetType: 'owner',
    targetName: 'Carlos Rodríguez',
    rating: 4,
    review: 'Buen propietario, siempre responde rápido y soluciona los problemas de manera eficiente. El departamento está en buenas condiciones.',
    categories: {
      communication: 4,
      professionalism: 4,
      value: 4,
      responsiveness: 5,
      overall: 4
    },
    anonymous: false,
    createdAt: '2024-01-10',
    status: 'approved',
    response: {
      message: 'Gracias por tu calificación. Me esfuerzo por ofrecer el mejor servicio posible.',
      createdAt: '2024-01-11',
      fromUser: 'Carlos Rodríguez'
    },
    helpful: 8,
    reported: false
  },
  {
    id: '3',
    targetId: 'broker1',
    targetType: 'broker',
    targetName: 'Ana Martínez',
    rating: 5,
    review: 'Ana fue excepcional como corredora. Nos ayudó a encontrar el departamento perfecto y nos guió en todo el proceso de arriendo.',
    categories: {
      communication: 5,
      professionalism: 5,
      value: 5,
      responsiveness: 5,
      overall: 5
    },
    anonymous: false,
    createdAt: '2024-01-08',
    status: 'approved',
    helpful: 15,
    reported: false
  },
  {
    id: '4',
    targetId: 'runner1',
    targetType: 'runner',
    targetName: 'Pedro Silva',
    rating: 4,
    review: 'Muy profesional y puntual. Las fotos del departamento fueron de excelente calidad y la visita fue muy completa.',
    categories: {
      communication: 4,
      professionalism: 5,
      value: 4,
      responsiveness: 4,
      overall: 4
    },
    anonymous: false,
    createdAt: '2024-01-05',
    status: 'approved',
    helpful: 6,
    reported: false
  }
]

const mockRatingStats: RatingStats = {
  averageRating: 4.5,
  totalRatings: 28,
  distribution: [
    { rating: 5, count: 18, percentage: 64 },
    { rating: 4, count: 7, percentage: 25 },
    { rating: 3, count: 2, percentage: 7 },
    { rating: 2, count: 1, percentage: 4 },
    { rating: 1, count: 0, percentage: 0 }
  ],
  topCategories: [
    { category: 'Comunicación', average: 4.6 },
    { category: 'Profesionalismo', average: 4.7 },
    { category: 'Valor', average: 4.2 },
    { category: 'Respuesta', average: 4.5 }
  ],
  monthlyTrend: [
    { month: 'Sep', average: 4.2, count: 4 },
    { month: 'Oct', average: 4.4, count: 5 },
    { month: 'Nov', average: 4.5, count: 6 },
    { month: 'Dec', average: 4.6, count: 7 },
    { month: 'Jan', average: 4.5, count: 6 }
  ]
}

export default function TenantRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>(mockRatings)
  const [stats, setStats] = useState<RatingStats>(mockRatingStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [targetFilter, setTargetFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('my-ratings')
  const [showNewRatingForm, setShowNewRatingForm] = useState(false)
  const [newRating, setNewRating] = useState({
    targetType: 'property' as const,
    targetId: '',
    rating: 5,
    review: '',
    categories: {
      communication: 5,
      professionalism: 5,
      value: 5,
      responsiveness: 5,
      overall: 5
    },
    anonymous: false
  })

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = rating.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rating.review.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTarget = targetFilter === 'all' || rating.targetType === targetFilter
    const matchesRating = ratingFilter === 'all' || rating.rating.toString() === ratingFilter
    
    return matchesSearch && matchesTarget && matchesRating
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number, size = 'normal') => {
    const sizeClass = size === 'small' ? 'w-4 h-4' : 'w-5 h-5'
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'property':
        return <Building className="w-4 h-4" />
      case 'owner':
        return <User className="w-4 h-4" />
      case 'broker':
        return <Award className="w-4 h-4" />
      case 'runner':
        return <User className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getTargetBadge = (targetType: string) => {
    switch (targetType) {
      case 'property':
        return <Badge className="bg-blue-100 text-blue-800">Propiedad</Badge>
      case 'owner':
        return <Badge className="bg-green-100 text-green-800">Propietario</Badge>
      case 'broker':
        return <Badge className="bg-purple-100 text-purple-800">Corredor</Badge>
      case 'runner':
        return <Badge className="bg-orange-100 text-orange-800">Runner</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const handleSubmitRating = () => {
    if (!newRating.targetId || !newRating.review) return

    const rating: Rating = {
      id: Date.now().toString(),
      targetId: newRating.targetId,
      targetType: newRating.targetType,
      targetName: 'Target Name', // This would be fetched based on targetId
      rating: newRating.rating,
      review: newRating.review,
      categories: newRating.categories,
      anonymous: newRating.anonymous,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      helpful: 0,
      reported: false
    }

    setRatings([rating, ...ratings])
    setNewRating({
      targetType: 'property',
      targetId: '',
      rating: 5,
      review: '',
      categories: {
        communication: 5,
        professionalism: 5,
        value: 5,
        responsiveness: 5,
        overall: 5
      },
      anonymous: false
    })
    setShowNewRatingForm(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calificaciones y Reseñas</h1>
          <p className="text-muted-foreground">Gestiona tus calificaciones y reseñas de propiedades y servicios</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowNewRatingForm(true)}
        >
          <Star className="h-4 w-4" />
          Nueva Calificación
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-1">
              {renderStars(Math.round(stats.averageRating), 'small')}
              <span className="text-xs text-muted-foreground">({stats.totalRatings} reseñas)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reseñas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRatings}</div>
            <p className="text-xs text-muted-foreground">
              Reseñas publicadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">5 Estrellas</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.distribution[0].count}</div>
            <p className="text-xs text-muted-foreground">
              {stats.distribution[0].percentage}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respuesta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ratings.filter(r => r.response).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con respuesta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Rating Form */}
      {showNewRatingForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Crear Nueva Calificación</CardTitle>
              <Button variant="outline" onClick={() => setShowNewRatingForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Calificación</label>
                <Select value={newRating.targetType} onValueChange={(value) => 
                  setNewRating({...newRating, targetType: value as any})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property">Propiedad</SelectItem>
                    <SelectItem value="owner">Propietario</SelectItem>
                    <SelectItem value="broker">Corredor</SelectItem>
                    <SelectItem value="runner">Runner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Calificación General</label>
                <div className="flex items-center gap-2">
                  {renderStars(newRating.rating)}
                  <span className="text-sm text-muted-foreground">({newRating.rating}/5)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reseña</label>
              <Textarea
                placeholder="Describe tu experiencia..."
                value={newRating.review}
                onChange={(e) => setNewRating({...newRating, review: e.target.value})}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Calificación por Categorías</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(newRating.categories).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {key === 'overall' ? 'General' : 
                       key === 'communication' ? 'Comunicación' :
                       key === 'professionalism' ? 'Profesionalismo' :
                       key === 'value' ? 'Valor' :
                       key === 'responsiveness' ? 'Respuesta' : key}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 cursor-pointer"
                          onClick={() => setNewRating({
                            ...newRating,
                            categories: {
                              ...newRating.categories,
                              [key]: star
                            }
                          })}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={newRating.anonymous}
                onChange={(e) => setNewRating({...newRating, anonymous: e.target.checked})}
              />
              <label htmlFor="anonymous" className="text-sm">
                Publicar como anónimo
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewRatingForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitRating}>
                Publicar Calificación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-ratings">Mis Calificaciones</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="received">Recibidas</TabsTrigger>
        </TabsList>

        <TabsContent value="my-ratings" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar calificaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={targetFilter} onValueChange={setTargetFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="property">Propiedades</SelectItem>
                    <SelectItem value="owner">Propietarios</SelectItem>
                    <SelectItem value="broker">Corredores</SelectItem>
                    <SelectItem value="runner">Runners</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="5">5 Estrellas</SelectItem>
                    <SelectItem value="4">4 Estrellas</SelectItem>
                    <SelectItem value="3">3 Estrellas</SelectItem>
                    <SelectItem value="2">2 Estrellas</SelectItem>
                    <SelectItem value="1">1 Estrella</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ratings List */}
          <div className="grid gap-4">
            {filteredRatings.map((rating) => (
              <Card key={rating.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getTargetIcon(rating.targetType)}
                        <CardTitle className="text-lg">{rating.targetName}</CardTitle>
                        {getTargetBadge(rating.targetType)}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(rating.rating)}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(rating.createdAt)}
                        </span>
                        {rating.status === 'pending' && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Pendiente
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-4 h-4" />
                        {rating.helpful}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{rating.review}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      {Object.entries(rating.categories).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-xs text-muted-foreground capitalize">
                            {key === 'overall' ? 'General' : 
                             key === 'communication' ? 'Comunicación' :
                             key === 'professionalism' ? 'Profesionalismo' :
                             key === 'value' ? 'Valor' :
                             key === 'responsiveness' ? 'Respuesta' : key}
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            {renderStars(value, 'small')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {rating.response && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Respuesta del {rating.targetType === 'property' ? 'propietario' : rating.targetType}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(rating.response.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{rating.response.message}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{rating.anonymous ? 'Anónimo' : 'Público'}</span>
                      <div className="flex items-center gap-4">
                        <span>{rating.helpful} personas encontraron útil</span>
                        {rating.reported && <span className="text-red-500">Reportado</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.distribution.map((item) => (
                    <div key={item.rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm">{item.rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-20">
                        <span className="text-sm font-medium">{item.count}</span>
                        <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topCategories.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(category.average / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{category.average.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia Mensual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyTrend.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(month.average), 'small')}
                        <span className="text-sm text-muted-foreground">
                          {month.average.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {month.count} reseñas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No has recibido calificaciones aún</p>
                <p className="text-sm text-gray-400">Las calificaciones que otros usuarios te dejen aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}