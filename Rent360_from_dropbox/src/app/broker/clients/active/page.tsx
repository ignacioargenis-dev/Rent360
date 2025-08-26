'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  MessageSquare,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@/types';

interface ActiveClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'prospect';
  totalProperties: number;
  activeContracts: number;
  totalSpent: number;
  lastActivity: string;
  joinDate: string;
  averageRating: number;
  preferences: {
    propertyTypes: string[];
    priceRange: { min: number; max: number };
    locations: string[];
  };
  nextAppointment?: string;
}

export default function BrokerActiveClients() {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<ActiveClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<ActiveClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  useEffect(() => {
    // Load user data
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

    // Load clients data
    const loadClientsData = async () => {
      try {
        // Mock data for demonstration
        const mockClients: ActiveClient[] = [
          {
            id: '1',
            name: 'María González',
            email: 'maria.gonzalez@email.com',
            phone: '+56 9 1234 5678',
            avatar: 'https://ui-avatars.com/api/?name=María+González&background=0D8ABC&color=fff',
            status: 'active',
            totalProperties: 3,
            activeContracts: 2,
            totalSpent: 2500000,
            lastActivity: '2024-01-15T10:30:00',
            joinDate: '2023-08-15T00:00:00',
            averageRating: 4.8,
            preferences: {
              propertyTypes: ['apartment', 'house'],
              priceRange: { min: 300000, max: 800000 },
              locations: ['Providencia', 'Las Condes']
            },
            nextAppointment: '2024-01-20T14:00:00'
          },
          {
            id: '2',
            name: 'Juan Pérez',
            email: 'juan.perez@email.com',
            phone: '+56 9 2345 6789',
            avatar: 'https://ui-avatars.com/api/?name=Juan+Pérez&background=28a745&color=fff',
            status: 'active',
            totalProperties: 2,
            activeContracts: 1,
            totalSpent: 1800000,
            lastActivity: '2024-01-14T16:45:00',
            joinDate: '2023-09-20T00:00:00',
            averageRating: 4.5,
            preferences: {
              propertyTypes: ['apartment'],
              priceRange: { min: 250000, max: 500000 },
              locations: ['Santiago Centro', 'Ñuñoa']
            }
          },
          {
            id: '3',
            name: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            phone: '+56 9 3456 7890',
            avatar: 'https://ui-avatars.com/api/?name=Ana+Martínez&background=dc3545&color=fff',
            status: 'active',
            totalProperties: 4,
            activeContracts: 3,
            totalSpent: 3200000,
            lastActivity: '2024-01-16T11:20:00',
            joinDate: '2023-07-10T00:00:00',
            averageRating: 4.9,
            preferences: {
              propertyTypes: ['house', 'apartment'],
              priceRange: { min: 400000, max: 1200000 },
              locations: ['Las Condes', 'Vitacura', 'Lo Barnechea']
            },
            nextAppointment: '2024-01-18T10:00:00'
          },
          {
            id: '4',
            name: 'Carlos López',
            email: 'carlos.lopez@email.com',
            phone: '+56 9 4567 8901',
            avatar: 'https://ui-avatars.com/api/?name=Carlos+López&background=ffc107&color=fff',
            status: 'active',
            totalProperties: 1,
            activeContracts: 1,
            totalSpent: 950000,
            lastActivity: '2024-01-13T09:15:00',
            joinDate: '2023-11-05T00:00:00',
            averageRating: 4.2,
            preferences: {
              propertyTypes: ['studio'],
              priceRange: { min: 150000, max: 350000 },
              locations: ['Providencia', 'Ñuñoa']
            }
          },
          {
            id: '5',
            name: 'Laura Silva',
            email: 'laura.silva@email.com',
            phone: '+56 9 5678 9012',
            avatar: 'https://ui-avatars.com/api/?name=Laura+Silva&background=6f42c1&color=fff',
            status: 'prospect',
            totalProperties: 0,
            activeContracts: 0,
            totalSpent: 0,
            lastActivity: '2024-01-12T15:30:00',
            joinDate: '2024-01-10T00:00:00',
            averageRating: 0,
            preferences: {
              propertyTypes: ['apartment', 'studio'],
              priceRange: { min: 200000, max: 600000 },
              locations: ['Providencia', 'Santiago Centro']
            },
            nextAppointment: '2024-01-19T16:00:00'
          }
        ];

        setClients(mockClients);
        setFilteredClients(mockClients);
      } catch (error) {
        console.error('Error loading clients data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadClientsData();
  }, []);

  useEffect(() => {
    // Filter and sort clients
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Sort clients
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'activeContracts':
          return b.activeContracts - a.activeContracts;
        case 'lastActivity':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        case 'rating':
          return b.averageRating - a.averageRating;
        default:
          return 0;
      }
    });

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
      case 'prospect':
        return <Badge className="bg-blue-100 text-blue-800">Prospecto</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getActiveClientsStats = () => {
    const activeClients = clients.filter(c => c.status === 'active');
    const totalSpent = activeClients.reduce((sum, client) => sum + client.totalSpent, 0);
    const totalContracts = activeClients.reduce((sum, client) => sum + client.activeContracts, 0);
    const avgRating = activeClients.length > 0 
      ? activeClients.reduce((sum, client) => sum + client.averageRating, 0) / activeClients.length 
      : 0;

    return {
      count: activeClients.length,
      totalSpent,
      totalContracts,
      avgRating: avgRating.toFixed(1)
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes activos...</p>
        </div>
      </div>
    );
  }

  const stats = getActiveClientsStats();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Clientes Activos</h1>
            <p className="text-gray-600">Gestiona tus clientes con contratos activos</p>
          </div>
          <div className="flex gap-2">
            <Link href="/broker/clients">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Todos los Clientes
              </Button>
            </Link>
            <Link href="/broker/clients/prospects">
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Prospectos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContracts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSpent)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRating}/5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="prospect">Prospectos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="totalSpent">Monto gastado</SelectItem>
                <SelectItem value="activeContracts">Contratos activos</SelectItem>
                <SelectItem value="lastActivity">Última actividad</SelectItem>
                <SelectItem value="rating">Calificación</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {client.avatar ? (
                      <img 
                        src={client.avatar} 
                        alt={client.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {getInitials(client.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      {getStatusBadge(client.status)}
                      {client.averageRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{client.averageRating}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Cliente desde: {formatDate(client.joinDate)}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div className="text-sm">
                        <p className="text-gray-600">Propiedades</p>
                        <p className="font-medium">{client.totalProperties}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Contratos Activos</p>
                        <p className="font-medium text-green-600">{client.activeContracts}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600">Total Gastado</p>
                        <p className="font-medium text-purple-600">{formatPrice(client.totalSpent)}</p>
                      </div>
                    </div>

                    {client.preferences.propertyTypes.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Preferencias:</p>
                        <div className="flex flex-wrap gap-2">
                          {client.preferences.propertyTypes.map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type === 'apartment' ? 'Departamento' : 
                               type === 'house' ? 'Casa' : 
                               type === 'studio' ? 'Studio' : type}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-xs">
                            {formatPrice(client.preferences.priceRange.min)} - {formatPrice(client.preferences.priceRange.max)}
                          </Badge>
                          {client.preferences.locations.map((location, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Última actividad: {formatDateTime(client.lastActivity)}</span>
                      </div>
                      {client.nextAppointment && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Calendar className="w-4 h-4" />
                          <span>Próxima cita: {formatDateTime(client.nextAppointment)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/broker/clients/${client.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Mensaje
                  </Button>
                  <Button size="sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Citar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron clientes</h3>
              <p className="text-gray-600 mb-6">
                No hay clientes que coincidan con los filtros seleccionados.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSortBy('name');
              }}>
                <Filter className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}