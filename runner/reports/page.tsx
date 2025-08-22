'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Eye, 
  TrendingUp, 
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Star,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@/types';

interface ReportStats {
  totalVisits: number;
  completedVisits: number;
  pendingVisits: number;
  cancelledVisits: number;
  conversionRate: number;
  averageRating: number;
  monthlyEarnings: number;
  totalEarnings: number;
}

interface RecentVisit {
  id: string;
  propertyTitle: string;
  propertyAddress: string;
  scheduledAt: string;
  status: string;
  duration: number;
  clientName?: string;
  earnings?: number;
}

interface MonthlyData {
  month: string;
  visits: number;
  earnings: number;
  conversions: number;
}

export default function RunnerReports() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ReportStats>({
    totalVisits: 0,
    completedVisits: 0,
    pendingVisits: 0,
    cancelledVisits: 0,
    conversionRate: 0,
    averageRating: 0,
    monthlyEarnings: 0,
    totalEarnings: 0,
  });
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Load reports data
    const loadReportsData = async () => {
      try {
        // Mock data for demonstration
        const mockStats: ReportStats = {
          totalVisits: 156,
          completedVisits: 142,
          pendingVisits: 8,
          cancelledVisits: 6,
          conversionRate: 78.5,
          averageRating: 4.7,
          monthlyEarnings: 450000,
          totalEarnings: 2850000,
        };

        const mockRecentVisits: RecentVisit[] = [
          {
            id: '1',
            propertyTitle: 'Departamento Moderno Providencia',
            propertyAddress: 'Av. Providencia 1234, Providencia',
            scheduledAt: '2024-01-15T10:00:00',
            status: 'completed',
            duration: 45,
            clientName: 'María González',
            earnings: 15000,
          },
          {
            id: '2',
            propertyTitle: 'Casa Familiar Las Condes',
            propertyAddress: 'El Alba 456, Las Condes',
            scheduledAt: '2024-01-14T15:30:00',
            status: 'completed',
            duration: 60,
            clientName: 'Juan Pérez',
            earnings: 20000,
          },
          {
            id: '3',
            propertyTitle: 'Studio Amoblado Ñuñoa',
            propertyAddress: 'Irarrázaval 789, Ñuñoa',
            scheduledAt: '2024-01-16T11:00:00',
            status: 'pending',
            duration: 30,
          },
        ];

        const mockMonthlyData: MonthlyData[] = [
          { month: 'Ene', visits: 45, earnings: 680000, conversions: 35 },
          { month: 'Feb', visits: 52, earnings: 750000, conversions: 41 },
          { month: 'Mar', visits: 48, earnings: 720000, conversions: 38 },
          { month: 'Abr', visits: 55, earnings: 820000, conversions: 43 },
          { month: 'May', visits: 58, earnings: 880000, conversions: 46 },
          { month: 'Jun', visits: 62, earnings: 950000, conversions: 49 },
        ];

        setStats(mockStats);
        setRecentVisits(mockRecentVisits);
        setMonthlyData(mockMonthlyData);
      } catch (error) {
        console.error('Error loading reports data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadReportsData();
  }, []);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes de Rendimiento</h1>
        <p className="text-gray-600">Analiza tu desempeño como Runner360</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVisits}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calificación Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganancias Mensuales</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.monthlyEarnings)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="visits">Visitas</TabsTrigger>
          <TabsTrigger value="conversions">Conversiones</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Visitas Recientes
                </CardTitle>
                <CardDescription>Tus últimas visitas programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVisits.slice(0, 5).map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{visit.propertyTitle}</h4>
                        <p className="text-xs text-gray-600">{visit.propertyAddress}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(visit.scheduledAt)}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(visit.status)}
                        {visit.earnings && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            {formatPrice(visit.earnings)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Estadísticas Mensuales
                </CardTitle>
                <CardDescription>Rendimiento de los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{data.month}</h4>
                        <p className="text-sm text-gray-600">{data.visits} visitas</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{formatPrice(data.earnings)}</p>
                        <p className="text-sm text-gray-600">{data.conversions} conversiones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="visits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Visitas Detallado</CardTitle>
              <CardDescription>Análisis completo de todas tus visitas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.completedVisits}</div>
                  <div className="text-sm text-gray-600">Visitas Completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{stats.pendingVisits}</div>
                  <div className="text-sm text-gray-600">Visitas Pendientes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.cancelledVisits}</div>
                  <div className="text-sm text-gray-600">Visitas Canceladas</div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/runner/reports/visits">
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Reporte Completo de Visitas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Conversiones</CardTitle>
              <CardDescription>Análisis de tu tasa de conversión y rendimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.conversionRate}%</div>
                  <div className="text-sm text-gray-600">Tasa de Conversión</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(stats.totalVisits * stats.conversionRate / 100)}
                  </div>
                  <div className="text-sm text-gray-600">Total Conversiones</div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/runner/reports/conversions">
                  <Button>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ver Reporte de Conversiones
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Rendimiento</CardTitle>
              <CardDescription>Análisis detallado de tu desempeño general</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{stats.averageRating}/5</div>
                  <div className="text-sm text-gray-600">Calificación Promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{formatPrice(stats.monthlyEarnings)}</div>
                  <div className="text-sm text-gray-600">Ganancias Mensuales</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatPrice(stats.totalEarnings)}</div>
                  <div className="text-sm text-gray-600">Ganancias Totales</div>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/runner/reports/performance">
                  <Button>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Reporte de Rendimiento
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}