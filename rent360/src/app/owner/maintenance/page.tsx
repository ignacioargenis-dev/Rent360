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
  FileText
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
  assignedTo: string
  estimatedCost: number
  actualCost: number
  requestedDate: string
  completedDate?: string
  tenantId: string
  tenantName: string
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
    estimatedCost: 350,
    actualCost: 0,
    requestedDate: '2024-01-15',
    tenantId: '1',
    tenantName: 'Alice Johnson'
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
    assignedTo: '',
    estimatedCost: 150,
    actualCost: 0,
    requestedDate: '2024-01-14',
    tenantId: '2',
    tenantName: 'Bob Wilson'
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
    estimatedCost: 200,
    actualCost: 180,
    requestedDate: '2024-01-10',
    completedDate: '2024-01-12',
    tenantId: '3',
    tenantName: 'Carol Brown'
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
    completedJobs: 45
  },
  {
    id: '2',
    name: 'Mike Davis',
    specialty: 'Electrician',
    rating: 4.9,
    phone: '+1 (555) 234-5678',
    email: 'mike.davis@electric.com',
    status: 'available',
    completedJobs: 67
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    specialty: 'Plumber',
    rating: 4.7,
    phone: '+1 (555) 345-6789',
    email: 'sarah.johnson@plumbing.com',
    status: 'available',
    completedJobs: 32
  }
]

export default function OwnerMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests)
  const [contractors, setContractors] = useState<Contractor[]>(mockContractors)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('requests')

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
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

  const totalCost = requests.reduce((sum, request) => sum + request.actualCost, 0)
  const estimatedTotalCost = requests.reduce((sum, request) => sum + request.estimatedCost, 0)
  const pendingRequests = requests.filter(r => r.status === 'pending').length
  const inProgressRequests = requests.filter(r => r.status === 'in_progress').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Management</h1>
          <p className="text-muted-foreground">Track and manage property maintenance requests</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingRequests} pending, {inProgressRequests} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Estimated: ${estimatedTotalCost.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Contractors</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractors.filter(c => c.status === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {contractors.length} total contractors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.priority === 'urgent').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
        </TabsList>

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
                        <p className="text-muted-foreground">{request.requestedDate}</p>
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
                      <CardTitle>{contractor.name}</CardTitle>
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
                      <span className="text-sm font-medium">Phone:</span>
                      <p className="text-sm">{contractor.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Email:</span>
                      <p className="text-sm">{contractor.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">Assign Job</Button>
                    <Button size="sm" variant="outline">View Profile</Button>
                    <Button size="sm" variant="outline">Contact</Button>
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