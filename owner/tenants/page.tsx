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
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  Building,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  Download
} from 'lucide-react'

interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  propertyId: string
  propertyName: string
  unit: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
  securityDeposit: number
  status: 'active' | 'expired' | 'pending' | 'terminated'
  paymentStatus: 'current' | 'late' | 'overdue' | 'paid'
  lastPaymentDate: string
  nextPaymentDate: string
  paymentHistory: number
  satisfactionScore: number
  issuesReported: number
  emergencyContact: string
  emergencyPhone: string
}

interface LeaseDocument {
  id: string
  tenantId: string
  tenantName: string
  propertyName: string
  documentType: 'lease_agreement' | 'addendum' | 'renewal' | 'termination'
  documentName: string
  uploadDate: string
  expiryDate?: string
  status: 'active' | 'expired' | 'pending'
}

interface PaymentRecord {
  id: string
  tenantId: string
  tenantName: string
  propertyName: string
  amount: number
  dueDate: string
  paidDate?: string
  status: 'paid' | 'pending' | 'late' | 'overdue'
  paymentMethod: 'check' | 'bank_transfer' | 'credit_card' | 'cash'
}

const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    phone: '+1 (555) 123-4567',
    propertyId: '1',
    propertyName: 'Sunset Apartment 101',
    unit: '101',
    leaseStart: '2023-06-01',
    leaseEnd: '2024-05-31',
    monthlyRent: 2500,
    securityDeposit: 2500,
    status: 'active',
    paymentStatus: 'current',
    lastPaymentDate: '2024-01-01',
    nextPaymentDate: '2024-02-01',
    paymentHistory: 100,
    satisfactionScore: 4.8,
    issuesReported: 2,
    emergencyContact: 'John Johnson',
    emergencyPhone: '+1 (555) 987-6543'
  },
  {
    id: '2',
    name: 'Bob Wilson',
    email: 'bob.wilson@email.com',
    phone: '+1 (555) 234-5678',
    propertyId: '2',
    propertyName: 'Downtown Loft 204',
    unit: '204',
    leaseStart: '2023-03-01',
    leaseEnd: '2024-02-29',
    monthlyRent: 3200,
    securityDeposit: 3200,
    status: 'active',
    paymentStatus: 'late',
    lastPaymentDate: '2023-12-15',
    nextPaymentDate: '2024-01-01',
    paymentHistory: 95,
    satisfactionScore: 4.2,
    issuesReported: 5,
    emergencyContact: 'Sarah Wilson',
    emergencyPhone: '+1 (555) 876-5432'
  },
  {
    id: '3',
    name: 'Carol Brown',
    email: 'carol.brown@email.com',
    phone: '+1 (555) 345-6789',
    propertyId: '3',
    propertyName: 'Garden House 15',
    unit: '15',
    leaseStart: '2023-08-01',
    leaseEnd: '2024-07-31',
    monthlyRent: 2800,
    securityDeposit: 2800,
    status: 'active',
    paymentStatus: 'current',
    lastPaymentDate: '2024-01-01',
    nextPaymentDate: '2024-02-01',
    paymentHistory: 100,
    satisfactionScore: 4.5,
    issuesReported: 1,
    emergencyContact: 'Mike Brown',
    emergencyPhone: '+1 (555) 765-4321'
  }
]

const mockLeaseDocuments: LeaseDocument[] = [
  {
    id: '1',
    tenantId: '1',
    tenantName: 'Alice Johnson',
    propertyName: 'Sunset Apartment 101',
    documentType: 'lease_agreement',
    documentName: 'Lease Agreement - Alice Johnson',
    uploadDate: '2023-05-15',
    expiryDate: '2024-05-31',
    status: 'active'
  },
  {
    id: '2',
    tenantId: '2',
    tenantName: 'Bob Wilson',
    propertyName: 'Downtown Loft 204',
    documentType: 'lease_agreement',
    documentName: 'Lease Agreement - Bob Wilson',
    uploadDate: '2023-02-15',
    expiryDate: '2024-02-29',
    status: 'active'
  }
]

const mockPaymentRecords: PaymentRecord[] = [
  {
    id: '1',
    tenantId: '1',
    tenantName: 'Alice Johnson',
    propertyName: 'Sunset Apartment 101',
    amount: 2500,
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    status: 'paid',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '2',
    tenantId: '2',
    tenantName: 'Bob Wilson',
    propertyName: 'Downtown Loft 204',
    amount: 3200,
    dueDate: '2024-01-01',
    status: 'late',
    paymentMethod: 'check'
  },
  {
    id: '3',
    tenantId: '3',
    tenantName: 'Carol Brown',
    propertyName: 'Garden House 15',
    amount: 2800,
    dueDate: '2024-01-01',
    paidDate: '2024-01-01',
    status: 'paid',
    paymentMethod: 'credit_card'
  }
]

