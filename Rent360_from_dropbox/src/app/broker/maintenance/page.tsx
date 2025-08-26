'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Wrench, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Building,
  FileText,
  TrendingUp,
  BarChart3,
  Settings,
  Users,
  Tool,
  Phone,
  Mail,
  Star,
  Eye,
  MessageSquare
} from 'lucide-react'

interface MaintenanceRequest {
  id: string
  propertyId: string
  propertyName: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo?: string
  assignedToId?: string
  estimatedCost: number
  actualCost: number
  requestedDate: string
  completedDate?: string
  tenantId: string
  tenantName: string
  ownerId: string
  ownerName: string
  contractorId?: string
  contractorName?: string
  rating?: number
  feedback?: string
  images?: string[]
  notes?: string
  brokerId: string
  brokerName: string
}

interface Contractor {
  id: string
  name: string
  specialty: string
  rating: number
  phone: string
  email: string
  status: 'available' | 'busy' | 'unavailable'
  completedJobs: number
  totalEarnings: number
  joinDate: string
  verified: boolean
  specialties: string[]
  responseTime: number
}

interface MaintenanceStats {
  totalRequests: number
  pendingRequests: number
  inProgressRequests: number
  completedRequests: number
  cancelledRequests: number
  totalCost: number
  averageResolutionTime: number
  contractorUtilization: number
  topCategories: { category: string; count: number }[]
  monthlyTrend: { month: string; count: number }[]
  satisfactionRate: number
}

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    title: 'Broken Air Conditioning',
    description: 'AC unit not cooling properly, needs immediate repair',
    category: 'HVAC',
    priority: 'urgent',
    status: 'in_progress',
    assignedTo: 'John Smith',
    assignedToId: '1',
    estimatedCost: 350,
    actualCost: 0,
    requestedDate: '2024-01-15',
    tenantId: '1',
    tenantName: 'Alice Johnson',
    ownerId: '1',
    ownerName: 'Bob Wilson',
    contractorId: '1',
    contractorName: 'John Smith',
    brokerId: '1',
    brokerName: 'Jane Smith'
  },
  {
    id: '2',
    propertyId: '2',
    propertyName: 'Downtown Loft 204',
    title: 'Leaking Kitchen Faucet',
    description: 'Kitchen faucet leaking at base, needs replacement',
    category: 'Plumbing',
    priority: 'medium',
    status: 'pending',
    estimatedCost: 150,
    actualCost: 0,
    requestedDate: '2024-01-14',
    tenantId: '2',
    tenantName: 'Carol Brown',
    ownerId: '2',
    ownerName: 'David Davis',
    brokerId: '1',
    brokerName: 'Jane Smith'
  },
  {
    id: '3',
    propertyId: '3',
    propertyName: 'Garden House 15',
    title: 'Electrical Outlet Not Working',
    description: 'Living room outlet stopped working, may need rewiring',
    category: 'Electrical',
    priority: 'high',
    status: 'completed',
    assignedTo: 'Mike Davis',
    assignedToId: '2',
    estimatedCost: 200,
    actualCost: 180,
    requestedDate: '2024-01-10',
    completedDate: '2024-01-12',
    tenantId: '3',
    tenantName: 'Eve Wilson',
    ownerId: '3',
    ownerName: 'Frank Miller',
    contractorId: '2',
    contractorName: 'Mike Davis',
    rating: 5,
    feedback: 'Fast and professional service',
    brokerId: '1',
    brokerName: 'Jane Smith'
  },
  {
    id: '4',
    propertyId: '4',
    propertyName: 'Beach House 7',
    title: 'Broken Window',
    description: 'Bedroom window cracked during storm',
    category: 'Structural',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Sarah Johnson',
    assignedToId: '3',
    estimatedCost: 400,
    actualCost: 0,
    requestedDate: '2024-01-13',
    tenantId: '4',
    tenantName: 'Grace Lee',
    ownerId: '4',
    ownerName: 'Henry Clark',
    contractorId: '3',
    contractorName: 'Sarah Johnson',
    brokerId: '1',
    brokerName: 'Jane Smith'
  }
]

const mockContractors: Contractor[] = [
  {
    id: '1',
    name: 'John Smith',
    specialty: 'HVAC Specialist',
    rating: 4.8,
    phone: '+1 (555) 123-4567',
    email: 'john.smith@hvac.com',
    status: 'busy',
    completedJobs: 45,
    totalEarnings: 15600,
    joinDate: '2023-01-15',
    verified: true,
    specialties: ['HVAC', 'Appliance Repair'],
    responseTime: 2.5
  },
  {
    id: '2',
    name: 'Mike Davis',
    specialty: 'Electrician',
    rating: 4.9,
    phone: '+1 (555) 234-5678',
    email: 'mike.davis@electric.com',
    status: 'available',
    completedJobs: 67,
    totalEarnings: 18900,
    joinDate: '2022-08-20',
    verified: true,
    specialties: ['Electrical', 'Lighting'],
    responseTime: 1.8
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    specialty: 'Plumber',
    rating: 4.7,
    phone: '+1 (555) 345-6789',
    email: 'sarah.johnson@plumbing.com',
    status: 'busy',
    completedJobs: 32,
    totalEarnings: 12400,
    joinDate: '2023-03-10',
    verified: true,
    specialties: ['Plumbing', 'Drain Cleaning'],
    responseTime: 3.2
  }
]

