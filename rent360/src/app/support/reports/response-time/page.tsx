'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Target,
  Users,
  Calendar,
  Filter,
  Download,
  Zap,
  Timer,
  Hourglass,
  Activity,
  Award
} from 'lucide-react';
import { User } from '@/types';
import Link from 'next/link';

interface ResponseTimeData {
  category: string;
  averageTime: number;
  medianTime: number;
  minTime: number;
  maxTime: number;
  totalTickets: number;
  slaCompliance: number; // percentage
  trend: 'improving' | 'stable' | 'declining';
}

interface TeamPerformance {
  agent: string;
  averageResponseTime: number;
  averageResolutionTime: number;
  ticketsHandled: number;
  satisfaction: number;
  efficiency: number; // tickets per hour
}

interface MonthlyTrend {
  month: string;
  avgResponseTime: number;
  avgResolutionTime: number;
  ticketsVolume: number;
  slaCompliance: number;
}

interface SLAData {
  level: string;
  targetTime: number; // in hours
  compliance: number;
  category: string;
  trend: number; // percentage change
}

export default function SupportResponseTimeReport() {
  const [user, setUser] = useState<User | null>(null);
  const [responseTimeData, setResponseTimeData] = useState<ResponseTimeData[]>([]);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [slaData, setSlaData] = useState<SLAData[]>([]);
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

    // Load response time data
    const loadResponseTimeData = async () => {
      try {
        // Mock data for demonstration
        const mockResponseTimeData: ResponseTimeData[] = [
          {
            category: 'Technical',
            averageTime: 2.5,
            medianTime: 2.2,
            minTime: 0.5,
            maxTime: 8.0,
            totalTickets: 45,
            slaCompliance: 92.5,
            trend: 'improving'
          },
          {
            category: 'Billing',
            averageTime: 1.8,
            medianTime: 1.5,
            minTime: 0.3,
            maxTime: 6.5,
            totalTickets: 32,
            slaCompliance: 96.8,
            trend: 'stable'
          },
          {
            category: 'Contract',
            averageTime: 4.2,
            medianTime: 3.8,
            minTime: 1.0,
            maxTime: 12.0,
            totalTickets: 28,
            slaCompliance: 85.7,
            trend: 'improving'
          },
          {
            category: 'Account',
            averageTime: 3.1,
            medianTime: 2.8,
            minTime: 0.8,
            maxTime: 9.5,
            totalTickets: 25,
            slaCompliance: 89.2,
            trend: 'declining'
          },
          {
            category: 'Other',
            averageTime: 2.9,
            medianTime: 2.6,
            minTime: 0.7,
            maxTime: 7.8,
            totalTickets: 26,
            slaCompliance: 90.4,
            trend: 'stable'
          }
        ];

        const mockTeamPerformance: TeamPerformance[] = [
          {
            agent: 'Carlos Rodríguez',
            averageResponseTime: 1.8,
            averageResolutionTime: 15.2,
            ticketsHandled: 52,
            satisfaction: 92.1,
            efficiency: 3.4
          },
          {
            agent: 'Ana Martínez',
            averageResponseTime: 1.5,
            averageResolutionTime: 14.8,
            ticketsHandled: 48,
            satisfaction: 94.3,
            efficiency: 3.2
          },
          {
            agent: 'Laura Silva',
            averageResponseTime: 2.2,
            averageResolutionTime: 16.5,
            ticketsHandled: 56,
            satisfaction: 89.7,
            efficiency: 3.4
          }
        ];

        const mockMonthlyTrends: MonthlyTrend[] = [
          { month: 'Ene', avgResponseTime: 2.8, avgResolutionTime: 18.5, ticketsVolume: 28, slaCompliance: 87.2 },
          { month: 'Feb', avgResponseTime: 2.6, avgResolutionTime: 17.8, ticketsVolume: 32, slaCompliance: 89.1 },
          { month: 'Mar', avgResponseTime: 2.9, avgResolutionTime: 19.5, ticketsVolume: 26, slaCompliance: 85.3 },
          { month: 'Abr', avgResponseTime: 2.4, avgResolutionTime: 16.8, ticketsVolume: 35, slaCompliance: 91.2 },
          { month: 'May', avgResponseTime: 2.3, avgResolutionTime: 17.2, ticketsVolume: 31, slaCompliance: 90.8 },
          { month: 'Jun', avgResponseTime: 2.1, avgResolutionTime: 16.9, ticketsVolume: 29, slaCompliance: 92.5 }
        ];

        const mockSlaData: SLAData[] = [
          {
            level: 'Crítico',
            targetTime: 1,
            compliance: 94.2,
            category: 'Urgent',
            trend: 2.5
          },
          {
            level: 'Alto',
            targetTime: 2,
            compliance: 89.7,
            category: 'High',
            trend: -1.2
          },
          {
            level: 'Medio',
            targetTime: 4,
            compliance: 92.1,
            category: 'Medium',
            trend: 3.8
          },
          {
            level: 'Bajo',
            targetTime: 8,
            compliance: 96.8,
            category: 'Low',
            trend: 1.5
          }
        ];

        setResponseTimeData(mockResponseTimeData);
        setTeamPerformance(mockTeamPerformance);
        setMonthlyTrends(mockMonthlyTrends);
        setSlaData(mockSlaData);
      } catch (error) {
        console.error('Error loading response time data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadResponseTimeData();
  }, []);

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}min`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getSLAColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600';
    if (compliance >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSLABadge = (compliance: number) => {
    if (compliance >= 95) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (compliance >= 85) return <Badge className="bg-yellow-100 text-yellow-800">Bueno</Badge>;
    return <Badge className="bg-red-100 text-red-800">Mejorar</Badge>;
  };

  const getOverallStats = () => {
    const avgResponseTime = responseTimeData.reduce((sum, data) => sum + data.averageTime, 0) / responseTimeData.length;
    const avgSLACompliance = responseTimeData.reduce((sum, data) => sum + data.slaCompliance, 0) / responseTimeData.length;
    const totalTickets = responseTimeData.reduce((sum, data) => sum + data.totalTickets, 0);
    const improvingCategories = responseTimeData.filter(data => data.trend === 'improving').length;

    return {
      avgResponseTime,
      avgSLACompliance,
      totalTickets,
      improvingCategories
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte de tiempo de respuesta...</p>
        </div>
      </div>
    );
  }

  const stats = getOverallStats();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tiempo de Respuesta</h1>
            <p className="text-gray-600">Análisis detallado de tiempos de respuesta y cumplimiento de SLA</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatTime(stats.avgResponseTime)}
              </div>
              <div className="text-sm text-gray-600">Tiempo Promedio</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">Mejorando</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getSLAColor(stats.avgSLACompliance)} mb-2`}>
                {stats.avgSLACompliance.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Cumplimiento SLA</div>
              {getSLABadge(stats.avgSLACompliance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.totalTickets}
              </div>
              <div className="text-sm text-gray-600">Tickets Analizados</div>
              <div className="text-xs text-gray-500 mt-1">Últimos 6 meses</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.improvingCategories}/{responseTimeData.length}
              </div>
              <div className="text-sm text-gray-600">Categorías Mejorando</div>
              <Progress value={(stats.improvingCategories / responseTimeData.length) * 100} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="categories">Por Categoría</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Tendencia Mensual
                </CardTitle>
                <CardDescription>Evolución de tiempos de respuesta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyTrends.map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{trend.month}</h4>
                        <p className="text-sm text-gray-600">{trend.ticketsVolume} tickets</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">{formatTime(trend.avgResponseTime)}</p>
                        <p className={`text-sm ${getSLAColor(trend.slaCompliance)}`}>
                          SLA: {trend.slaCompliance.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Indicadores Clave
                </CardTitle>
                <CardDescription>Métricas importantes de desempeño</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">Respuesta Más Rápida</h4>
                        <p className="text-sm text-gray-600">Mejor tiempo de respuesta</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatTime(Math.min(...responseTimeData.map(d => d.minTime)))}
                      </p>
                      <p className="text-sm text-gray-600">mínimo registrado</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Hourglass className="w-5 h-5 text-yellow-600" />
                      <div>
                        <h4 className="font-medium">Respuesta Más Lenta</h4>
                        <p className="text-sm text-gray-600">Tiempo máximo registrado</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">
                        {formatTime(Math.max(...responseTimeData.map(d => d.maxTime)))}
                      </p>
                      <p className="text-sm text-gray-600">máximo registrado</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">Eficiencia del Equipo</h4>
                        <p className="text-sm text-gray-600">Promedio general</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {teamPerformance.length > 0 ? (teamPerformance.reduce((sum, p) => sum + p.efficiency, 0) / teamPerformance.length).toFixed(1) : '0.0'}
                      </p>
                      <p className="text-sm text-gray-600">tickets/hora</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Tiempos por Categoría
              </CardTitle>
              <CardDescription>Análisis detallado por categoría de tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responseTimeData.map((data) => (
                  <div key={data.category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{data.category}</h3>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(data.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(data.trend)}`}>
                          {data.trend === 'improving' ? 'Mejorando' : 
                           data.trend === 'declining' ? 'Empeorando' : 'Estable'}
                        </span>
                        {getSLABadge(data.slaCompliance)}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Promedio</p>
                        <p className="font-semibold text-blue-600">{formatTime(data.averageTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mediana</p>
                        <p className="font-semibold">{formatTime(data.medianTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mín/Máx</p>
                        <p className="font-semibold">{formatTime(data.minTime)} / {formatTime(data.maxTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tickets</p>
                        <p className="font-semibold">{data.totalTickets}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">SLA</p>
                        <p className={`font-semibold ${getSLAColor(data.slaCompliance)}`}>
                          {data.slaCompliance.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Rendimiento SLA</span>
                        <span>{data.slaCompliance.toFixed(1)}%</span>
                      </div>
                      <Progress value={data.slaCompliance} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Desempeño del Equipo
              </CardTitle>
              <CardDescription>Tiempos de respuesta por agente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((agent) => (
                  <div key={agent.agent} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{agent.agent}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{agent.satisfaction.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Respuesta</p>
                        <p className="font-semibold text-blue-600">{formatTime(agent.averageResponseTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Resolución</p>
                        <p className="font-semibold text-green-600">{formatTime(agent.averageResolutionTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tickets</p>
                        <p className="font-semibold">{agent.ticketsHandled}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Eficiencia</p>
                        <p className="font-semibold text-purple-600">{agent.efficiency.toFixed(1)}/h</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Cumplimiento SLA
              </CardTitle>
              <CardDescription>Niveles de servicio y cumplimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slaData.map((sla) => (
                  <div key={sla.level} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">SLA {sla.level}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{sla.category}</Badge>
                        {getSLABadge(sla.compliance)}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Tiempo Objetivo</p>
                        <p className="font-semibold text-blue-600">{formatTime(sla.targetTime)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cumplimiento</p>
                        <p className={`font-semibold ${getSLAColor(sla.compliance)}`}>
                          {sla.compliance.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tendencia</p>
                        <p className={`font-semibold ${sla.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {sla.trend > 0 ? '+' : ''}{sla.trend.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso de cumplimiento</span>
                        <span>{sla.compliance.toFixed(1)}%</span>
                      </div>
                      <Progress value={sla.compliance} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Descargar Reporte Completo
        </Button>
      </div>
    </div>
  );
}