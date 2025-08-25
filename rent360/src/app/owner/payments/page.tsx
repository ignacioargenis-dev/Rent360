'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
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
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  FileText,
  AlertTriangle,
  Banknote,
  Receipt
} from 'lucide-react';
import { User, Payment, Property, Contract } from '@/types';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useUserState } from '@/hooks/useUserState';

interface PaymentWithDetails extends Payment {
  property?: Property;
  contract?: Contract;
  tenantName?: string;
  tenantEmail?: string;
}

interface PaymentStats {
  totalReceived: number;
  pendingAmount: number;
  overdueAmount: number;
  thisMonthReceived: number;
  averagePaymentTime: number;
}

export default function OwnerPaymentsPage() {
  const { user, loading: userLoading } = useUserState();
  const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    totalReceived: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    thisMonthReceived: 0,
    averagePaymentTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    // Mock data for demo
    setTimeout(() => {
      const mockPayments: PaymentWithDetails[] = [
        {
          id: '1',
          contractId: '1',
          amount: 550000,
          method: 'transfer',
          status: 'COMPLETED',
          dueDate: '2024-03-01',
          paidDate: '2024-03-01',
          createdAt: '2024-02-28',
          updatedAt: '2024-03-01',
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
            ownerId: '1',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          tenantName: 'Carlos Ramírez',
          tenantEmail: 'carlos@ejemplo.com'
        },
        {
          id: '2',
          contractId: '2',
          amount: 350000,
          method: 'khipu',
          status: 'COMPLETED',
          dueDate: '2024-03-05',
          paidDate: '2024-03-04',
          createdAt: '2024-03-01',
          updatedAt: '2024-03-04',
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
            ownerId: '1',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          tenantName: 'Empresa Soluciones Ltda.',
          tenantEmail: 'contacto@soluciones.cl'
        },
        {
          id: '3',
          contractId: '1',
          amount: 550000,
          method: 'transfer',
          status: 'PENDING',
          dueDate: '2024-04-01',
          paidDate: null,
          createdAt: '2024-03-28',
          updatedAt: '2024-03-28',
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
            ownerId: '1',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          tenantName: 'Carlos Ramírez',
          tenantEmail: 'carlos@ejemplo.com'
        },
        {
          id: '4',
          contractId: '2',
          amount: 350000,
          method: 'transfer',
          status: 'OVERDUE',
          dueDate: '2024-02-05',
          paidDate: null,
          createdAt: '2024-02-01',
          updatedAt: '2024-02-20',
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
            ownerId: '1',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          tenantName: 'Empresa Soluciones Ltda.',
          tenantEmail: 'contacto@soluciones.cl'
        }
      ];

      setPayments(mockPayments);
      
      // Calculate stats
      const totalReceived = mockPayments
        .filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const pendingAmount = mockPayments
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const overdueAmount = mockPayments
        .filter(p => p.status === 'OVERDUE')
        .reduce((sum, p) => sum + p.amount, 0);
      
      const thisMonthReceived = mockPayments
        .filter(p => {
          const paidDate = new Date(p.paidDate || '');
          const now = new Date();
          return p.status === 'COMPLETED' && 
                 paidDate.getMonth() === now.getMonth() && 
                 paidDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, p) => sum + p.amount, 0);

      setStats({
        totalReceived,
        pendingAmount,
        overdueAmount,
        thisMonthReceived,
        averagePaymentTime: 2.5
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
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'OVERDUE':
        return <Badge className="bg-red-100 text-red-800">Atrasado</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'transfer':
        return <Badge className="bg-blue-100 text-blue-800">Transferencia</Badge>;
      case 'khipu':
        return <Badge className="bg-purple-100 text-purple-800">Khipu</Badge>;
      case 'cash':
        return <Badge className="bg-green-100 text-green-800">Efectivo</Badge>;
      case 'check':
        return <Badge className="bg-orange-100 text-orange-800">Cheque</Badge>;
      default:
        return <Badge>{method}</Badge>;
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.tenantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.dueDate);
      const now = new Date();
      
      switch (dateFilter) {
        case 'thisMonth':
          matchesDate = paymentDate.getMonth() === now.getMonth() && 
                        paymentDate.getFullYear() === now.getFullYear();
          break;
        case 'lastMonth':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          matchesDate = paymentDate >= lastMonth && paymentDate < new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'overdue':
          matchesDate = payment.status === 'OVERDUE';
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader 
        user={user}
        title="Gestión de Pagos"
        subtitle="Monitorea y gestiona todos los pagos de arriendo"
      />

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Recibido</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.totalReceived)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.pendingAmount)}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Atrasados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.overdueAmount)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Este Mes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.thisMonthReceived)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averagePaymentTime}d
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Resumen de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {payments.filter(p => p.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-green-700">Pagos Completados</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {payments.filter(p => p.status === 'PENDING').length}
                </div>
                <div className="text-sm text-yellow-700">Pagos Pendientes</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {payments.filter(p => p.status === 'OVERDUE').length}
                </div>
                <div className="text-sm text-red-700">Pagos Atrasados</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-blue-700">Tasa de Pago</div>
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
                    placeholder="Buscar por propiedad o inquilino..."
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
                  <option value="COMPLETED">Completados</option>
                  <option value="PENDING">Pendientes</option>
                  <option value="OVERDUE">Atrasados</option>
                  <option value="CANCELLED">Cancelados</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">Todas las fechas</option>
                  <option value="thisMonth">Este mes</option>
                  <option value="lastMonth">Mes pasado</option>
                  <option value="overdue">Atrasados</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.map((payment) => {
            const daysOverdue = getDaysOverdue(payment.dueDate);
            
            return (
              <Card key={payment.id} className={`hover:shadow-lg transition-shadow ${
                payment.status === 'OVERDUE' ? 'border-red-200 bg-red-50' : ''
              }`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {payment.property?.title}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            {payment.property?.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(payment.status)}
                          {payment.status === 'OVERDUE' && (
                            <Badge className="bg-red-100 text-red-800">
                              {daysOverdue} días atrasado
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Monto</p>
                          <p className="font-semibold text-gray-900">{formatPrice(payment.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
                          <p className="font-semibold text-gray-900">{formatDate(payment.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Método de Pago</p>
                          <div>{getMethodBadge(payment.method)}</div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fecha de Pago</p>
                          <p className="font-semibold text-gray-900">
                            {payment.paidDate ? formatDate(payment.paidDate) : 'No pagado'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>Inquilino: {payment.tenantName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Creado: {formatDate(payment.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                      <Button size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Receipt className="w-4 h-4 mr-2" />
                        Comprobante
                      </Button>
                      {payment.status === 'PENDING' && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Enviar Recordatorio
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron pagos
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Intenta ajustar tus filtros de búsqueda.'
                  : 'Aún no hay registros de pagos.'
                }
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Pago Manual
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}