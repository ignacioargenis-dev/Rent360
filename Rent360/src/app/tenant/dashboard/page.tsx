'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  FileText, 
  CreditCard, 
  Star, 
  MessageCircle, 
  Calendar,
  MapPin,
  DollarSign,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { User, Property } from '@/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import QuickActionCard from '@/components/dashboard/QuickActionCard';
import ActivityItem from '@/components/dashboard/ActivityItem';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';
import { useUserState } from '@/hooks/useUserState';

interface DashboardStats {
  activeContracts: number;
  nextPayment: {
    amount: number;
    dueDate: string;
    status: string;
  };
  pendingMessages: number;
  averageRating: number;
}

interface RecentActivity {
  id: string;
  type: 'payment' | 'message' | 'contract' | 'rating';
  title: string;
  description: string;
  date: string;
  status?: string;
}

export default function TenantDashboard() {
  const { user, loading: userLoading } = useUserState();
  const [stats, setStats] = useState<DashboardStats>({
    activeContracts: 0,
    nextPayment: { amount: 0, dueDate: '', status: '' },
    pendingMessages: 0,
    averageRating: 0
  });
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo
    setTimeout(() => {
      setStats({
        activeContracts: 1,
        nextPayment: {
          amount: 550000,
          dueDate: '2024-04-15',
          status: 'PENDING'
        },
        pendingMessages: 3,
        averageRating: 4.5
      });

      setCurrentProperty({
        id: '1',
        title: 'Departamento Las Condes',
        description: 'Hermoso departamento en Las Condes con vista panorámica',
        address: 'Av. Apoquindo 3400, Las Condes',
        city: 'Santiago',
        commune: 'Las Condes',
        region: 'Metropolitana',
        price: 550000,
        deposit: 550000,
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        status: 'AVAILABLE',
        images: [],
        features: ['Estacionamiento', 'Bodega', 'Gimnasio'],
        ownerId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setRecentActivity([
        {
          id: '1',
          type: 'payment',
          title: 'Pago realizado',
          description: 'Pago de arriendo marzo 2024',
          date: '2024-03-15',
          status: 'COMPLETED'
        },
        {
          id: '2',
          type: 'message',
          title: 'Nuevo mensaje',
          description: 'Mensaje de María González',
          date: '2024-03-14'
        },
        {
          id: '3',
          type: 'contract',
          title: 'Contrato firmado',
          description: 'Contrato de arriendo anual firmado',
          date: '2024-03-10',
          status: 'ACTIVE'
        }
      ]);

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
      month: 'long',
      day: 'numeric'
    });
  };

  // Icon mapping for activity items
  const iconMap = {
    payment: CreditCard,
    message: MessageCircle,
    contract: FileText,
    rating: Star,
    default: Star
  };

  // Color mapping for activity items
  const colorMap = {
    payment: 'text-green-600 bg-green-50',
    message: 'text-blue-600 bg-blue-50',
    contract: 'text-purple-600 bg-purple-50',
    rating: 'text-yellow-600 bg-yellow-50',
    default: 'text-gray-600 bg-gray-50'
  };

  // Status badge mapping
  const statusBadgeMap = {
    COMPLETED: <Badge className="bg-green-100 text-green-800">Completado</Badge>,
    PENDING: <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>,
    ACTIVE: <Badge className="bg-blue-100 text-blue-800">Activo</Badge>,
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedDashboardLayout
      user={user}
      title="Panel de Control de Inquilino"
      subtitle="Gestiona tus arriendos y propiedades"
      notificationCount={stats.pendingMessages}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Contratos Activos"
            value={stats.activeContracts}
            icon={FileText}
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            title="Próximo Pago"
            value={formatPrice(stats.nextPayment.amount)}
            subtitle={formatDate(stats.nextPayment.dueDate)}
            icon={CreditCard}
            iconColor="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            title="Mensajes Pendientes"
            value={stats.pendingMessages}
            icon={MessageCircle}
            iconColor="text-purple-600"
            bgColor="bg-purple-100"
          />
          <StatCard
            title="Mi Calificación"
            value={stats.averageRating}
            icon={Star}
            iconColor="text-yellow-600"
            bgColor="bg-yellow-100"
          />
        </div>

        {/* Current Property */}
        {currentProperty && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Mi Propiedad Actual
              </CardTitle>
              <CardDescription>
                Información sobre tu arriendo actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <Home className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-2">{currentProperty.title}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{currentProperty.address}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Arriendo mensual</p>
                      <p className="font-semibold text-lg">{formatPrice(currentProperty.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Depósito</p>
                      <p className="font-semibold text-lg">{formatPrice(currentProperty.deposit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dormitorios</p>
                      <p className="font-semibold text-lg">{currentProperty.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Baños</p>
                      <p className="font-semibold text-lg">{currentProperty.bathrooms}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Contrato
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contactar Propietario
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={Search}
              title="Buscar Propiedades"
              description="Explora nuevas propiedades disponibles"
              href="/properties/search"
              color="blue"
            />
            <QuickActionCard
              icon={CreditCard}
              title="Realizar Pago"
              description="Paga tu arriendo mensual"
              href="/tenant/payments"
              color="green"
            />
            <QuickActionCard
              icon={FileText}
              title="Mis Contratos"
              description="Gestiona tus contratos de arriendo"
              href="/tenant/contracts"
              color="purple"
            />
            <QuickActionCard
              icon={MessageCircle}
              title="Mensajes"
              description="Comunícate con propietarios"
              href="/tenant/messages"
              color="orange"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones en tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    id={activity.id}
                    type={activity.type}
                    title={activity.title}
                    description={activity.description}
                    date={activity.date}
                    status={activity.status}
                    iconMap={iconMap}
                    colorMap={colorMap}
                    statusBadgeMap={statusBadgeMap}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximo Pago</CardTitle>
              <CardDescription>
                Información sobre tu próximo pago de arriendo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Monto a pagar</p>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(stats.nextPayment.amount)}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Vencimiento: {formatDate(stats.nextPayment.dueDate)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pagar Ahora
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Programar Pago
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>¿Necesitas ayuda con tu pago?</p>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    Contactar soporte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EnhancedDashboardLayout>
  );
}