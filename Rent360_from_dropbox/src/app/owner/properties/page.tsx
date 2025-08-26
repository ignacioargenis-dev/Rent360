'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash2,
  Star,
  Calendar,
  Image,
  Home,
  Briefcase,
  Store,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Settings,
  BarChart3,
  Download,
  Bath,
  Bed,
  Square
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@/types';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';

interface Property {
  id: string;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'office' | 'commercial' | 'other';
  address: string;
  city: string;
  neighborhood: string;
  price: number;
  status: 'available' | 'rented' | 'maintenance' | 'unavailable';
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  images: string[];
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  contractStart?: string;
  contractEnd?: string;
  monthlyRevenue: number;
  occupancyRate: number;
  totalRevenue: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  inquiries: number;
  featured: boolean;
}

interface PropertyStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  maintenanceProperties: number;
  totalMonthlyRevenue: number;
  totalRevenue: number;
  averageOccupancy: number;
  topPerformingProperty: string;
  propertiesNeedingAttention: number;
}

export default function OwnerProperties() {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<PropertyStats>({
    totalProperties: 0,
    availableProperties: 0,
    rentedProperties: 0,
    maintenanceProperties: 0,
    totalMonthlyRevenue: 0,
    totalRevenue: 0,
    averageOccupancy: 0,
    topPerformingProperty: '',
    propertiesNeedingAttention: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    const loadProperties = async () => {
      try {
        // Mock properties data
        const mockProperties: Property[] = [
          {
            id: '1',
            title: 'Departamento Amoblado Centro',
            description: 'Hermoso departamento amoblado en el corazón de Santiago, cerca de todo',
            type: 'apartment',
            address: 'Av. Providencia 1234',
            city: 'Santiago',
            neighborhood: 'Providencia',
            price: 450000,
            status: 'rented',
            bedrooms: 2,
            bathrooms: 1,
            area: 65,
            features: ['Amoblado', 'Estacionamiento', 'Gimnasio', 'Piscina'],
            images: ['/placeholder1.jpg', '/placeholder2.jpg'],
            tenantName: 'Juan Pérez',
            tenantEmail: 'juan.perez@email.com',
            tenantPhone: '+56 9 1234 5678',
            contractStart: '2024-01-01',
            contractEnd: '2024-12-31',
            monthlyRevenue: 450000,
            occupancyRate: 95,
            totalRevenue: 5400000,
            lastMaintenance: '2024-01-15',
            nextMaintenance: '2024-07-15',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
            views: 1250,
            inquiries: 45,
            featured: true
          },
          {
            id: '2',
            title: 'Casa Las Condes',
            description: 'Espaciosa casa familiar en Las Condes con jardín y terraza',
            type: 'house',
            address: 'Calle El Alba 567',
            city: 'Santiago',
            neighborhood: 'Las Condes',
            price: 1200000,
            status: 'rented',
            bedrooms: 4,
            bathrooms: 3,
            area: 180,
            features: ['Jardín', 'Terraza', 'Estacionamiento 2 autos', 'Seguridad 24h'],
            images: ['/placeholder3.jpg', '/placeholder4.jpg'],
            tenantName: 'María García',
            tenantEmail: 'maria.garcia@empresa.cl',
            tenantPhone: '+56 9 8765 4321',
            contractStart: '2023-06-01',
            contractEnd: '2025-05-31',
            monthlyRevenue: 1200000,
            occupancyRate: 100,
            totalRevenue: 21600000,
            lastMaintenance: '2024-02-20',
            nextMaintenance: '2024-08-20',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
            views: 890,
            inquiries: 23,
            featured: false
          },
          {
            id: '3',
            title: 'Oficina Vitacura',
            description: 'Moderna oficina en Vitacura con excelente ubicación',
            type: 'office',
            address: 'Av. Kennedy 4567',
            city: 'Santiago',
            neighborhood: 'Vitacura',
            price: 800000,
            status: 'available',
            bedrooms: 0,
            bathrooms: 2,
            area: 120,
            features: ['Aire acondicionado', 'Estacionamiento', 'Recepción', 'Seguridad'],
            images: ['/placeholder5.jpg', '/placeholder6.jpg'],
            monthlyRevenue: 0,
            occupancyRate: 0,
            totalRevenue: 0,
            lastMaintenance: '2024-03-10',
            nextMaintenance: '2024-09-10',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            views: 567,
            inquiries: 12,
            featured: true
          },
          {
            id: '4',
            title: 'Local Comercial',
            description: 'Local comercial en zona de alto tráfico',
            type: 'commercial',
            address: 'Av. Apoquindo 6789',
            city: 'Santiago',
            neighborhood: 'Las Condes',
            price: 1500000,
            status: 'rented',
            bedrooms: 0,
            bathrooms: 1,
            area: 200,
            features: ['Vidrio frontal', 'Alarma', 'Estacionamiento clientes', 'Zona de carga'],
            images: ['/placeholder7.jpg', '/placeholder8.jpg'],
            tenantName: 'Roberto López',
            tenantEmail: 'roberto.lopez@negocio.cl',
            tenantPhone: '+56 9 3456 7890',
            contractStart: '2024-02-01',
            contractEnd: '2026-01-31',
            monthlyRevenue: 1500000,
            occupancyRate: 98,
            totalRevenue: 18000000,
            lastMaintenance: '2024-01-05',
            nextMaintenance: '2024-07-05',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
            views: 445,
            inquiries: 8,
            featured: false
          },
          {
            id: '5',
            title: 'Departamento Playa',
            description: 'Departamento con vista al mar en Viña del Mar',
            type: 'apartment',
            address: 'Av. Costanera 890',
            city: 'Viña del Mar',
            neighborhood: 'Reñaca',
            price: 600000,
            status: 'maintenance',
            bedrooms: 3,
            bathrooms: 2,
            area: 95,
            features: ['Vista al mar', 'Balcón', 'Piscina edificio', 'Gimnasio'],
            images: ['/placeholder9.jpg', '/placeholder10.jpg'],
            monthlyRevenue: 0,
            occupancyRate: 0,
            totalRevenue: 3600000,
            lastMaintenance: '2024-04-01',
            nextMaintenance: '2024-10-01',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 250).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
            views: 1100,
            inquiries: 34,
            featured: true
          },
          {
            id: '6',
            title: 'Casa Familiar La Reina',
            description: 'Acogedora casa familiar en La Reina',
            type: 'house',
            address: 'Calle Los Leones 345',
            city: 'Santiago',
            neighborhood: 'La Reina',
            price: 900000,
            status: 'available',
            bedrooms: 3,
            bathrooms: 2,
            area: 150,
            features: ['Patio', 'Estacionamiento', 'Calefacción', 'Bodega'],
            images: ['/placeholder11.jpg', '/placeholder12.jpg'],
            monthlyRevenue: 0,
            occupancyRate: 0,
            totalRevenue: 0,
            lastMaintenance: '2024-03-15',
            nextMaintenance: '2024-09-15',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            views: 780,
            inquiries: 19,
            featured: false
          }
        ];

        setProperties(mockProperties);

        // Calculate stats
        const totalProperties = mockProperties.length;
        const availableProperties = mockProperties.filter(p => p.status === 'available').length;
        const rentedProperties = mockProperties.filter(p => p.status === 'rented').length;
        const maintenanceProperties = mockProperties.filter(p => p.status === 'maintenance').length;
        const totalMonthlyRevenue = mockProperties.reduce((sum, p) => sum + p.monthlyRevenue, 0);
        const totalRevenue = mockProperties.reduce((sum, p) => sum + p.totalRevenue, 0);
        const averageOccupancy = mockProperties.reduce((sum, p) => sum + p.occupancyRate, 0) / totalProperties;
        
        // Find top performing property
        const topProperty = mockProperties
          .filter(p => p.status === 'rented')
          .sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
        
        // Properties needing attention (maintenance or available for too long)
        const propertiesNeedingAttention = mockProperties.filter(p => 
          p.status === 'maintenance' || 
          (p.status === 'available' && new Date(p.createdAt) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        ).length;

        const propertyStats: PropertyStats = {
          totalProperties,
          availableProperties,
          rentedProperties,
          maintenanceProperties,
          totalMonthlyRevenue,
          totalRevenue,
          averageOccupancy,
          topPerformingProperty: topProperty?.title || '',
          propertiesNeedingAttention
        };

        setStats(propertyStats);
        setLoading(false);
      } catch (error) {
        console.error('Error loading properties:', error);
        setLoading(false);
      }
    };

    loadUserData();
    loadProperties();
  }, []);

  const updatePropertyStatus = async (propertyId: string, newStatus: string) => {
    setProperties(prev => prev.map(property => 
      property.id === propertyId 
        ? { ...property, status: newStatus as Property['status'] }
        : property
    ));
  };

  const toggleFeatured = async (propertyId: string) => {
    setProperties(prev => prev.map(property => 
      property.id === propertyId 
        ? { ...property, featured: !property.featured }
        : property
    ));
  };

  const deleteProperty = async (propertyId: string) => {
    setProperties(prev => prev.filter(property => property.id !== propertyId));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return <Building className="w-5 h-5" />;
      case 'house':
        return <Home className="w-5 h-5" />;
      case 'office':
        return <Briefcase className="w-5 h-5" />;
      case 'commercial':
        return <Store className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'apartment':
        return 'Departamento';
      case 'house':
        return 'Casa';
      case 'office':
        return 'Oficina';
      case 'commercial':
        return 'Comercial';
      default:
        return 'Otro';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rented':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unavailable':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'rented':
        return <Badge className="bg-blue-100 text-blue-800">Arrendado</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Mantenimiento</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-800">No disponible</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-CL');
  };

  const filteredProperties = properties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter || property.type === filter;
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.tenantName && property.tenantName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedDashboardLayout
      user={user}
      title="Mis Propiedades"
      subtitle="Gestiona todas tus propiedades"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header with stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Propiedades</h1>
            <p className="text-gray-600">Gestiona todas tus propiedades</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" asChild>
              <Link href="/owner/properties/new">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Propiedad
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Propiedades</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <Building className="w-3 h-3 mr-1" />
                    {stats.rentedProperties} arrendadas
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalMonthlyRevenue)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {formatPercentage(stats.averageOccupancy)} ocupación
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableProperties}</p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Listas para arrendar
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Atención Requerida</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.propertiesNeedingAttention}</p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Mantenimiento o disponibles
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar propiedades..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">Todas</option>
              <option value="available">Disponibles</option>
              <option value="rented">Arrendadas</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="apartment">Departamentos</option>
              <option value="house">Casas</option>
              <option value="office">Oficinas</option>
              <option value="commercial">Comerciales</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No se encontraron propiedades</p>
                    <p className="text-sm text-gray-400">Intenta ajustar tus filtros de búsqueda</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <Card key={property.id} className={`border-l-4 ${getStatusColor(property.status)} ${property.featured ? 'ring-2 ring-yellow-200' : ''}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${getStatusColor(property.status)}`}>
                        {getTypeIcon(property.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{property.title}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusBadge(property.status)}
                          <Badge variant="outline" className="text-xs">
                            {getTypeName(property.type)}
                          </Badge>
                          {property.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1" />
                              Destacada
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => toggleFeatured(property.id)}>
                        <Star className={`w-4 h-4 ${property.featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Property Image */}
                  <div className="relative h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image className="w-16 h-16 text-gray-400" alt="" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black bg-opacity-70 text-white text-xs">
                        {property.images.length} fotos
                      </Badge>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">{formatPrice(property.price)}</span>
                      <span className="text-sm text-gray-600">/mes</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{property.neighborhood}, {property.city}</span>
                    </div>
                    
                    {property.status === 'rented' && property.tenantName && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Users className="w-4 h-4" />
                        <span>{property.tenantName}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {property.bedrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        <span>{property.area}m²</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Info */}
                  {property.status === 'rented' && (
                    <div className="bg-green-50 p-3 rounded-lg mb-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-800">Ingreso mensual:</span>
                        <span className="font-bold text-green-900">{formatPrice(property.monthlyRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-green-700 mt-1">
                        <span>Total generado:</span>
                        <span>{formatPrice(property.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-green-700 mt-1">
                        <span>Tasa ocupación:</span>
                        <span>{formatPercentage(property.occupancyRate)}</span>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {property.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {property.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{property.features.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Maintenance Info */}
                  {property.status === 'maintenance' && (
                    <div className="bg-yellow-50 p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2 text-sm text-yellow-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span>En mantenimiento</span>
                      </div>
                      {property.nextMaintenance && (
                        <div className="text-xs text-yellow-700 mt-1">
                          Próximo mantenimiento: {new Date(property.nextMaintenance).toLocaleDateString('es-CL')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{property.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>{property.inquiries} consultas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Actualizado {formatRelativeTime(property.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    {property.status === 'rented' && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/owner/contracts/${property.id}`}>
                          <FileText className="w-4 h-4" />
                        </Link>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => deleteProperty(property.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </EnhancedDashboardLayout>
  );
}