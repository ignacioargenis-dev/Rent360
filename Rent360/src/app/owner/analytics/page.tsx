'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react'

interface PropertyMetric {
  id: string
  name: string
  address: string
  occupancyRate: number
  monthlyRent: number
  annualRevenue: number
  expenses: number
  netIncome: number
  roi: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
  tenantSatisfaction: number
  maintenanceScore: number
}

interface FinancialMetric {
  month: string
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  occupancyRate: number
  maintenanceCosts: number
}

interface TenantMetric {
  propertyId: string
  propertyName: string
  tenantName: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
  paymentHistory: number
  satisfactionScore: number
  issuesReported: number
}

const mockPropertyMetrics: PropertyMetric[] = [
  {
    id: '1',
    name: 'Sunset Apartment 101',
    address: '123 Sunset Blvd, Los Angeles, CA',
    occupancyRate: 95,
    monthlyRent: 2500,
    annualRevenue: 28500,
    expenses: 8500,
    netIncome: 20000,
    roi: 12.5,
    status: 'excellent',
    tenantSatisfaction: 4.8,
    maintenanceScore: 92
  },
  {
    id: '2',
    name: 'Downtown Loft 204',
    address: '456 Downtown St, Los Angeles, CA',
    occupancyRate: 88,
    monthlyRent: 3200,
    annualRevenue: 33792,
    expenses: 12000,
    netIncome: 21792,
    roi: 10.8,
    status: 'good',
    tenantSatisfaction: 4.2,
    maintenanceScore: 78
  },
  {
    id: '3',
    name: 'Garden House 15',
    address: '789 Garden Ave, Los Angeles, CA',
    occupancyRate: 92,
    monthlyRent: 2800,
    annualRevenue: 30912,
    expenses: 9500,
    netIncome: 21412,
    roi: 11.2,
    status: 'good',
    tenantSatisfaction: 4.5,
    maintenanceScore: 85
  }
]

const mockFinancialMetrics: FinancialMetric[] = [
  { month: 'Jan', totalRevenue: 8500, totalExpenses: 2800, netIncome: 5700, occupancyRate: 92, maintenanceCosts: 450 },
  { month: 'Feb', totalRevenue: 8500, totalExpenses: 3200, netIncome: 5300, occupancyRate: 92, maintenanceCosts: 850 },
  { month: 'Mar', totalRevenue: 8500, totalExpenses: 2900, netIncome: 5600, occupancyRate: 95, maintenanceCosts: 350 },
  { month: 'Apr', totalRevenue: 8800, totalExpenses: 3100, netIncome: 5700, occupancyRate: 95, maintenanceCosts: 600 },
  { month: 'May', totalRevenue: 8800, totalExpenses: 3000, netIncome: 5800, occupancyRate: 95, maintenanceCosts: 400 },
  { month: 'Jun', totalRevenue: 8800, totalExpenses: 3300, netIncome: 5500, occupancyRate: 88, maintenanceCosts: 750 }
]

const mockTenantMetrics: TenantMetric[] = [
  {
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    tenantName: 'Alice Johnson',
    leaseStart: '2023-06-01',
    leaseEnd: '2024-05-31',
    monthlyRent: 2500,
    paymentHistory: 100,
    satisfactionScore: 4.8,
    issuesReported: 2
  },
  {
    propertyId: '2',
    propertyName: 'Downtown Loft 204',
    tenantName: 'Bob Wilson',
    leaseStart: '2023-03-01',
    leaseEnd: '2024-02-29',
    monthlyRent: 3200,
    paymentHistory: 95,
    satisfactionScore: 4.2,
    issuesReported: 5
  },
  {
    propertyId: '3',
    propertyName: 'Garden House 15',
    tenantName: 'Carol Brown',
    leaseStart: '2023-08-01',
    leaseEnd: '2024-07-31',
    monthlyRent: 2800,
    paymentHistory: 100,
    satisfactionScore: 4.5,
    issuesReported: 1
  }
]

