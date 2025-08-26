'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plug, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ExternalLink,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  MapPin,
  Shield,
  Zap,
  FileText,
  Image,
  Video
} from 'lucide-react';
import Link from 'next/link';
import { User } from '@/types';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';

interface Integration {
  id: string;
  name: string;
  category: 'payment' | 'communication' | 'storage' | 'analytics' | 'security' | 'other';
  description: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  icon: any;
  lastSync?: string;
  usage?: {
    requests: number;
    lastUsed: string;
  };
  config?: {
    apiKey?: string;
    webhookUrl?: string;
    environment: 'development' | 'staging' | 'production';
  };
}

interface IntegrationStats {
  total: number;
  connected: number;
  disconnected: number;
  errors: number;
  pending: number;
}

export default function AdminIntegrations() {
  const [user, setUser] = useState<User | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [stats, setStats] = useState<IntegrationStats>({
    total: 0,
    connected: 0,
    disconnected: 0,
    errors: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

    const loadIntegrations = async () => {
      try {
        // Mock integrations data
        const mockIntegrations: Integration[] = [
          {
            id: '1',
            name: 'Stripe',
            category: 'payment',
            description: 'Procesamiento de pagos y suscripciones',
            status: 'connected',
            icon: <CreditCard className="w-6 h-6" />,
            lastSync: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            usage: {
              requests: 15420,
              lastUsed: new Date(Date.now() - 1000 * 60 * 2).toISOString()
            },
            config: {
              environment: 'production'
            }
          },
          {
            id: '2',
            name: 'SendGrid',
            category: 'communication',
            description: 'Envío de correos electrónicos transaccionales',
            status: 'connected',
            icon: <Mail className="w-6 h-6" />,
            lastSync: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
            usage: {
              requests: 8934,
              lastUsed: new Date(Date.now() - 1000 * 60 * 15).toISOString()
            },
            config: {
              environment: 'production'
            }
          },
          {
            id: '3',
            name: 'Twilio',
            category: 'communication',
            description: 'Mensajes SMS y llamadas telefónicas',
            status: 'disconnected',
            icon: <MessageSquare className="w-6 h-6" />,
            usage: {
              requests: 0,
              lastUsed: 'Nunca'
            }
          },
          {
            id: '4',
            name: 'AWS S3',
            category: 'storage',
            description: 'Almacenamiento de archivos y medios',
            status: 'connected',
            icon: <Database className="w-6 h-6" />,
            lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            usage: {
              requests: 25678,
              lastUsed: new Date(Date.now() - 1000 * 60 * 45).toISOString()
            },
            config: {
              environment: 'production'
            }
          },
          {
            id: '5',
            name: 'Google Analytics',
            category: 'analytics',
            description: 'Análisis de tráfico y comportamiento de usuarios',
            status: 'connected',
            icon: <Zap className="w-6 h-6" />,
            lastSync: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            usage: {
              requests: 4567,
              lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
            },
            config: {
              environment: 'production'
            }
          },
          {
            id: '6',
            name: 'Google Maps',
            category: 'other',
            description: 'Servicios de mapas y geolocalización',
            status: 'error',
            icon: <MapPin className="w-6 h-6" />,
            lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            usage: {
              requests: 1234,
              lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
            },
            config: {
              environment: 'production'
            }
          },
          {
            id: '7',
            name: 'Firebase Auth',
            category: 'security',
            description: 'Autenticación y gestión de usuarios',
            status: 'connected',
            icon: <Shield className="w-6 h-6" />,
            lastSync: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            usage: {
              requests: 34567,
              lastUsed: new Date(Date.now() - 1000 * 60 * 5).toISOString()
            },
            config: {
              environment: 'production'
            }
          },
          {
            id: '8',
            name: 'Calendly',
            category: 'other',
            description: 'Gestión de citas y calendarios',
            status: 'pending',
            icon: <Calendar className="w-6 h-6" />
          },
          {
            id: '9',
            name: 'Cloudinary',
            category: 'storage',
            description: 'Optimización y entrega de imágenes',
            status: 'connected',
            icon: <Image className="w-6 h-6" alt="" />,
            lastSync: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
            usage: {
              requests: 8923,
              lastUsed: new Date(Date.now() - 1000 * 60 * 25).toISOString()
            },
            config: {
              environment: 'production'
            }
          },
          {
            id: '10',
            name: 'Zoom',
            category: 'communication',
            description: 'Videoconferencias y reuniones virtuales',
            status: 'disconnected',
            icon: <Video className="w-6 h-6" />
          }
        ];

        setIntegrations(mockIntegrations);

        // Calculate stats
        const integrationStats = mockIntegrations.reduce((acc, integration) => {
          acc.total++;
          acc[integration.status]++;
          return acc;
        }, {
          total: 0,
          connected: 0,
          disconnected: 0,
          errors: 0,
          pending: 0
        } as IntegrationStats);

        setStats(integrationStats);
        setLoading(false);
      } catch (error) {
        console.error('Error loading integrations:', error);
        setLoading(false);
      }
    };

    loadUserData();
    loadIntegrations();
  }, []);

  const toggleIntegration = async (integrationId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'connected' ? 'disconnected' : 'connected';
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: newStatus as Integration['status'] }
        : integration
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'disconnected':
        return <Badge className="bg-gray-100 text-gray-800">Desconectado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-yellow-600" />;
      default:
        return <Plug className="w-5 h-5" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment':
        return <CreditCard className="w-5 h-5" />;
      case 'communication':
        return <MessageSquare className="w-5 h-5" />;
      case 'storage':
        return <Database className="w-5 h-5" />;
      case 'analytics':
        return <Zap className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      default:
        return <Plug className="w-5 h-5" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'payment':
        return 'Pagos';
      case 'communication':
        return 'Comunicación';
      case 'storage':
        return 'Almacenamiento';
      case 'analytics':
        return 'Analíticas';
      case 'security':
        return 'Seguridad';
      default:
        return 'Otros';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    if (dateString === 'Nunca') return dateString;
    
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  const filteredIntegrations = integrations.filter(integration => {
    return filter === 'all' || integration.category === filter || integration.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando integraciones...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedDashboardLayout
      user={user}
      title="Integraciones"
      subtitle="Gestiona todas las integraciones de terceros"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header with stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centro de Integraciones</h1>
            <p className="text-gray-600">Gestiona y monitorea todas las integraciones de terceros</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Integración
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar Todo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
                <p className="text-2xl font-bold text-green-600">{stats.connected}</p>
                <p className="text-xs text-gray-600">Conectadas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-600">{stats.disconnected}</p>
                <p className="text-xs text-gray-600">Desconectadas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
                <p className="text-xs text-gray-600">Errores</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-gray-600">Pendientes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          <Button
            variant={filter === 'payment' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('payment')}
          >
            Pagos
          </Button>
          <Button
            variant={filter === 'communication' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('communication')}
          >
            Comunicación
          </Button>
          <Button
            variant={filter === 'storage' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('storage')}
          >
            Almacenamiento
          </Button>
          <Button
            variant={filter === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('analytics')}
          >
            Analíticas
          </Button>
          <Button
            variant={filter === 'security' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('security')}
          >
            Seguridad
          </Button>
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className={`border-l-4 ${getStatusColor(integration.status)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(integration.status)}`}>
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryIcon(integration.category)}
                        <span className="text-xs text-gray-600">{getCategoryName(integration.category)}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>

                <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                {integration.usage && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Solicitudes:</span>
                      <span>{formatNumber(integration.usage.requests)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Último uso:</span>
                      <span>{formatRelativeTime(integration.usage.lastUsed)}</span>
                    </div>
                  </div>
                )}

                {integration.lastSync && (
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>Última sincronización:</span>
                    <span>{formatRelativeTime(integration.lastSync)}</span>
                  </div>
                )}

                {integration.config && (
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                      {integration.config.environment === 'production' ? 'Producción' : 
                       integration.config.environment === 'staging' ? 'Staging' : 'Desarrollo'}
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={integration.status === 'connected' ? 'outline' : 'default'}
                    onClick={() => toggleIntegration(integration.id, integration.status)}
                  >
                    {integration.status === 'connected' ? 'Desconectar' : 'Conectar'}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Plug className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron integraciones</p>
                <p className="text-sm text-gray-400">Intenta ajustar tus filtros o agrega una nueva integración</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </EnhancedDashboardLayout>
  );
}