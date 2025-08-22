'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  DollarSign, 
  Home,
  User as UserIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Users,
  Star,
  Handshake,
  Target,
  Award
} from 'lucide-react';
import { User, Contract, Property } from '@/types';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useUserState } from '@/hooks/useUserState';

interface ContractWithDetails extends Contract {
  property?: Property;
  ownerName?: string;
  ownerEmail?: string;
  tenantName?: string;
  tenantEmail?: string;
  brokerCommission: number;
  brokerCommissionRate: number;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED' | 'CANCELLED';
}

interface ContractStats {
  totalContracts: number;
  activeContracts: number;
  pendingContracts: number;
  completedContracts: number;
  totalCommission: number;
  averageCommissionRate: number;
  successRate: number;
}

export default function BrokerContractsPage() {
  const { user, loading: userLoading } = useUserState();
  const [contracts, setContracts] = useState<ContractWithDetails[]>([]);
  const [stats, setStats] = useState<ContractStats>({
    totalContracts: 0,
    activeContracts: 0,
    pendingContracts: 0,
    completedContracts: 0,
    totalCommission: 0,
    averageCommissionRate: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data for demo
    setTimeout(() => {
      const mockContracts: ContractWithDetails[] = [
        {
          id: '1',
          propertyId: '1',
          tenantId: '2',
          ownerId: '3',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          monthlyRent: 550000,
          deposit: 550000,
          status: 'ACTIVE',
          createdAt: '2023-12-15',
          updatedAt: '2024-01-01',
          brokerCommission: 330000,
          brokerCommissionRate: 5,
          property: {
            id: '1',
            title: 'Departamento Las Condes',
            address: 'Av. Apoquindo 3400, Las Condes',
            city: 'Santiago',
            commune: 'Las Condes',
            region: 'Metropolitana',
            price: 550000,
            deposit: 550000,
            bedrooms: 2,
            bathrooms: 2,
            area: 85,
            status: 'RENTED',
            images: [],
            features: ['Estacionamiento', 'Bodega', 'Gimnasio'],
            ownerId: '3',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          ownerName: 'María González',
          ownerEmail: 'maria@ejemplo.com',
          tenantName: 'Carlos Ramírez',
          tenantEmail: 'carlos@ejemplo.com'
        },
        {
          id: '2',
          propertyId: '2',
          tenantId: '4',
          ownerId: '5',
          startDate: '2023-06-01',
          endDate: '2024-05-31',
          monthlyRent: 350000,
          deposit: 350000,
          status: 'ACTIVE',
          createdAt: '2023-05-15',
          updatedAt: '2023-06-01',
          brokerCommission: 210000,
          brokerCommissionRate: 6,
          property: {
            id: '2',
            title: 'Oficina Providencia',
            address: 'Av. Providencia 1245, Providencia',
            city: 'Santiago',
            commune: 'Providencia',
            region: 'Metropolitana',
            price: 350000,
            deposit: 350000,
            bedrooms: 1,
            bathrooms: 1,
            area: 45,
            status: 'RENTED',
            images: [],
            features: ['Seguridad 24/7', 'Recepción'],
            ownerId: '5',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          ownerName: 'Empresa Soluciones Ltda.',
          ownerEmail: 'contacto@soluciones.cl',
          tenantName: 'Ana Martínez',
          tenantEmail: 'ana@ejemplo.com'
        },
        {
          id: '3',
          propertyId: '3',
          tenantId: '6',
          ownerId: '7',
          startDate: '2024-02-01',
          endDate: '2025-01-31',
          monthlyRent: 1200000,
          deposit: 1200000,
          status: 'PENDING',
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20',
          brokerCommission: 720000,
          brokerCommissionRate: 5,
          property: {
            id: '3',
            title: 'Casa Vitacura',
            address: 'Av. Vitacura 8900, Vitacura',
            city: 'Santiago',
            commune: 'Vitacura',
            region: 'Metropolitana',
            price: 1200000,
            deposit: 1200000,
            bedrooms: 4,
            bathrooms: 3,
            area: 200,
            status: 'AVAILABLE',
            images: [],
            features: ['Jardín', 'Piscina', 'Estacionamiento'],
            ownerId: '7',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          ownerName: 'Pedro Silva',
          ownerEmail: 'pedro@ejemplo.com',
          tenantName: 'Laura Fernández',
          tenantEmail: 'laura@ejemplo.com'
        },
        {
          id: '4',
          propertyId: '4',
          tenantId: '8',
          ownerId: '9',
          startDate: '2023-03-01',
          endDate: '2024-02-29',
          monthlyRent: 800000,
          deposit: 800000,
          status: 'COMPLETED',
          createdAt: '2023-02-15',
          updatedAt: '2023-03-01',
          brokerCommission: 480000,
          brokerCommissionRate: 6,
          property: {
            id: '4',
            title: 'Departamento Providencia',
            address: 'Av. Providencia 2345, Providencia',
            city: 'Santiago',
            commune: 'Providencia',
            region: 'Metropolitana',
            price: 800000,
            deposit: 800000,
            bedrooms: 3,
            bathrooms: 2,
            area: 120,
            status: 'AVAILABLE',
            images: [],
            features: ['Balcón', 'Gimnasio'],
            ownerId: '9',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          ownerName: 'Carmen López',
          ownerEmail: 'carmen@ejemplo.com',
          tenantName: 'Roberto Gómez',
          tenantEmail: 'roberto@ejemplo.com'
        }
      ];

      setContracts(mockContracts);
      
      // Calculate stats
      const totalContracts = mockContracts.length;
      const activeContracts = mockContracts.filter(c => c.status === 'ACTIVE').length;
      const pendingContracts = mockContracts.filter(c => c.status === 'PENDING').length;
      const completedContracts = mockContracts.filter(c => c.status === 'COMPLETED').length;
      const totalCommission = mockContracts.reduce((sum, c) => sum + c.brokerCommission, 0);
      const averageCommissionRate = mockContracts.reduce((sum, c) => sum + c.brokerCommissionRate, 0) / mockContracts.length;
      const successRate = (completedContracts / totalContracts) * 100;

      setStats({
        totalContracts,
        activeContracts,
        pendingContracts,
        completedContracts,
        totalCommission,
        averageCommissionRate: Number(averageCommissionRate.toFixed(1)),
        successRate: Number(successRate.toFixed(1))
      });

      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
      case 'DRAFT':
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-blue-100 text-blue-800">Completado</Badge>;
      case 'TERMINATED':
        return <Badge className="bg-red-100 text-red-800">Terminado</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-purple-100 text-purple-800">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.tenantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || 
                       (typeFilter === 'active' && contract.status === 'ACTIVE') ||
                       (typeFilter === 'pending' && contract.status === 'PENDING') ||
                       (typeFilter === 'completed' && contract.status === 'COMPLETED');
    return matchesSearch && matchesStatus && matchesType;
  });

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contratos...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader 
        user={user}
        title="Contratos de Corredor"
        subtitle="Gestiona todos tus contratos y comisiones"
      />

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contratos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalContracts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeContracts}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingContracts}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Comisión Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.totalCommission)}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Comisión Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageCommissionRate}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasa Éxito</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resumen de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.activeContracts}
                </div>
                <div className="text-sm text-green-700">Contratos Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatPrice(stats.totalCommission)}
                </div>
                <div className="text-sm text-blue-700">Comisión Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats.averageCommissionRate}%
                </div>
                <div className="text-sm text-purple-700">Comisión Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {stats.successRate}%
                </div>
                <div className="text-sm text-indigo-700">Tasa de Éxito</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por propiedad, propietario o inquilino..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="DRAFT">Borrador</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="ACTIVE">Activo</option>
                  <option value="COMPLETED">Completado</option>
                  <option value="TERMINATED">Terminado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="active">Activos</option>
                  <option value="pending">Pendientes</option>
                  <option value="completed">Completados</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Contrato
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <div className="space-y-4">
          {filteredContracts.map((contract) => {
            const daysUntilExpiry = getDaysUntilExpiry(contract.endDate);
            const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
            
            return (
              <Card key={contract.id} className={`hover:shadow-lg transition-shadow ${isExpiringSoon ? 'border-orange-200 bg-orange-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {contract.property?.title}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            {contract.property?.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(contract.status)}
                          {isExpiringSoon && (
                            <Badge className="bg-orange-100 text-orange-800">
                              Expira pronto
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Arriendo mensual</p>
                          <p className="font-semibold text-gray-900">{formatPrice(contract.monthlyRent)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Comisión</p>
                          <p className="font-semibold text-purple-900">
                            {formatPrice(contract.brokerCommission)} ({contract.brokerCommissionRate}%)
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Periodo</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tiempo restante</p>
                          <p className={`font-semibold ${daysUntilExpiry > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} días` : 'Expirado'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Propietario</p>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{contract.ownerName}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Inquilino</p>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{contract.tenantName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Creado: {formatDate(contract.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Handshake className="w-4 h-4" />
                          <span>Tu comisión: {formatPrice(contract.brokerCommission)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </Button>
                      {contract.status === 'PENDING' && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Seguimiento
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredContracts.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron contratos
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Intenta ajustar tus filtros de búsqueda.'
                  : 'Aún no tienes contratos gestionados.'
                }
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Crear Nuevo Contrato
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}