'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  Wrench, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  User,
  Building,
  MessageSquare,
  Camera,
  FileText,
  Star,
  Phone,
  Mail
} from 'lucide-react'

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  requestedDate: string
  completedDate?: string
  assignedTo?: string
  estimatedCompletion?: string
  propertyId: string
  propertyName: string
  unit: string
  images?: string[]
  tenantNotes?: string
  ownerResponse?: string
  rating?: number
}

interface Contractor {
  id: string
  name: string
  specialty: string
  rating: number
  phone: string
  status: 'assigned' | 'available' | 'completed'
}

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    title: 'Broken Air Conditioning',
    description: 'The AC unit in my bedroom is not cooling properly. It\'s been making strange noises and the air is not cold.',
    category: 'HVAC',
    priority: 'urgent',
    status: 'in_progress',
    requestedDate: '2024-01-15',
    assignedTo: 'John Smith - HVAC Specialist',
    estimatedCompletion: '2024-01-18',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    unit: '101',
    images: ['image1.jpg', 'image2.jpg'],
    tenantNotes: 'Please call before coming as I work from home.',
    ownerResponse: 'John will contact you tomorrow to schedule the repair.'
  },
  {
    id: '2',
    title: 'Kitchen Faucet Leak',
    description: 'The kitchen faucet is leaking from the base. It\'s a slow leak but getting worse over time.',
    category: 'Plumbing',
    priority: 'medium',
    status: 'pending',
    requestedDate: '2024-01-14',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    unit: '101'
  },
  {
    id: '3',
    title: 'Bedroom Light Switch',
    description: 'The light switch in the master bedroom is not working consistently. Sometimes it works, sometimes it doesn\'t.',
    category: 'Electrical',
    priority: 'low',
    status: 'completed',
    requestedDate: '2024-01-10',
    completedDate: '2024-01-12',
    assignedTo: 'Mike Davis - Electrician',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    unit: '101',
    rating: 5,
    ownerResponse: 'Fixed! Let us know if you have any more issues.'
  }
]

const mockContractors: Contractor[] = [
  {
    id: '1',
    name: 'John Smith',
    specialty: 'HVAC Specialist',
    rating: 4.8,
    phone: '+1 (555) 123-4567',
    status: 'assigned'
  },
  {
    id: '2',
    name: 'Mike Davis',
    specialty: 'Electrician',
    rating: 4.9,
    phone: '+1 (555) 234-5678',
    status: 'completed'
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    specialty: 'Plumber',
    rating: 4.7,
    phone: '+1 (555) 345-6789',
    status: 'available'
  }
]

export default function TenantMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests)
  const [contractors, setContractors] = useState<Contractor[]>(mockContractors)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('requests')
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const,
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    unit: '101'
  })

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalRequests = requests.length
  const pendingRequests = requests.filter(r => r.status === 'pending').length
  const inProgressRequests = requests.filter(r => r.status === 'in_progress').length
  const completedRequests = requests.filter(r => r.status === 'completed').length
  const averageRating = requests.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / requests.filter(r => r.rating).length

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleSubmitRequest = () => {
    if (!newRequest.title || !newRequest.description || !newRequest.category) return

    const request: MaintenanceRequest = {
      id: Date.now().toString(),
      title: newRequest.title,
      description: newRequest.description,
      category: newRequest.category,
      priority: newRequest.priority,
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
      propertyId: newRequest.propertyId,
      propertyName: newRequest.propertyName,
      unit: newRequest.unit
    }

    setRequests([request, ...requests])
    setNewRequest({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      propertyId: '1',
      propertyName: 'Sunset Apartment 101',
      unit: '101'
    })
    setShowNewRequestForm(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <p className="text-muted-foreground">Submit and track maintenance requests for your unit</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowNewRequestForm(true)}
        >
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
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {pendingRequests} pending, {inProgressRequests} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Service quality
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

      {/* New Request Form */}
      {showNewRequestForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Submit New Maintenance Request</CardTitle>
              <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Brief description of the issue"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={newRequest.category} onValueChange={(value) => 
                  setNewRequest({...newRequest, category: value})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Appliance">Appliance</SelectItem>
                    <SelectItem value="Structural">Structural</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Detailed description of the maintenance issue..."
                value={newRequest.description}
                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={newRequest.priority} onValueChange={(value) => 
                  setNewRequest({...newRequest, priority: value as any})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Property</label>
                <Input value={newRequest.propertyName} disabled />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewRequestForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRequest}>
                Submit Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
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
                    <SelectItem value="Other">Other</SelectItem>
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
                        {request.propertyName} • Unit {request.unit}
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
                      {request.assignedTo && (
                        <div>
                          <span className="font-medium">Assigned to:</span>
                          <p className="text-muted-foreground">{request.assignedTo}</p>
                        </div>
                      )}
                      {request.estimatedCompletion && (
                        <div>
                          <span className="font-medium">Est. Completion:</span>
                          <p className="text-muted-foreground">{formatDate(request.estimatedCompletion)}</p>
                        </div>
                      )}
                    </div>

                    {request.images && request.images.length > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Camera className="h-4 w-4" />
                        <span>{request.images.length} image(s) attached</span>
                      </div>
                    )}

                    {request.tenantNotes && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm"><strong>Your Note:</strong> {request.tenantNotes}</p>
                      </div>
                    )}

                    {request.ownerResponse && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Owner Response:</strong> {request.ownerResponse}</p>
                      </div>
                    )}

                    {request.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Your Rating:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < request.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground">
                            {request.rating}/5
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm">View Details</Button>
                      {request.status === 'completed' && !request.rating && (
                        <Button size="sm" variant="outline">Rate Service</Button>
                      )}
                      {request.status === 'in_progress' && (
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                      )}
                      {request.images && request.images.length > 0 && (
                        <Button size="sm" variant="outline">
                          <Camera className="h-4 w-4 mr-1" />
                          View Photos
                        </Button>
                      )}
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
                    <Badge className={
                      contractor.status === 'assigned' ? 'bg-blue-500' :
                      contractor.status === 'completed' ? 'bg-green-500' :
                      'bg-gray-500'
                    }>
                      {contractor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium">Rating:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold">{contractor.rating}</span>
                        <span className="text-sm text-muted-foreground">/5.0</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Phone:</span>
                      <p className="text-sm">{contractor.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <p className="text-sm capitalize">{contractor.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline">View Profile</Button>
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