export default function OwnerTenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [leaseDocuments, setLeaseDocuments] = useState<LeaseDocument[]>(mockLeaseDocuments)
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(mockPaymentRecords)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [propertyFilter, setPropertyFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('tenants')

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter
    const matchesProperty = propertyFilter === 'all' || tenant.propertyId === propertyFilter
    
    return matchesSearch && matchesStatus && matchesProperty
  })

  const totalTenants = tenants.length
  const activeTenants = tenants.filter(t => t.status === 'active').length
  const totalMonthlyRevenue = tenants.reduce((sum, tenant) => sum + tenant.monthlyRent, 0)
  const averageSatisfaction = tenants.reduce((sum, tenant) => sum + tenant.satisfactionScore, 0) / totalTenants
  const latePayments = tenants.filter(t => t.paymentStatus === 'late' || t.paymentStatus === 'overdue').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'expired': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      case 'terminated': return 'bg-gray-500'
      case 'current': return 'bg-green-500'
      case 'late': return 'bg-orange-500'
      case 'overdue': return 'bg-red-500'
      case 'paid': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600'
      case 'pending': return 'text-yellow-600'
      case 'late': return 'text-orange-600'
      case 'overdue': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">Manage tenants, leases, and payments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              {activeTenants} active tenants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From active leases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latePayments}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageSatisfaction.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Tenant satisfaction
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="leases">Leases</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search tenants..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    {Array.from(new Set(tenants.map(t => ({ id: t.propertyId, name: t.propertyName })))).map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tenants List */}
          <div className="grid gap-4">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {tenant.propertyName} • Unit {tenant.unit}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(tenant.status)} text-white`}>
                        {tenant.status}
                      </Badge>
                      <Badge className={`${getStatusColor(tenant.paymentStatus)} text-white`}>
                        {tenant.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium">Monthly Rent:</span>
                      <p className="text-lg font-bold">${tenant.monthlyRent.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Lease Period:</span>
                      <p className="text-sm">{formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Payment History:</span>
                      <p className="text-sm">{tenant.paymentHistory}% on time</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Satisfaction:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={tenant.satisfactionScore * 20} className="flex-1" />
                        <span className="text-sm">{tenant.satisfactionScore}/5</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium">Email:</span>
                      <p className="text-muted-foreground">{tenant.email}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p className="text-muted-foreground">{tenant.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium">Emergency Contact:</span>
                      <p className="text-muted-foreground">{tenant.emergencyContact}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">View Details</Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Lease
                    </Button>
                    <Button size="sm" variant="outline">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Payments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leases" className="space-y-4">
          <div className="grid gap-4">
            {leaseDocuments.map((document) => (
              <Card key={document.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{document.documentName}</CardTitle>
                      <CardDescription>
                        {document.tenantName} • {document.propertyName}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(document.status)} text-white`}>
                      {document.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium">Document Type:</span>
                      <p className="text-sm text-muted-foreground">
                        {document.documentType.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Upload Date:</span>
                      <p className="text-sm text-muted-foreground">{formatDate(document.uploadDate)}</p>
                    </div>
                    {document.expiryDate && (
                      <div>
                        <span className="text-sm font-medium">Expiry Date:</span>
                        <p className="text-sm text-muted-foreground">{formatDate(document.expiryDate)}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">View Document</Button>
                    <Button size="sm" variant="outline">Send Copy</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4">
            {paymentRecords.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">${payment.amount.toLocaleString()}</CardTitle>
                      <CardDescription>
                        {payment.tenantName} • {payment.propertyName}
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(payment.status)} text-white`}>
                      {payment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium">Due Date:</span>
                      <p className="text-sm">{formatDate(payment.dueDate)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Paid Date:</span>
                      <p className="text-sm">{payment.paidDate ? formatDate(payment.paidDate) : 'Not paid'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Payment Method:</span>
                      <p className="text-sm">{payment.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <p className={`text-sm font-medium ${getPaymentStatusColor(payment.status)}`}>
                        {payment.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {payment.status === 'pending' && (
                      <Button size="sm">Mark as Paid</Button>
                    )}
                    {payment.status === 'late' && (
                      <Button size="sm" variant="outline">Send Reminder</Button>
                    )}
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Download Receipt</Button>
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