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
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Filter,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Phone,
  MessageSquare,
  User,
  Building,
  Star,
  Car,
  Coffee,
  Utensils,
  Pause,
  Play
} from 'lucide-react'

interface ScheduleEvent {
  id: string
  title: string
  type: 'task' | 'break' | 'meeting' | 'personal'
  startTime: string
  endTime: string
  date: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  propertyId?: string
  propertyName?: string
  address?: string
  clientName?: string
  clientPhone?: string
  earnings?: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  notes?: string
  duration: number
  distance?: number
  travelTime?: number
}

interface DaySchedule {
  date: string
  dayOfWeek: string
  events: ScheduleEvent[]
  totalHours: number
  totalEarnings: number
  completedTasks: number
  totalTasks: number
}

interface AvailabilitySlot {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

const mockScheduleEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Property Visit - Sunset Apartment',
    type: 'task',
    startTime: '09:00',
    endTime: '10:00',
    date: '2024-01-16',
    status: 'scheduled',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    address: '123 Sunset Blvd, Los Angeles, CA 90210',
    clientName: 'John Owner',
    clientPhone: '+1 (555) 123-4567',
    earnings: 45.00,
    priority: 'high',
    duration: 60,
    distance: 5.2,
    travelTime: 15
  },
  {
    id: '2',
    title: 'Photo Shoot - Downtown Loft',
    type: 'task',
    startTime: '11:00',
    endTime: '12:30',
    date: '2024-01-16',
    status: 'scheduled',
    propertyId: '2',
    propertyName: 'Downtown Loft 204',
    address: '456 Downtown St, Los Angeles, CA 90210',
    clientName: 'Sarah Broker',
    clientPhone: '+1 (555) 234-5678',
    earnings: 75.00,
    priority: 'medium',
    duration: 90,
    distance: 8.7,
    travelTime: 25
  },
  {
    id: '3',
    title: 'Lunch Break',
    type: 'break',
    startTime: '12:30',
    endTime: '13:30',
    date: '2024-01-16',
    status: 'scheduled',
    duration: 60
  },
  {
    id: '4',
    title: 'Document Delivery - Garden House',
    type: 'task',
    startTime: '14:00',
    endTime: '14:30',
    date: '2024-01-16',
    status: 'in_progress',
    propertyId: '3',
    propertyName: 'Garden House 15',
    address: '789 Garden Ave, Los Angeles, CA 90210',
    clientName: 'Mike Property Manager',
    clientPhone: '+1 (555) 345-6789',
    earnings: 25.00,
    priority: 'low',
    duration: 30,
    distance: 3.1,
    travelTime: 10
  }
]

const mockAvailabilitySlots: AvailabilitySlot[] = [
  { id: '1', dayOfWeek: 'Monday', startTime: '08:00', endTime: '18:00', isAvailable: true },
  { id: '2', dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '18:00', isAvailable: true },
  { id: '3', dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '18:00', isAvailable: true },
  { id: '4', dayOfWeek: 'Thursday', startTime: '08:00', endTime: '18:00', isAvailable: true },
  { id: '5', dayOfWeek: 'Friday', startTime: '08:00', endTime: '18:00', isAvailable: true },
  { id: '6', dayOfWeek: 'Saturday', startTime: '09:00', endTime: '14:00', isAvailable: true },
  { id: '7', dayOfWeek: 'Sunday', startTime: '09:00', endTime: '14:00', isAvailable: false }
]

