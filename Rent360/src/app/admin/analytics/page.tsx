'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Link from 'next/link';
import { User } from '@/types';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';

interface AnalyticsData {
  totalUsers: number;
  totalProperties: number;
  totalContracts: number;
  totalRevenue: number;
  userGrowth: { date: string; count: number }[];
  propertyGrowth: { date: string; count: number }[];
  revenueGrowth: { date: string; amount: number }[];
  topProperties: { id: string; title: string; views: number; inquiries: number }[];
  userDistribution: { role: string; count: number; percentage: number }[];
}

export default function AdminAnalytics() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalProperties: 0,
    totalContracts: 0,
    totalRevenue: 0,
    userGrowth: [],
    propertyGrowth: [],
    revenueGrowth: [],
    topProperties: [],
    userDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

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

    const loadAnalyticsData = async () => {
      try {
        // Load users
        const usersResponse = await fetch('/api/users?limit=1000');
        const usersData = usersResponse.ok ? await usersResponse.json() : { users: [] };
        
        // Load properties
        const propertiesResponse = await fetch('/api/properties?limit=1000');
        const propertiesData = propertiesResponse.ok ? await propertiesResponse.json() : { properties: [] };
        
        // Calculate analytics
        const totalUsers = usersData.users.length;
        const totalProperties = propertiesData.properties.length;
        const totalContracts = propertiesData.properties.filter((p: any) => p.status === 'rented').length;
        const totalRevenue = propertiesData.properties
          .filter((p: any) => p.status === 'rented')
          .reduce((sum: number, p: any) => sum + (p.price || 0), 0);

        // Generate growth data (mock data for demonstration)
        const userGrowth = generateGrowthData(totalUsers, 30);
        const propertyGrowth = generateGrowthData(totalProperties, 30);
        const revenueGrowth = generateRevenueGrowthData(totalRevenue, 30);

        // Top properties by views and inquiries
        const topProperties = propertiesData.properties
          .slice(0, 5)
          .map((property: any) => ({
            id: property.id,
            title: property.title,
            views: Math.floor(Math.random() * 1000) + 100,
            inquiries: Math.floor(Math.random() * 50) + 5
          }));

        // User distribution by role
        const roleCounts = usersData.users.reduce((acc: any, user: any) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        const userDistribution = Object.entries(roleCounts).map(([role, count]) => ({
          role,
          count: count as number,
          percentage: Math.round(((count as number) / totalUsers) * 100)
        }));

        setAnalytics({
          totalUsers,
          totalProperties,
          totalContracts,
          totalRevenue,
          userGrowth,
          propertyGrowth,
          revenueGrowth,
          topProperties,
          userDistribution
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setLoading(false);
      }
    };

    loadUserData();
    loadAnalyticsData();
  }, [dateRange]);

  const generateGrowthData = (total: number, days: number) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let i = 0; i < days; i += 5) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const count = Math.floor((total * (i + 5)) / days);
      data.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }
    
    return data;
  };

  const generateRevenueGrowthData = (total: number, days: number) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let i = 0; i < days; i += 5) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const amount = Math.floor((total * (i + 5)) / days);
      data.push({
        date: date.toISOString().split('T')[0],
        amount
      });
    }
    
    return data;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'tenant': return 'Inquilino';
      case 'owner': return 'Propietario';
      case 'broker': return 'Corredor';
      case 'runner': return 'Runner360';
      case 'support': return 'Soporte';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444'; // red
      case 'tenant': return '#3b82f6'; // blue
      case 'owner': return '#10b981'; // green
      case 'broker': return '#f59e0b'; // amber
      case 'runner': return '#8b5cf6'; // violet
      case 'support': return '#06b6d4'; // cyan
      default: return '#6b7280'; // gray
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedDashboardLayout
      user={user}
      title="Analíticas"
      subtitle="Estadísticas y métricas del sistema"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analíticas del Sistema</h1>
            <p className="text-gray-600">Métricas clave y tendencias de Rent360</p>
          </div>
          <div className="flex gap-2">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuarios Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% vs mes anterior
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Propiedades</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalProperties}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% vs mes anterior
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalContracts}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +15% vs mes anterior
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(analytics.totalRevenue)}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18% vs mes anterior
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Crecimiento de Usuarios
              </CardTitle>
              <CardDescription>Nuevos usuarios registrados en el período seleccionado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={analytics.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Usuarios']}
                    labelFormatter={(label) => `Fecha: ${label}`}
                  />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Crecimiento de Ingresos
              </CardTitle>
              <CardDescription>Evolución de los ingresos mensuales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={256}>
                <LineChart data={analytics.revenueGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Ingresos']}
                    labelFormatter={(label) => `Fecha: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Properties and User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Propiedades Más Populares</CardTitle>
              <CardDescription>Basado en vistas e inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProperties.map((property, index) => (
                  <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-100 text-blue-800">#{index + 1}</Badge>
                        <h4 className="font-medium text-sm">{property.title}</h4>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-600">
                        <span>{property.views} vistas</span>
                        <span>{property.inquiries} consultas</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Ver</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Usuarios</CardTitle>
              <CardDescription>Por tipo de rol en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getRoleColor(entry.role)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, getRoleDisplayName(name)]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {analytics.userDistribution.map((distribution) => (
                  <div key={distribution.role} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getRoleColor(distribution.role) }}
                      ></div>
                      <span>{getRoleDisplayName(distribution.role)}</span>
                    </div>
                    <span className="font-medium">{distribution.count} ({distribution.percentage}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EnhancedDashboardLayout>
  );
}