export default function OwnerAnalyticsPage() {
  const [propertyMetrics, setPropertyMetrics] = useState<PropertyMetric[]>(mockPropertyMetrics)
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetric[]>(mockFinancialMetrics)
  const [tenantMetrics, setTenantMetrics] = useState<TenantMetric[]>(mockTenantMetrics)
  const [timeRange, setTimeRange] = useState('6months')
  const [selectedProperty, setSelectedProperty] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  const totalProperties = propertyMetrics.length
  const totalAnnualRevenue = propertyMetrics.reduce((sum, prop) => sum + prop.annualRevenue, 0)
  const totalAnnualExpenses = propertyMetrics.reduce((sum, prop) => sum + prop.expenses, 0)
  const totalNetIncome = propertyMetrics.reduce((sum, prop) => sum + prop.netIncome, 0)
  const averageOccupancyRate = propertyMetrics.reduce((sum, prop) => sum + prop.occupancyRate, 0) / totalProperties
  const averageROI = propertyMetrics.reduce((sum, prop) => sum + prop.roi, 0) / totalProperties
  const averageTenantSatisfaction = propertyMetrics.reduce((sum, prop) => sum + prop.tenantSatisfaction, 0) / totalProperties

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-blue-500'
      case 'fair': return 'bg-yellow-500'
      case 'poor': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Star className="h-4 w-4" />
      case 'good': return <CheckCircle className="h-4 w-4" />
      case 'fair': return <Clock className="h-4 w-4" />
      case 'poor': return <AlertCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your property portfolio</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {propertyMetrics.map(property => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAnnualRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12.5% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalNetIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +8.3% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageOccupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageROI.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +1.2% from last year
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.month}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">${metric.totalRevenue.toLocaleString()}</span>
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(metric.totalRevenue / 10000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Property Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Property Performance
                </CardTitle>
                <CardDescription>ROI and occupancy rates by property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {propertyMetrics.map((property) => (
                    <div key={property.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{property.name}</span>
                        <Badge className={`${getStatusColor(property.status)} text-white`}>
                          {property.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">ROI: </span>
                          <span className="font-medium">{property.roi}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Occupancy: </span>
                          <span className="font-medium">{property.occupancyRate}%</span>
                        </div>
                      </div>
                      <Progress value={property.occupancyRate} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Important metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">Top Performer</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sunset Apartment 101 with 12.5% ROI and 95% occupancy rate
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Growth Opportunity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider rent increases for Downtown Loft based on market rates
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span className="font-medium">Maintenance Focus</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Downtown Loft needs attention with 78% maintenance score
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <div className="grid gap-4">
            {propertyMetrics.map((property) => (
              <Card key={property.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{property.name}</CardTitle>
                      <CardDescription>{property.address}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(property.status)} text-white flex items-center gap-1`}>
                        {getStatusIcon(property.status)}
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium">Monthly Rent:</span>
                      <p className="text-lg font-bold">${property.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Occupancy Rate:</span>
                      <p className="text-lg font-bold">{property.occupancyRate}%</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Net Income:</span>
                      <p className="text-lg font-bold">${property.netIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">ROI:</span>
                      <p className="text-lg font-bold">{property.roi}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <span className="text-sm font-medium">Tenant Satisfaction:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={property.tenantSatisfaction * 20} className="flex-1" />
                        <span className="text-sm">{property.tenantSatisfaction}/5</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Maintenance Score:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={property.maintenanceScore} className="flex-1" />
                        <span className="text-sm">{property.maintenanceScore}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Annual Revenue:</span>
                      <p className="text-lg font-bold">${property.annualRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Revenue, expenses, and net income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Annual Revenue</span>
                    <span className="font-bold">${totalAnnualRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Annual Expenses</span>
                    <span className="font-bold">${totalAnnualExpenses.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Net Annual Income</span>
                      <span className="font-bold text-green-600">${totalNetIncome.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Breakdown</CardTitle>
                <CardDescription>Average monthly performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Monthly Revenue</span>
                    <span className="font-bold">${(totalAnnualRevenue / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Monthly Expenses</span>
                    <span className="font-bold">${(totalAnnualExpenses / 12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Monthly Net Income</span>
                    <span className="font-bold text-green-600">${(totalNetIncome / 12).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <div className="grid gap-4">
            {tenantMetrics.map((tenant) => (
              <Card key={tenant.propertyId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{tenant.tenantName}</CardTitle>
                      <CardDescription>{tenant.propertyName}</CardDescription>
                    </div>
                    <Badge className="bg-green-500">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium">Monthly Rent:</span>
                      <p className="text-lg font-bold">${tenant.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Payment History:</span>
                      <p className="text-lg font-bold">{tenant.paymentHistory}%</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Satisfaction:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={tenant.satisfactionScore * 20} className="flex-1" />
                        <span className="text-sm">{tenant.satisfactionScore}/5</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Issues Reported:</span>
                      <p className="text-lg font-bold">{tenant.issuesReported}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Lease Start:</span>
                      <p className="font-medium">{tenant.leaseStart}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lease End:</span>
                      <p className="font-medium">{tenant.leaseEnd}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}