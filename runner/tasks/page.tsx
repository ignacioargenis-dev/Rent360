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
  CheckSquare, 
  Clock, 
  MapPin, 
  Calendar, 
  Camera,
  Phone,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Truck,
  User,
  Building,
  Star,
  Navigation,
  FileText,
  Search
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  type: 'property_visit' | 'photo_shoot' | 'document_delivery' | 'maintenance_check' | 'key_handover'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  assignedDate: string
  dueDate: string
  completedDate?: string
  propertyId: string
  propertyName: string
  address: string
  unit?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  instructions?: string
  requirements: string[]
  estimatedDuration: number
  actualDuration?: number
  earnings: number
  rating?: number
  feedback?: string
  photosRequired: number
  photosUploaded: number
  notes?: string
}

interface TaskStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  pendingTasks: number
  totalEarnings: number
  averageRating: number
  completionRate: number
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Property Visit - Sunset Apartment',
    description: 'Conduct comprehensive property visit and inspection',
    type: 'property_visit',
    priority: 'high',
    status: 'in_progress',
    assignedDate: '2024-01-15',
    dueDate: '2024-01-16',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    address: '123 Sunset Blvd, Los Angeles, CA 90210',
    unit: '101',
    clientName: 'John Owner',
    clientPhone: '+1 (555) 123-4567',
    clientEmail: 'john.owner@email.com',
    instructions: 'Please check all appliances, take photos of each room, and test all light switches.',
    requirements: ['Check all appliances', 'Take photos of each room', 'Test light switches', 'Check plumbing'],
    estimatedDuration: 60,
    earnings: 45.00,
    photosRequired: 10,
    photosUploaded: 7,
    notes: 'Currently in progress, kitchen and living room completed.'
  },
  {
    id: '2',
    title: 'Photo Shoot - Downtown Loft',
    description: 'Professional photo shoot for property listing',
    type: 'photo_shoot',
    priority: 'medium',
    status: 'assigned',
    assignedDate: '2024-01-14',
    dueDate: '2024-01-17',
    propertyId: '2',
    propertyName: 'Downtown Loft 204',
    address: '456 Downtown St, Los Angeles, CA 90210',
    unit: '204',
    clientName: 'Sarah Broker',
    clientPhone: '+1 (555) 234-5678',
    clientEmail: 'sarah.broker@email.com',
    instructions: 'Need high-quality photos for listing. Focus on natural lighting and best features.',
    requirements: ['Living room shots', 'Kitchen photos', 'Bedroom photos', 'Bathroom photos', 'Building exterior'],
    estimatedDuration: 90,
    earnings: 75.00,
    photosRequired: 15,
    photosUploaded: 0
  },
  {
    id: '3',
    title: 'Document Delivery - Garden House',
    description: 'Deliver lease documents to tenant',
    type: 'document_delivery',
    priority: 'low',
    status: 'completed',
    assignedDate: '2024-01-13',
    dueDate: '2024-01-14',
    completedDate: '2024-01-13',
    propertyId: '3',
    propertyName: 'Garden House 15',
    address: '789 Garden Ave, Los Angeles, CA 90210',
    unit: '15',
    clientName: 'Mike Property Manager',
    clientPhone: '+1 (555) 345-6789',
    requirements: ['Deliver documents', 'Get signature', 'Return copies'],
    estimatedDuration: 30,
    actualDuration: 25,
    earnings: 25.00,
    rating: 5,
    feedback: 'Great job! Fast and professional service.',
    photosRequired: 0,
    photosUploaded: 0
  }
]

const mockTaskStats: TaskStats = {
  totalTasks: 45,
  completedTasks: 38,
  inProgressTasks: 2,
  pendingTasks: 5,
  totalEarnings: 2150.00,
  averageRating: 4.8,
  completionRate: 84.4
}

export default function RunnerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [taskStats, setTaskStats] = useState<TaskStats>(mockTaskStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('tasks')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesType = typeFilter === 'all' || task.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-emerald-500'
      case 'assigned': return 'bg-yellow-500'
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property_visit': return <Building className="h-4 w-4" />
      case 'photo_shoot': return <Camera className="h-4 w-4" />
      case 'document_delivery': return <FileText className="h-4 w-4" />
      case 'maintenance_check': return <CheckSquare className="h-4 w-4" />
      case 'key_handover': return <CheckSquare className="h-4 w-4" />
      default: return <CheckSquare className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleStartTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'in_progress' as const } : task
    ))
  }

  const handleCompleteTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        status: 'completed' as const,
        completedDate: new Date().toISOString().split('T')[0]
      } : task
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks & Assignments</h1>
          <p className="text-muted-foreground">Manage your property service tasks and assignments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          View Schedule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.inProgressTasks + taskStats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {taskStats.inProgressTasks} in progress, {taskStats.pendingTasks} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${taskStats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.averageRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Service quality rating
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="available">Available Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="property_visit">Property Visit</SelectItem>
                    <SelectItem value="photo_shoot">Photo Shoot</SelectItem>
                    <SelectItem value="document_delivery">Document Delivery</SelectItem>
                    <SelectItem value="maintenance_check">Maintenance Check</SelectItem>
                    <SelectItem value="key_handover">Key Handover</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Priority" />
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

          {/* Tasks List */}
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(task.type)}
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {task.propertyName} {task.unit && `• Unit ${task.unit}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(task.status)} text-white`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Client:</span>
                        <p className="text-muted-foreground">{task.clientName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <p className="text-muted-foreground">{formatDate(task.dueDate)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>
                        <p className="text-muted-foreground">{task.estimatedDuration} min</p>
                      </div>
                      <div>
                        <span className="font-medium">Earnings:</span>
                        <p className="text-muted-foreground font-bold">${task.earnings.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{task.address}</span>
                    </div>

                    {task.instructions && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Instructions:</strong> {task.instructions}</p>
                      </div>
                    )}

                    {task.requirements.length > 0 && (
                      <div>
                        <span className="text-sm font-medium">Requirements:</span>
                        <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                          {task.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckSquare className="h-3 w-3" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {task.photosRequired > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          <span className="text-sm">Photos: {task.photosUploaded}/{task.photosRequired}</span>
                        </div>
                        <Progress 
                          value={(task.photosUploaded / task.photosRequired) * 100} 
                          className="w-24"
                        />
                      </div>
                    )}

                    {task.notes && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm"><strong>Notes:</strong> {task.notes}</p>
                      </div>
                    )}

                    {task.rating && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Client Rating:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < task.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground">
                            {task.rating}/5
                          </span>
                        </div>
                      </div>
                    )}

                    {task.feedback && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Client Feedback:</strong> {task.feedback}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {task.status === 'assigned' && (
                        <Button size="sm" onClick={() => handleStartTask(task.id)}>
                          <Clock className="h-4 w-4 mr-1" />
                          Start Task
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button size="sm" onClick={() => handleCompleteTask(task.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete Task
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Navigation className="h-4 w-4 mr-1" />
                        Get Directions
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Client
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      {task.photosRequired > 0 && (
                        <Button size="sm" variant="outline">
                          <Camera className="h-4 w-4 mr-1" />
                          Upload Photos
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="text-center py-8">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Available Tasks</h3>
            <p className="text-muted-foreground mb-4">
              Browse and claim available tasks in your area
            </p>
            <Button>Find Available Tasks</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}