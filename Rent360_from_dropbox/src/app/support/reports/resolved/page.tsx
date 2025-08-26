'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users,
  TrendingUp,
  Filter,
  Search,
  Download,
  BarChart3,
  PieChart,
  Target,
  Award,
  AlertTriangle,
  CheckSquare,
  MessageSquare,
  User,
  Tag
} from 'lucide-react';
import { User } from '@/types';
import Link from 'next/link';

interface ResolvedTicket {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  resolvedBy: string;
  createdAt: string;
  resolvedAt: string;
  resolutionTime: number; // in hours
  clientSatisfaction?: number;
  clientName?: string;
  tags: string[];
  resolution: string;
}

interface ResolutionStats {
  totalResolved: number;
  averageResolutionTime: number;
  satisfactionRate: number;
  topCategories: { category: string; count: number }[];
  monthlyTrend: { month: string; resolved: number; avgTime: number }[];
  topPerformers: { name: string; resolved: number; avgTime: number; satisfaction: number }[];
}

export default function SupportResolvedReports() {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<ResolvedTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<ResolvedTicket[]>([]);
  const [stats, setStats] = useState<ResolutionStats>({
    totalResolved: 0,
    averageResolutionTime: 0,
    satisfactionRate: 0,
    topCategories: [],
    monthlyTrend: [],
    topPerformers: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

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

    // Load resolved tickets data
    const loadTicketsData = async () => {
      try {
        // Mock data for demonstration
        const mockTickets: ResolvedTicket[] = [
          {
            id: '1',
            ticketNumber: 'TKT-2024-001',
            title: 'Problema con acceso al sistema',
            category: 'Technical',
            priority: 'high',
            assignedTo: 'Carlos Rodríguez',
            resolvedBy: 'Carlos Rodríguez',
            createdAt: '2024-01-10T09:00:00',
            resolvedAt: '2024-01-10T14:30:00',
            resolutionTime: 5.5,
            clientSatisfaction: 5,
            clientName: 'María González',
            tags: ['login', 'access', 'technical'],
            resolution: 'Se restableció la contraseña del usuario y se verificó el acceso al sistema.'
          },
          {
            id: '2',
            ticketNumber: 'TKT-2024-002',
            title: 'Error en pago en línea',
            category: 'Billing',
            priority: 'urgent',
            assignedTo: 'Ana Martínez',
            resolvedBy: 'Ana Martínez',
            createdAt: '2024-01-11T11:30:00',
            resolvedAt: '2024-01-11T16:45:00',
            resolutionTime: 5.25,
            clientSatisfaction: 4,
            clientName: 'Juan Pérez',
            tags: ['payment', 'billing', 'urgent'],
            resolution: 'Se identificó un error en la pasarela de pago y se coordinó con el equipo de finanzas para su corrección.'
          },
          {
            id: '3',
            ticketNumber: 'TKT-2024-003',
            title: 'Consulta sobre contrato de arriendo',
            category: 'Contract',
            priority: 'medium',
            assignedTo: 'Laura Silva',
            resolvedBy: 'Laura Silva',
            createdAt: '2024-01-12T14:00:00',
            resolvedAt: '2024-01-13T10:30:00',
            resolutionTime: 20.5,
            clientSatisfaction: 5,
            clientName: 'Ana Martínez',
            tags: ['contract', 'rental', 'question'],
            resolution: 'Se proporcionó información detallada sobre los términos del contrato y se aclararon todas las dudas del cliente.'
          },
          {
            id: '4',
            ticketNumber: 'TKT-2024-004',
            title: 'No puedo ver mis propiedades',
            category: 'Technical',
            priority: 'medium',
            assignedTo: 'Carlos Rodríguez',
            resolvedBy: 'Carlos Rodríguez',
            createdAt: '2024-01-13T16:00:00',
            resolvedAt: '2024-01-14T09:30:00',
            resolutionTime: 17.5,
            clientSatisfaction: 4,
            clientName: 'Carlos López',
            tags: ['properties', 'dashboard', 'technical'],
            resolution: 'Se verificaron los permisos del usuario y se corrigió un problema de visualización en el dashboard.'
          },
          {
            id: '5',
            ticketNumber: 'TKT-2024-005',
            title: 'Solicitud de cancelación de servicio',
            category: 'Account',
            priority: 'low',
            assignedTo: 'Laura Silva',
            resolvedBy: 'Laura Silva',
            createdAt: '2024-01-14T10:30:00',
            resolvedAt: '2024-01-15T15:00:00',
            resolutionTime: 28.5,
            clientSatisfaction: 3,
            clientName: 'Laura Silva',
            tags: ['cancellation', 'account', 'request'],
            resolution: 'Se procesó la solicitud de cancelación siguiendo el protocolo establecido y se confirmó con el cliente.'
          }
        ];

        const mockStats: ResolutionStats = {
          totalResolved: 156,
          averageResolutionTime: 18.5,
          satisfactionRate: 87.3,
          topCategories: [
            { category: 'Technical', count: 45 },
            { category: 'Billing', count: 32 },
            { category: 'Contract', count: 28 },
            { category: 'Account', count: 25 },
            { category: 'Other', count: 26 },
          ],
          monthlyTrend: [
            { month: 'Ene', resolved: 28, avgTime: 16.2 },
            { month: 'Feb', resolved: 32, avgTime: 17.8 },
            { month: 'Mar', resolved: 26, avgTime: 19.5 },
            { month: 'Abr', resolved: 35, avgTime: 15.8 },
            { month: 'May', resolved: 31, avgTime: 18.2 },
            { month: 'Jun', resolved: 29, avgTime: 16.9 },
          ],
          topPerformers: [
            { name: 'Carlos Rodríguez', resolved: 52, avgTime: 15.2, satisfaction: 92.1 },
            { name: 'Ana Martínez', resolved: 48, avgTime: 14.8, satisfaction: 94.3 },
            { name: 'Laura Silva', resolved: 56, avgTime: 16.5, satisfaction: 89.7 },
          ],
        };

        setTickets(mockTickets);
        setFilteredTickets(mockTickets);
        setStats(mockStats);
      } catch (error) {
        console.error('Error loading tickets data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadTicketsData();
  }, []);

  useEffect(() => {
    // Filter tickets
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (monthFilter !== 'all') {
      filtered = filtered.filter(ticket => {
        const ticketMonth = new Date(ticket.resolvedAt).toLocaleString('es-CL', { month: 'long' });
        return ticketMonth.toLowerCase() === monthFilter.toLowerCase();
      });
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, categoryFilter, priorityFilter, monthFilter]);

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgente</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Baja</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getSatisfactionColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatResolutionTime = (hours: number) => {
    if (hours < 24) {
      return `${hours.toFixed(1)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours.toFixed(1)}h`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte de tickets resueltos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tickets Resueltos</h1>
            <p className="text-gray-600">Análisis detallado de tickets resueltos y desempeño del equipo</p>
          </div>
          <div className="flex gap-2">
            <Link href="/support/reports">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Todos los Reportes
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalResolved}</div>
              <div className="text-sm text-gray-600">Total Resueltos</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{formatResolutionTime(stats.averageResolutionTime)}</div>
              <div className="text-sm text-gray-600">Tiempo Promedio</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.satisfactionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Satisfacción</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{filteredTickets.length}</div>
              <div className="text-sm text-gray-600">Este Período</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Categorías Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{index + 1}. {category.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(category.count / stats.totalResolved) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Mejores Desempeños
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{performer.name}</h4>
                    <p className="text-xs text-gray-600">{performer.resolved} tickets resueltos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{formatResolutionTime(performer.avgTime)}</p>
                    <p className={`text-xs ${getSatisfactionColor(performer.satisfaction)}`}>
                      {performer.satisfaction.toFixed(1)}★
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Technical">Técnico</SelectItem>
                <SelectItem value="Billing">Facturación</SelectItem>
                <SelectItem value="Contract">Contrato</SelectItem>
                <SelectItem value="Account">Cuenta</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los meses</SelectItem>
                <SelectItem value="enero">Enero</SelectItem>
                <SelectItem value="febrero">Febrero</SelectItem>
                <SelectItem value="marzo">Marzo</SelectItem>
                <SelectItem value="abril">Abril</SelectItem>
                <SelectItem value="mayo">Mayo</SelectItem>
                <SelectItem value="junio">Junio</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resolved Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Tickets Resueltos
          </CardTitle>
          <CardDescription>
            Mostrando {filteredTickets.length} de {tickets.length} tickets resueltos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{ticket.title}</h3>
                      {getPriorityBadge(ticket.priority)}
                      <Badge variant="outline">{ticket.category}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        <span>{ticket.ticketNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{ticket.clientName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Creado: {formatDate(ticket.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Resuelto: {formatDate(ticket.resolvedAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>Tiempo de resolución: {formatResolutionTime(ticket.resolutionTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span>Asignado a: {ticket.assignedTo}</span>
                      </div>
                      {ticket.clientSatisfaction && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className={getSatisfactionColor(ticket.clientSatisfaction)}>
                            Satisfacción: {ticket.clientSatisfaction}/5
                          </span>
                        </div>
                      )}
                    </div>

                    {ticket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ticket.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Resolución:</h4>
                      <p className="text-sm text-gray-700">{ticket.resolution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron tickets resueltos con los filtros seleccionados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}