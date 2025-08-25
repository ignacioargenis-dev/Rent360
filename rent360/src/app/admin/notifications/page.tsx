'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Filter,
  Search,
  Calendar,
  User as UserIcon,
  Building,
  DollarSign,
  Settings,
  Trash2,
  Eye,
  Send,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@/types';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';

interface Notification {
  id: string;
  type: 'system' | 'user' | 'property' | 'payment' | 'contract' | 'security';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
  readAt?: string;
  userId?: string;
  propertyId?: string;
  actionUrl?: string;
}

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export default function AdminNotifications() {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
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

    const loadNotifications = async () => {
      try {
        // Mock notifications data for demonstration
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'system',
            title: 'Actualización del Sistema',
            message: 'Se ha completado la actualización a la versión 2.1.0 con nuevas mejoras de seguridad.',
            severity: 'medium',
            status: 'unread',
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
          },
          {
            id: '2',
            type: 'user',
            title: 'Nuevo Usuario Registrado',
            message: 'Juan Pérez se ha registrado como Propietario en el sistema.',
            severity: 'low',
            status: 'unread',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            userId: 'user123'
          },
          {
            id: '3',
            type: 'property',
            title: 'Propiedad Reportada',
            message: 'La propiedad "Departamento Centro" ha sido reportada por contenido inapropiado.',
            severity: 'high',
            status: 'unread',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            propertyId: 'prop456',
            actionUrl: '/admin/properties'
          },
          {
            id: '4',
            type: 'payment',
            title: 'Pago Fallido',
            message: 'El pago del contrato #123 ha fallado. Se requiere atención inmediata.',
            severity: 'high',
            status: 'read',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
            actionUrl: '/admin/payments'
          },
          {
            id: '5',
            type: 'security',
            title: 'Intento de Acceso sospechoso',
            message: 'Se detectaron múltiples intentos de acceso fallidos desde la IP 192.168.1.100.',
            severity: 'critical',
            status: 'unread',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
          },
          {
            id: '6',
            type: 'contract',
            title: 'Contrato por Expirar',
            message: 'El contrato #456 expirará en 3 días. Se requiere renovación.',
            severity: 'medium',
            status: 'read',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            actionUrl: '/admin/contracts'
          }
        ];

        setNotifications(mockNotifications);

        // Calculate stats
        const notificationStats = mockNotifications.reduce((acc, notification) => {
          acc.total++;
          acc[notification.status]++;
          acc[notification.severity]++;
          return acc;
        }, {
          total: 0,
          unread: 0,
          read: 0,
          archived: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        } as NotificationStats);

        setStats(notificationStats);
        setLoading(false);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setLoading(false);
      }
    };

    loadUserData();
    loadNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, status: 'read' as const, readAt: new Date().toISOString() }
        : notification
    ));
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(notification => 
      notification.status === 'unread' 
        ? { ...notification, status: 'read' as const, readAt: new Date().toISOString() }
        : notification
    ));
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Settings className="w-5 h-5" />;
      case 'user':
        return <UserIcon className="w-5 h-5" />;
      case 'property':
        return <Building className="w-5 h-5" />;
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      case 'contract':
        return <FileText className="w-5 h-5" />;
      case 'security':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Crítico</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Alto</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Bajo</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
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

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.status === filter || notification.severity === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedDashboardLayout
      user={user}
      title="Notificaciones"
      subtitle="Gestiona todas las notificaciones del sistema"
      notificationCount={stats.unread}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header with stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centro de Notificaciones</h1>
            <p className="text-gray-600">Gestiona y monitorea todas las alertas del sistema</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Marcar todas como leídas
            </Button>
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              Enviar Notificación
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
                <p className="text-xs text-gray-600">No leídas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.read}</p>
                <p className="text-xs text-gray-600">Leídas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                <p className="text-xs text-gray-600">Críticas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
                <p className="text-xs text-gray-600">Altas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
                <p className="text-xs text-gray-600">Medias</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.low}</p>
                <p className="text-xs text-gray-600">Bajas</p>
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
                placeholder="Buscar notificaciones..."
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
              <option value="unread">No leídas</option>
              <option value="read">Leídas</option>
              <option value="critical">Críticas</option>
              <option value="high">Altas</option>
              <option value="medium">Medias</option>
              <option value="low">Bajas</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron notificaciones</p>
                  <p className="text-sm text-gray-400">Intenta ajustar tus filtros de búsqueda</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${getSeverityColor(notification.severity)} ${
                  notification.status === 'unread' ? 'shadow-md' : ''
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getSeverityColor(notification.severity)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {getSeverityBadge(notification.severity)}
                          {notification.status === 'unread' && (
                            <Badge className="bg-blue-100 text-blue-800">Nueva</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                          {notification.readAt && (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Leído {formatRelativeTime(notification.readAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {notification.actionUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={notification.actionUrl}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      )}
                      {notification.status === 'unread' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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