const mockMaintenanceStats: MaintenanceStats = {
  totalRequests: 89,
  pendingRequests: 12,
  inProgressRequests: 8,
  completedRequests: 65,
  cancelledRequests: 4,
  totalCost: 28400,
  averageResolutionTime: 2.8,
  contractorUtilization: 82,
  topCategories: [
    { category: 'Plumbing', count: 28 },
    { category: 'Electrical', count: 24 },
    { category: 'HVAC', count: 18 },
    { category: 'Appliance', count: 12 },
    { category: 'Structural', count: 7 }
  ],
  monthlyTrend: [
    { month: 'Sep', count: 8 },
    { month: 'Oct', count: 11 },
    { month: 'Nov', count: 14 },
    { month: 'Dec', count: 17 },
    { month: 'Jan', count: 22 }
  ],
  satisfactionRate: 94
}

export default function BrokerMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests)
  const [contractors, setContractors] = useState<Contractor[]>(mockContractors)
  const [stats, setStats] = useState<MaintenanceStats>(mockMaintenanceStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getContractorStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500'
      case 'busy': return 'bg-yellow-500'
      case 'unavailable': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getCompletionRate = () => {
    return ((stats.completedRequests / stats.totalRequests) * 100).toFixed(1)
  }

  const getAverageCost = () => {
    return stats.totalCost / stats.completedRequests
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Management</h1>
          <p className="text-muted-foreground">Coordinate maintenance for your managed properties</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
                <p className="text-xs text-muted-foreground">
                  {getCompletionRate()}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRequests + stats.inProgressRequests}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingRequests} pending, {stats.inProgressRequests} in progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalCost.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Avg: ${getAverageCost().toFixed(0)} per request
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.satisfactionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Customer satisfaction
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Maintenance Categories
                </CardTitle>
                <CardDescription>Most common maintenance request types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topCategories.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Tool className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{category.count} requests</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(category.count / stats.topCategories[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Request Trend
                </CardTitle>
                <CardDescription>Maintenance requests over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.monthlyTrend.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between">
                      <span className="font-medium">{month.month}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{month.count} requests</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(month.count / stats.monthlyTrend[stats.monthlyTrend.length - 1].count) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest maintenance requests and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(request.status)}`}></div>
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-sm text-muted-foreground">{request.propertyName} • {request.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                        {request.priority}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(request.requestedDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Appliance">Appliance</SelectItem>
                    <SelectItem value="Structural">Structural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Requests List */}
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {request.propertyName}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(request.status)} text-white`}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                        {request.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Category:</span>
                        <p className="text-muted-foreground">{request.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Requested:</span>
                        <p className="text-muted-foreground">{formatDate(request.requestedDate)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span>
                        <p className="text-muted-foreground">
                          ${request.actualCost || request.estimatedCost}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Tenant:</span>
                        <p className="text-muted-foreground">{request.tenantName}</p>
                      </div>
                    </div>

                    {request.assignedTo && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span>Assigned to: {request.assignedTo}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <Button size="sm">Assign Contractor</Button>
                      )}
                      {request.status === 'in_progress' && (
                        <Button size="sm" variant="outline">View Progress</Button>
                      )}
                      <Button size="sm" variant="outline">View Details</Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <div className="grid gap-4">
            {contractors.map((contractor) => (
              <Card key={contractor.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{contractor.name}</CardTitle>
                        {contractor.verified && (
                          <Badge className="bg-green-500 text-white">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{contractor.specialty}</CardDescription>
                    </div>
                    <Badge className={`${getContractorStatusColor(contractor.status)} text-white`}>
                      {contractor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium">Rating:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">{contractor.rating}</span>
                        <span className="text-sm text-muted-foreground">/5.0</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Completed Jobs:</span>
                      <p className="text-lg font-bold">{contractor.completedJobs}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Response Time:</span>
                      <p className="text-lg font-bold">{contractor.responseTime}h</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Total Earnings:</span>
                      <p className="text-lg font-bold">${contractor.totalEarnings.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-sm font-medium">Specialties:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {contractor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm">View Profile</Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline">Assign Task</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Completed</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.completedRequests / stats.totalRequests) * 100}%` }}></div>
                      </div>
                      <span className="text-sm">{stats.completedRequests}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>In Progress</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(stats.inProgressRequests / stats.totalRequests) * 100}%` }}></div>
                      </div>
                      <span className="text-sm">{stats.inProgressRequests}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(stats.pendingRequests / stats.totalRequests) * 100}%` }}></div>
                      </div>
                      <span className="text-sm">{stats.pendingRequests}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cancelled</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.cancelledRequests / stats.totalRequests) * 100}%` }}></div>
                      </div>
                      <span className="text-sm">{stats.cancelledRequests}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Average Resolution Time</span>
                      <span className="text-sm">{stats.averageResolutionTime} days</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Contractor Utilization</span>
                      <span className="text-sm">{stats.contractorUtilization}%</span>
                    </div>
                    <Progress value={stats.contractorUtilization} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm">{getCompletionRate()}%</span>
                    </div>
                    <Progress value={parseFloat(getCompletionRate())} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Satisfaction Rate</span>
                      <span className="text-sm">{stats.satisfactionRate}%</span>
                    </div>
                    <Progress value={stats.satisfactionRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}