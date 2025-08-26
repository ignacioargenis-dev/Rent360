'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageSquare, 
  Search, 
  Send, 
  Phone, 
  Mail, 
  Calendar,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  Paperclip,
  DollarSign,
  FileText
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderType: 'owner' | 'tenant' | 'broker' | 'support'
  receiverId: string
  receiverName: string
  subject: string
  content: string
  timestamp: string
  isRead: boolean
  priority: 'low' | 'normal' | 'high' | 'urgent'
  category: 'inquiry' | 'maintenance' | 'lease' | 'payment' | 'general'
  propertyId?: string
  propertyName?: string
  attachments?: string[]
}

interface Tenant {
  id: string
  name: string
  propertyId: string
  propertyName: string
  email: string
  phone: string
  lastContact: string
  unreadMessages: number
}

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Alice Johnson',
    senderType: 'tenant',
    receiverId: 'owner1',
    receiverName: 'John Owner',
    subject: 'AC Repair Request',
    content: 'The air conditioning in my apartment is not working properly. It\'s been getting warmer over the past few days and now it\'s barely cooling at all. Could you please send someone to fix it?',
    timestamp: '2024-01-15T14:30:00Z',
    isRead: false,
    priority: 'high',
    category: 'maintenance',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101'
  },
  {
    id: '2',
    senderId: '3',
    senderName: 'Bob Wilson',
    senderType: 'tenant',
    receiverId: 'owner1',
    receiverName: 'John Owner',
    subject: 'Lease Renewal Question',
    content: 'Hi, I\'m interested in renewing my lease for another year. Could you let me know what the process is and if there will be any rent increases?',
    timestamp: '2024-01-14T10:15:00Z',
    isRead: true,
    priority: 'normal',
    category: 'lease',
    propertyId: '2',
    propertyName: 'Downtown Loft 204'
  },
  {
    id: '3',
    senderId: 'broker1',
    senderName: 'Mike Broker',
    senderType: 'broker',
    receiverId: 'owner1',
    receiverName: 'John Owner',
    subject: 'New Property Listing',
    content: 'I have a potential tenant interested in your Garden House property. They would like to schedule a viewing this weekend. Please let me know if this works for you.',
    timestamp: '2024-01-13T16:45:00Z',
    isRead: true,
    priority: 'normal',
    category: 'general',
    propertyId: '3',
    propertyName: 'Garden House 15'
  }
]

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    email: 'alice.johnson@email.com',
    phone: '+1 (555) 123-4567',
    lastContact: '2024-01-15',
    unreadMessages: 1
  },
  {
    id: '2',
    name: 'Bob Wilson',
    propertyId: '2',
    propertyName: 'Downtown Loft 204',
    email: 'bob.wilson@email.com',
    phone: '+1 (555) 234-5678',
    lastContact: '2024-01-14',
    unreadMessages: 0
  },
  {
    id: '3',
    name: 'Carol Brown',
    propertyId: '3',
    propertyName: 'Garden House 15',
    email: 'carol.brown@email.com',
    phone: '+1 (555) 345-6789',
    lastContact: '2024-01-10',
    unreadMessages: 0
  }
]

export default function OwnerMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [activeTab, setActiveTab] = useState('inbox')

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || message.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter
    
    return matchesSearch && matchesCategory && matchesPriority
  })

  const unreadCount = messages.filter(m => !m.isRead).length
  const urgentCount = messages.filter(m => m.priority === 'urgent' && !m.isRead).length
  const totalTenants = tenants.length
  const tenantsWithUnread = tenants.filter(t => t.unreadMessages > 0).length

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'normal': return 'bg-blue-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'maintenance': return <AlertCircle className="h-4 w-4" />
      case 'lease': return <FileText className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleSendMessage = () => {
    if (!selectedMessage || !replyContent.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'owner1',
      senderName: 'John Owner',
      senderType: 'owner',
      receiverId: selectedMessage.senderId,
      receiverName: selectedMessage.senderName,
      subject: `Re: ${selectedMessage.subject}`,
      content: replyContent,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'normal',
      category: 'general'
    }
    
    setMessages([newMessage, ...messages])
    setReplyContent('')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with tenants and property managers</p>
        </div>
        <Button className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              {urgentCount} urgent messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {tenantsWithUnread} with unread messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">
              Average response time: 2 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="inquiry">Inquiry</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <div className="grid gap-4">
            {filteredMessages.map((message) => (
              <Card 
                key={message.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
                } ${!message.isRead ? 'bg-primary/5' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{message.subject}</CardTitle>
                        {!message.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {message.senderName} • {message.senderType}
                        {message.propertyName && (
                          <>
                            <Building className="h-4 w-4 ml-2" />
                            {message.propertyName}
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getPriorityColor(message.priority)} text-white`}>
                        {message.priority}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(message.category)}
                        {message.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatTimestamp(message.timestamp)}</span>
                    <div className="flex items-center gap-2">
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          {message.attachments.length}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <div className="grid gap-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{tenant.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {tenant.propertyName}
                      </CardDescription>
                    </div>
                    {tenant.unreadMessages > 0 && (
                      <Badge className="bg-primary">
                        {tenant.unreadMessages} unread
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm font-medium">Email:</span>
                      <p className="text-sm">{tenant.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Phone:</span>
                      <p className="text-sm">{tenant.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Last Contact:</span>
                      <p className="text-sm">{tenant.lastContact}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <p className="text-sm text-green-600">Active</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">Send Message</Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sent Messages</h3>
            <p className="text-muted-foreground">Your sent messages will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Message Detail Panel */}
      {selectedMessage && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedMessage.subject}</CardTitle>
                <CardDescription>
                  From: {selectedMessage.senderName} ({selectedMessage.senderType})
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{selectedMessage.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatTimestamp(selectedMessage.timestamp)}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Reply:</label>
                <Textarea
                  placeholder="Type your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSendMessage} disabled={!replyContent.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
                <Button variant="outline">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}