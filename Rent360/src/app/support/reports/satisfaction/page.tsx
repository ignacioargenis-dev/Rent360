'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Users,
  BarChart3,
  PieChart,
  Smile,
  Frown,
  Meh,
  Target,
  Filter,
  Download,
  Award,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { User } from '@/types';
import Link from 'next/link';

interface SatisfactionData {
  period: string;
  averageRating: number;
  totalResponses: number;
  responseRate: number;
  distribution: {
    excellent: number; // 5 stars
    good: number; // 4 stars
    average: number; // 3 stars
    poor: number; // 2 stars
    terrible: number; // 1 star
  };
  trend: 'improving' | 'stable' | 'declining';
}

interface CategorySatisfaction {
  category: string;
  averageRating: number;
  totalRatings: number;
  topIssues: string[];
  improvementSuggestions: string[];
}

interface AgentPerformance {
  agent: string;
  averageRating: number;
  totalRatings: number;
  responseRate: number;
  topCompliments: string[];
  topComplaints: string[];
}

interface FeedbackTrend {
  month: string;
  averageRating: number;
  totalFeedback: number;
  responseRate: number;
  positivePercentage: number;
}

interface DetailedFeedback {
  id: string;
  ticketNumber: string;
  clientName: string;
  agent: string;
  category: string;
  rating: number;
  comment: string;
  date: string;
  resolvedAt: string;
  tags: string[];
}

