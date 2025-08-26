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
  AlertCircle,
  Reply,
  Eye,
  BarChart3
} from 'lucide-react'

interface Rating {
  id: string
  targetId: string
  targetType: 'property' | 'tenant' | 'broker' | 'runner'
  targetName: string
  rating: number
  review: string
  categories: {
    communication: number
    professionalism: number
    maintenance: number
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
  tenantName?: string
  propertyName?: string
}

interface RatingStats {
  averageRating: number
  totalRatings: number
  responseRate: number
  distribution: { rating: number; count: number; percentage: number }[]
  topCategories: { category: string; average: number }[]
  monthlyTrend: { month: string; average: number; count: number }[]
  propertyPerformance: { propertyName: string; averageRating: number; reviewCount: number }[]
}

const mockRatings: Rating[] = [
  {
    id: '1',
    targetId: 'tenant1',
    targetType: 'tenant',
    targetName: 'María González',
    rating: 5,
    review: 'Excelente inquilina, siempre paga puntualmente y mantiene el departamento en perfectas condiciones. Muy recomendada.',
    categories: {
      communication: 5,
      professionalism: 5,
      maintenance: 5,
      responsiveness: 5,
      overall: 5
    },
    anonymous: false,
    createdAt: '2024-01-15',
    status: 'approved',
    helpful: 8,
    reported: false,
    propertyName: 'Departamento Las Condes'
  },
  {
    id: '2',
    targetId: 'tenant2',
    targetType: 'tenant',
    targetName: 'Carlos Ramírez',
    rating: 4,
    review: 'Buen inquilino, responsable y comunicativo. Ha cuidado bien el departamento y reporta los problemas a tiempo.',
    categories: {
      communication: 4,
      professionalism: 4,
      maintenance: 4,
      responsiveness: 5,
      overall: 4
    },
    anonymous: false,
    createdAt: '2024-01-10',
    status: 'approved',
    response: {
      message: 'Gracias por ser un excelente inquilino. Valoramos mucho tu responsabilidad.',
      createdAt: '2024-01-11',
      fromUser: 'Propietario'
    },
    helpful: 5,
    reported: false,
    propertyName: 'Oficina Providencia'
  },
  {
    id: '3',
    targetId: 'prop1',
    targetType: 'property',
    targetName: 'Casa Vitacura',
    rating: 4,
    review: 'La propiedad está en buenas condiciones, bien ubicada y con todos los servicios necesarios. El propietario es atento.',
    categories: {
      communication: 4,
      professionalism: 4,
      maintenance: 5,
      responsiveness: 4,
      overall: 4
    },
    anonymous: true,
    createdAt: '2024-01-08',
    status: 'approved',
    helpful: 12,
    reported: false,
    tenantName: 'Anónimo'
  },
  {
    id: '4',
    targetId: 'runner1',
    targetType: 'runner',
    targetName: 'Pedro Silva',
    rating: 5,
    review: 'El runner fue muy profesional, realizó la visita a tiempo y las fotos fueron de excelente calidad. Muy recomendado.',
    categories: {
      communication: 5,
      professionalism: 5,
      maintenance: 5,
      responsiveness: 5,
      overall: 5
    },
    anonymous: false,
    createdAt: '2024-01-05',
    status: 'approved',
    helpful: 6,
    reported: false,
    propertyName: 'Departamento Centro'
  }
]

const mockRatingStats: RatingStats = {
  averageRating: 4.5,
  totalRatings: 32,
  responseRate: 78,
  distribution: [
    { rating: 5, count: 20, percentage: 62 },
    { rating: 4, count: 9, percentage: 28 },
    { rating: 3, count: 2, percentage: 6 },
    { rating: 2, count: 1, percentage: 3 },
    { rating: 1, count: 0, percentage: 1 }
  ],
  topCategories: [
    { category: 'Comunicación', average: 4.6 },
    { category: 'Profesionalismo', average: 4.7 },
    { category: 'Mantenimiento', average: 4.8 },
    { category: 'Respuesta', average: 4.4 }
  ],
  monthlyTrend: [
    { month: 'Sep', average: 4.3, count: 5 },
    { month: 'Oct', average: 4.4, count: 6 },
    { month: 'Nov', average: 4.5, count: 7 },
    { month: 'Dec', average: 4.6, count: 8 },
    { month: 'Jan', average: 4.5, count: 6 }
  ],
  propertyPerformance: [
    { propertyName: 'Departamento Las Condes', averageRating: 4.8, reviewCount: 12 },
    { propertyName: 'Oficina Providencia', averageRating: 4.5, reviewCount: 8 },
    { propertyName: 'Casa Vitacura', averageRating: 4.3, reviewCount: 7 },
    { propertyName: 'Departamento Centro', averageRating: 4.6, reviewCount: 5 }
  ]
}

export default function OwnerRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>(mockRatings)
  const [stats, setStats] = useState<RatingStats>(mockRatingStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [targetFilter, setTargetFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('received')
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = rating.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rating.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (rating.tenantName && rating.tenantName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (rating.propertyName && rating.propertyName.toLowerCase().includes(searchTerm.toLowerCase()))
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
      case 'tenant':
        return <User className="w-4 h-4" />
      case 'property':
        return <Building className="w-4 h-4" />
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
      case 'tenant':
        return <Badge className="bg-blue-100 text-blue-800">Inquilino</Badge>
      case 'property':
        return <Badge className="bg-green-100 text-green-800">Propiedad</Badge>
      case 'broker':
        return <Badge className="bg-purple-100 text-purple-800">Corredor</Badge>
      case 'runner':
        return <Badge className="bg-orange-100 text-orange-800">Runner</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const handleResponse = (ratingId: string) => {
    if (!responseText.trim()) return

    setRatings(prev => prev.map(rating => 
      rating.id === ratingId 
        ? { 
            ...rating, 
            response: {
              message: responseText,
              createdAt: new Date().toISOString().split('T')[0],
              fromUser: 'Propietario'
            }
          }
        : rating
    ))

    setRespondingTo(null)
    setResponseText('')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Calificaciones</h1>
          <p className="text-muted-foreground">Administra las calificaciones de tus propiedades y servicios</p>
        </div>
        <Button className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Exportar Reporte
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
            <CardTitle className="text-sm font-medium">Tasa de Respuesta</CardTitle>
            <Reply className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              De reseñas respondidas
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
            <CardTitle className="text-sm font-medium">Propiedades</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.propertyPerformance.length}</div>
            <p className="text-xs text-muted-foreground">
              Con calificaciones
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="received">Recibidas</TabsTrigger>
          <TabsTrigger value="given">Realizadas</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="properties">Por Propiedad</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
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
                    <SelectItem value="tenant">Inquilinos</SelectItem>
                    <SelectItem value="property">Propiedades</SelectItem>
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
                      {rating.propertyName && (
                        <p className="text-sm text-muted-foreground">
                          Propiedad: {rating.propertyName}
                        </p>
                      )}
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
                             key === 'maintenance' ? 'Mantenimiento' :
                             key === 'responsiveness' ? 'Respuesta' : key}
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            {renderStars(value, 'small')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {rating.response && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Tu respuesta</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(rating.response.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{rating.response.message}</p>
                      </div>
                    )}

                    {respondingTo === rating.id && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Textarea
                          placeholder="Escribe tu respuesta..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows={3}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleResponse(rating.id)}>
                            Enviar Respuesta
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setRespondingTo(null)
                              setResponseText('')
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{rating.anonymous ? 'Anónimo' : 'Público'}</span>
                        <span>{rating.helpful} personas encontraron útil</span>
                        {rating.reported && <span className="text-red-500">Reportado</span>}
                      </div>
                      {!rating.response && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setRespondingTo(rating.id)}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          Responder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="given" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No has realizado calificaciones aún</p>
                <p className="text-sm text-gray-400">Las calificaciones que realices a inquilinos y servicios aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>
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

        <TabsContent value="properties" className="space-y-4">
          <div className="grid gap-4">
            {stats.propertyPerformance.map((property) => (
              <Card key={property.propertyName}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{property.propertyName}</CardTitle>
                      <CardDescription>
                        {property.reviewCount} reseña{property.reviewCount !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(property.averageRating), 'small')}
                      <span className="text-lg font-bold">{property.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${(property.averageRating / 5) * 100}%` }}
                      ></div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}