export default function RunnerSchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>(mockScheduleEvents)
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(mockAvailabilitySlots)
  const [selectedDate, setSelectedDate] = useState('2024-01-16')
  const [viewMode, setViewMode] = useState('day')
  const [activeTab, setActiveTab] = useState('schedule')

  const todayEvents = events.filter(event => event.date === selectedDate)
  const totalHours = todayEvents.reduce((sum, event) => sum + (event.duration / 60), 0)
  const totalEarnings = todayEvents.reduce((sum, event) => sum + (event.earnings || 0), 0)
  const completedTasks = todayEvents.filter(event => event.type === 'task' && event.status === 'completed').length
  const totalTasks = todayEvents.filter(event => event.type === 'task').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'scheduled': return 'bg-yellow-500'
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
      case 'task': return <Building className="h-4 w-4" />
      case 'break': return <Coffee className="h-4 w-4" />
      case 'meeting': return <User className="h-4 w-4" />
      case 'personal': return <Pause className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const handleStartEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: 'in_progress' as const } : event
    ))
  }

  const handleCompleteEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, status: 'completed' as const } : event
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Manage your daily schedule and availability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(selectedDate)}
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              Scheduled work time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From scheduled tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
            <Progress value={(completedTasks / totalTasks) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Hours</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5h</div>
            <p className="text-xs text-muted-foreground">
              Remaining today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {/* Timeline View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule - {formatDate(selectedDate)}
              </CardTitle>
              <CardDescription>Your tasks and appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayEvents
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">
                        {formatTime(event.startTime)}
                      </div>
                      <div className="flex-1">
                        <Card className={`hover:shadow-md transition-shadow ${
                          event.status === 'in_progress' ? 'ring-2 ring-blue-500' : ''
                        }`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {getTypeIcon(event.type)}
                                  <CardTitle className="text-lg">{event.title}</CardTitle>
                                </div>
                                {event.propertyName && (
                                  <CardDescription className="flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    {event.propertyName}
                                  </CardDescription>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Badge className={`${getStatusColor(event.status)} text-white`}>
                                  {event.status.replace('_', ' ')}
                                </Badge>
                                {event.priority && (
                                  <Badge className={`${getPriorityColor(event.priority)} text-white`}>
                                    {event.priority}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Car className="h-4 w-4" />
                                  <span>{event.distance} miles</span>
                                </div>
                                {event.earnings && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4" />
                                    <span>${event.earnings.toFixed(2)}</span>
                                  </div>
                                )}
                              </div>

                              {event.address && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.address}</span>
                                </div>
                              )}

                              {event.clientName && (
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{event.clientName}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    <span>{event.clientPhone}</span>
                                  </div>
                                </div>
                              )}

                              {event.notes && (
                                <div className="bg-muted p-3 rounded-lg">
                                  <p className="text-sm">{event.notes}</p>
                                </div>
                              )}

                              <div className="flex gap-2">
                                {event.status === 'scheduled' && event.type === 'task' && (
                                  <Button size="sm" onClick={() => handleStartEvent(event.id)}>
                                    <Play className="h-4 w-4 mr-1" />
                                    Start
                                  </Button>
                                )}
                                {event.status === 'in_progress' && (
                                  <Button size="sm" onClick={() => handleCompleteEvent(event.id)}>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Complete
                                  </Button>
                                )}
                                <Button size="sm" variant="outline">
                                  <Navigation className="h-4 w-4 mr-1" />
                                  Directions
                                </Button>
                                {event.clientPhone && (
                                  <Button size="sm" variant="outline">
                                    <Phone className="h-4 w-4 mr-1" />
                                    Call
                                  </Button>
                                )}
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Message
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
              <CardDescription>Set your available working hours for each day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availability.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-24 font-medium">{slot.dayOfWeek}</div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={slot.startTime}
                          className="w-24"
                          onChange={(e) => {
                            const updated = availability.map(s => 
                              s.id === slot.id ? { ...s, startTime: e.target.value } : s
                            )
                            setAvailability(updated)
                          }}
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={slot.endTime}
                          className="w-24"
                          onChange={(e) => {
                            const updated = availability.map(s => 
                              s.id === slot.id ? { ...s, endTime: e.target.value } : s
                            )
                            setAvailability(updated)
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {slot.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          checked={slot.isAvailable}
                          onChange={(e) => {
                            const updated = availability.map(s => 
                              s.id === slot.id ? { ...s, isAvailable: e.target.checked } : s
                            )
                            setAvailability(updated)
                          }}
                          className="sr-only"
                        />
                        <div className={`block w-10 h-6 rounded-full ${
                          slot.isAvailable ? 'bg-primary' : 'bg-gray-300'
                        }`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          slot.isAvailable ? 'transform translate-x-4' : ''
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button>Save Availability</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>View your schedule in calendar format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Full calendar view coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}