export default function SupportSatisfactionReport() {
  const [user, setUser] = useState<User | null>(null);
  const [satisfactionData, setSatisfactionData] = useState<SatisfactionData[]>([]);
  const [categorySatisfaction, setCategorySatisfaction] = useState<CategorySatisfaction[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [feedbackTrends, setFeedbackTrends] = useState<FeedbackTrend[]>([]);
  const [detailedFeedback, setDetailedFeedback] = useState<DetailedFeedback[]>([]);
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

    // Load satisfaction data
    const loadSatisfactionData = async () => {
      try {
        // Mock data for demonstration
        const mockSatisfactionData: SatisfactionData[] = [
          {
            period: 'Últimos 30 días',
            averageRating: 4.3,
            totalResponses: 156,
            responseRate: 78.5,
            distribution: {
              excellent: 89,
              good: 45,
              average: 15,
              poor: 5,
              terrible: 2
            },
            trend: 'improving'
          },
          {
            period: 'Últimos 90 días',
            averageRating: 4.1,
            totalResponses: 423,
            responseRate: 76.2,
            distribution: {
              excellent: 215,
              good: 132,
              average: 58,
              poor: 15,
              terrible: 3
            },
            trend: 'improving'
          }
        ];

        const mockCategorySatisfaction: CategorySatisfaction[] = [
          {
            category: 'Technical',
            averageRating: 4.4,
            totalRatings: 89,
            topIssues: ['Tiempo de respuesta', 'Resolución completa'],
            improvementSuggestions: ['Mejorar documentación', 'Capacitación adicional']
          },
          {
            category: 'Billing',
            averageRating: 4.6,
            totalRatings: 67,
            topIssues: ['Claridad en facturas', 'Procesos de pago'],
            improvementSuggestions: ['Simplificar procesos', 'Mejorar comunicación']
          },
          {
            category: 'Contract',
            averageRating: 4.2,
            totalRatings: 45,
            topIssues: ['Complejidad de términos', 'Tiempo de procesamiento'],
            improvementSuggestions: ['Simplificar lenguaje', 'Agilizar procesos']
          },
          {
            category: 'Account',
            averageRating: 3.9,
            totalRatings: 38,
            topIssues: ['Verificación de identidad', 'Cambios de configuración'],
            improvementSuggestions: ['Optimizar verificación', 'Mejorar UI']
          }
        ];

        const mockAgentPerformance: AgentPerformance[] = [
          {
            agent: 'Carlos Rodríguez',
            averageRating: 4.5,
            totalRatings: 52,
            responseRate: 85.2,
            topCompliments: ['Rápido respuesta', 'Muy amable', 'Solucionó el problema'],
            topComplaints: ['Poco detallado en explicaciones']
          },
          {
            agent: 'Ana Martínez',
            averageRating: 4.7,
            totalRatings: 48,
            responseRate: 91.3,
            topCompliments: ['Excelente atención', 'Muy profesional', 'Resolución rápida'],
            topComplaints: []
          },
          {
            agent: 'Laura Silva',
            averageRating: 4.1,
            totalRatings: 56,
            responseRate: 78.9,
            topCompliments: ['Buena comunicación', 'Paciente'],
            topComplaints: ['Tiempo de respuesta lento', 'Falta de seguimiento']
          }
        ];

        const mockFeedbackTrends: FeedbackTrend[] = [
          { month: 'Ene', averageRating: 4.0, totalFeedback: 28, responseRate: 72.1, positivePercentage: 82.1 },
          { month: 'Feb', averageRating: 4.1, totalFeedback: 32, responseRate: 74.8, positivePercentage: 84.4 },
          { month: 'Mar', averageRating: 3.9, totalFeedback: 26, responseRate: 71.2, positivePercentage: 79.6 },
          { month: 'Abr', averageRating: 4.2, totalFeedback: 35, responseRate: 77.5, positivePercentage: 86.2 },
          { month: 'May', averageRating: 4.3, totalFeedback: 31, responseRate: 79.1, positivePercentage: 88.7 },
          { month: 'Jun', averageRating: 4.4, totalFeedback: 29, responseRate: 81.3, positivePercentage: 90.2 }
        ];

        const mockDetailedFeedback: DetailedFeedback[] = [
          {
            id: '1',
            ticketNumber: 'TKT-2024-001',
            clientName: 'María González',
            agent: 'Carlos Rodríguez',
            category: 'Technical',
            rating: 5,
            comment: 'Excelente servicio, muy rápido y amable. Resolvió mi problema inmediatamente.',
            date: '2024-01-15',
            resolvedAt: '2024-01-15T14:30:00',
            tags: ['rápido', 'amable', 'efectivo']
          },
          {
            id: '2',
            ticketNumber: 'TKT-2024-002',
            clientName: 'Juan Pérez',
            agent: 'Ana Martínez',
            category: 'Billing',
            rating: 4,
            comment: 'Buena atención, aunque tomó un poco más de tiempo de lo esperado.',
            date: '2024-01-14',
            resolvedAt: '2024-01-14T16:45:00',
            tags: ['bueno', 'lento']
          },
          {
            id: '3',
            ticketNumber: 'TKT-2024-003',
            clientName: 'Ana Martínez',
            agent: 'Laura Silva',
            category: 'Contract',
            rating: 3,
            comment: 'La solución fue correcta pero la comunicación podría mejorar.',
            date: '2024-01-13',
            resolvedAt: '2024-01-13T10:30:00',
            tags: ['correcto', 'comunicación']
          }
        ];

        setSatisfactionData(mockSatisfactionData);
        setCategorySatisfaction(mockCategorySatisfaction);
        setAgentPerformance(mockAgentPerformance);
        setFeedbackTrends(mockFeedbackTrends);
        setDetailedFeedback(mockDetailedFeedback);
      } catch (error) {
        console.error('Error loading satisfaction data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    loadSatisfactionData();
  }, []);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (rating >= 3.5) return <Badge className="bg-yellow-100 text-yellow-800">Bueno</Badge>;
    if (rating >= 2.5) return <Badge className="bg-orange-100 text-orange-800">Regular</Badge>;
    return <Badge className="bg-red-100 text-red-800">Pobre</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Target className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getSentimentIcon = (rating: number) => {
    if (rating >= 4) return <Smile className="w-5 h-5 text-green-600" />;
    if (rating >= 3) return <Meh className="w-5 h-5 text-yellow-600" />;
    return <Frown className="w-5 h-5 text-red-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCurrentStats = () => {
    const current = satisfactionData[0];
    if (!current) return { averageRating: 0, responseRate: 0, totalResponses: 0 };

    const positivePercentage = ((current.distribution.excellent + current.distribution.good) / current.totalResponses) * 100;
    
    return {
      averageRating: current.averageRating,
      responseRate: current.responseRate,
      totalResponses: current.totalResponses,
      positivePercentage
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte de satisfacción...</p>
        </div>
      </div>
    );
  }

  const stats = getCurrentStats();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Satisfacción del Cliente</h1>
            <p className="text-gray-600">Análisis detallado de satisfacción y feedback de clientes</p>
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
              <div className={`text-3xl font-bold ${getRatingColor(stats.averageRating)} mb-2`}>
                {stats.averageRating.toFixed(1)}/5
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(stats.averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">Calificación Promedio</div>
              {getRatingBadge(stats.averageRating)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.responseRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Tasa de Respuesta</div>
              <div className="text-xs text-gray-500 mt-1">de encuestas enviadas</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.positivePercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Feedback Positivo</div>
              <div className="flex items-center justify-center mt-1">
                <ThumbsUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">4-5 estrellas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.totalResponses}
              </div>
              <div className="text-sm text-gray-600">Respuestas Totales</div>
              <div className="text-xs text-gray-500 mt-1">últimos 30 días</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="categories">Por Categoría</TabsTrigger>
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Distribución de Calificaciones
                </CardTitle>
                <CardDescription>Desglose de calificaciones recibidas</CardDescription>
              </CardHeader>
              <CardContent>
                {satisfactionData.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Excelente (5★)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(satisfactionData[0].distribution.excellent / satisfactionData[0].totalResponses) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{satisfactionData[0].distribution.excellent}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Bueno (4★)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(satisfactionData[0].distribution.good / satisfactionData[0].totalResponses) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{satisfactionData[0].distribution.good}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Regular (3★)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${(satisfactionData[0].distribution.average / satisfactionData[0].totalResponses) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{satisfactionData[0].distribution.average}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Pobre (2★)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(satisfactionData[0].distribution.poor / satisfactionData[0].totalResponses) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{satisfactionData[0].distribution.poor}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Terrible (1★)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(satisfactionData[0].distribution.terrible / satisfactionData[0].totalResponses) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{satisfactionData[0].distribution.terrible}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Métricas Clave
                </CardTitle>
                <CardDescription>Indicadores importantes de satisfacción</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {satisfactionData.map((data) => (
                    <div key={data.period} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTrendIcon(data.trend)}
                        <div>
                          <h4 className="font-medium">{data.period}</h4>
                          <p className="text-sm text-gray-600">{data.totalResponses} respuestas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getRatingColor(data.averageRating)}`}>
                          {data.averageRating.toFixed(1)}/5
                        </p>
                        <p className="text-sm text-gray-600">{data.responseRate.toFixed(1)}% respuesta</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Satisfacción por Categoría
              </CardTitle>
              <CardDescription>Desempeño de satisfacción por tipo de servicio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categorySatisfaction.map((category) => (
                  <div key={category.category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{category.category}</h3>
                      <div className="flex items-center gap-2">
                        {getRatingBadge(category.averageRating)}
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className={`text-sm font-medium ${getRatingColor(category.averageRating)}`}>
                            {category.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-red-600">Principales Issues</h4>
                        <div className="space-y-1">
                          {category.topIssues.map((issue, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span>{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-blue-600">Sugerencias de Mejora</h4>
                        <div className="space-y-1">
                          {category.improvementSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-blue-600" />
                              <span>{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      Total de calificaciones: {category.totalRatings}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Desempeño por Agente
              </CardTitle>
              <CardDescription>Calificaciones y feedback por agente de soporte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentPerformance.map((agent) => (
                  <div key={agent.agent} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{agent.agent}</h3>
                      <div className="flex items-center gap-2">
                        {getRatingBadge(agent.averageRating)}
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className={`text-sm font-medium ${getRatingColor(agent.averageRating)}`}>
                            {agent.averageRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Calificaciones</p>
                        <p className="font-semibold">{agent.totalRatings}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tasa Respuesta</p>
                        <p className="font-semibold text-blue-600">{agent.responseRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Promedio</p>
                        <p className="font-semibold">{agent.averageRating.toFixed(1)}/5</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-green-600">Principales Comentarios Positivos</h4>
                        <div className="space-y-1">
                          {agent.topCompliments.map((compliment, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <ThumbsUp className="w-3 h-3 text-green-600" />
                              <span>{compliment}</span>
                            </div>
                          ))}
                          {agent.topCompliments.length === 0 && (
                            <p className="text-sm text-gray-500 italic">Sin quejas registradas</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-red-600">Áreas a Mejorar</h4>
                        <div className="space-y-1">
                          {agent.topComplaints.map((complaint, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <ThumbsDown className="w-3 h-3 text-red-600" />
                              <span>{complaint}</span>
                            </div>
                          ))}
                          {agent.topComplaints.length === 0 && (
                            <p className="text-sm text-gray-500 italic">Sin áreas de mejora identificadas</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tendencias de Satisfacción
              </CardTitle>
              <CardDescription>Evolución de la satisfacción del cliente over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedbackTrends.map((trend) => (
                  <div key={trend.month} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{trend.month}</h4>
                      <p className="text-sm text-gray-600">{trend.totalFeedback} respuestas</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${getRatingColor(trend.averageRating)}`}>
                          {trend.averageRating.toFixed(1)}/5
                        </span>
                        {getSentimentIcon(trend.averageRating)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {trend.responseRate.toFixed(1)}% respuesta • {trend.positivePercentage.toFixed(1)}% positivo
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Feedback Detallado
              </CardTitle>
              <CardDescription>Comentarios y calificaciones recientes de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detailedFeedback.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{feedback.clientName}</h3>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className={`font-medium ${getRatingColor(feedback.rating)}`}>
                              {feedback.rating}/5
                            </span>
                          </div>
                          {getSentimentIcon(feedback.rating)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Ticket: {feedback.ticketNumber}</span>
                          <span>Agente: {feedback.agent}</span>
                          <span>Categoría: {feedback.category}</span>
                          <span>Fecha: {formatDate(feedback.date)}</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 italic mb-2">"{feedback.comment}"</p>
                        
                        {feedback.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {feedback.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
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