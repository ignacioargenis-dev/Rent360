'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Search,
  Plus,
  Loader2
} from 'lucide-react';
import { Payment } from '@/types';
import KhipuPayment from '@/components/payments/KhipuPayment';

interface PaymentResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function TenantPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchPayments();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    filterPayments();
  }, [payments, searchQuery, statusFilter, methodFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments');
      if (!response.ok) {
        throw new Error('Error al cargar pagos');
      }
      const data: PaymentResponse = await response.json();
      setPayments(data.payments || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Error al cargar los pagos. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Apply method filter
    if (methodFilter) {
      filtered = filtered.filter(payment => payment.method === methodFilter);
    }

    setPayments(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800">Fallido</Badge>;
      case 'REFUNDED':
        return <Badge className="bg-blue-100 text-blue-800">Reembolsado</Badge>;
      case 'PARTIAL':
        return <Badge className="bg-orange-100 text-orange-800">Parcial</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMethodBadge = (method?: string) => {
    switch (method) {
      case 'CASH':
        return <Badge className="bg-green-100 text-green-800">Efectivo</Badge>;
      case 'BANK_TRANSFER':
        return <Badge className="bg-blue-100 text-blue-800">Transferencia</Badge>;
      case 'CREDIT_CARD':
        return <Badge className="bg-purple-100 text-purple-800">Tarjeta Crédito</Badge>;
      case 'DEBIT_CARD':
        return <Badge className="bg-orange-100 text-orange-800">Tarjeta Débito</Badge>;
      case 'CHECK':
        return <Badge className="bg-gray-100 text-gray-800">Cheque</Badge>;
      default:
        return <Badge variant="outline">No especificado</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPaymentStats = () => {
    const totalPaid = payments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingPayments = payments.filter(p => p.status === 'PENDING');
    const overduePayments = payments.filter(p => 
      p.status === 'PENDING' && new Date(p.dueDate) < new Date()
    );

    return {
      totalPaid,
      pendingCount: pendingPayments.length,
      overdueCount: overduePayments.length,
      pendingAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0)
    };
  };

  const stats = getPaymentStats();

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    // Refresh payments after successful payment
    fetchPayments();
    setShowPaymentDialog(false);
    setSelectedPayment(null);
    alert('¡Pago realizado con éxito!');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Error al realizar el pago: ' + error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error al cargar pagos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchPayments}>Intentar nuevamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Pagos</h1>
              <p className="text-gray-600">Gestiona y sigue el estado de tus pagos</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Realizar Pago
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pagado</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalPaid)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vencidos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdueCount}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monto Pendiente</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(stats.pendingAmount)}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar pagos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="COMPLETED">Completado</SelectItem>
                  <SelectItem value="FAILED">Fallido</SelectItem>
                  <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                  <SelectItem value="PARTIAL">Parcial</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los métodos</SelectItem>
                  <SelectItem value="CASH">Efectivo</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Transferencia</SelectItem>
                  <SelectItem value="CREDIT_CARD">Tarjeta Crédito</SelectItem>
                  <SelectItem value="DEBIT_CARD">Tarjeta Débito</SelectItem>
                  <SelectItem value="CHECK">Cheque</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setMethodFilter('');
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <div className="space-y-4">
          {payments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay pagos registrados</h3>
                <p className="text-gray-600 mb-4">
                  Aún no tienes ningún pago registrado en el sistema
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Realizar Primer Pago
                </Button>
              </CardContent>
            </Card>
          ) : (
            payments.map((payment) => (
              <Card key={payment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(payment.status)}
                          {payment.method && getMethodBadge(payment.method)}
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Vencimiento: {formatDate(payment.dueDate)}</span>
                        </div>
                        {payment.paidDate && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Pagado: {formatDate(payment.paidDate)}</span>
                          </div>
                        )}
                        {payment.method && (
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span>{payment.method}</span>
                          </div>
                        )}
                      </div>
                      
                      {payment.notes && (
                        <p className="text-sm text-gray-600 mt-2">{payment.notes}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {payment.status === 'PENDING' && (
                        <Button 
                          size="sm"
                          onClick={() => handlePaymentClick(payment)}
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pagar
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Comprobante
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Realizar Pago</DialogTitle>
          </DialogHeader>
          {selectedPayment && user && (
            <KhipuPayment
              amount={selectedPayment.amount}
              currency="CLP"
              subject={`Pago de arriendo - ${selectedPayment.id}`}
              description={`Pago correspondiente al contrato ${selectedPayment.contractId}`}
              payerEmail={user.email}
              payerName={user.name}
              contractId={selectedPayment.contractId}
              userId={user.id}
              returnUrl={`${window.location.origin}/tenant/payments?success=true`}
              cancelUrl={`${window.location.origin}/tenant/payments?cancelled=true`}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}