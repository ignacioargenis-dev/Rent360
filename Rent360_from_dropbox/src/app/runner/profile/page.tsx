'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Car,
  Camera,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Save,
  Shield,
  Bell,
  CreditCard,
  FileText,
  MessageSquare,
  Navigation,
  Smartphone,
  Calendar
} from 'lucide-react'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  profilePhoto: string
  bio: string
  joinDate: string
  isVerified: boolean
}

interface VehicleInfo {
  make: string
  model: string
  year: number
  color: string
  licensePlate: string
  insurance: string
  insuranceExpiry: string
  vehicleType: 'car' | 'truck' | 'van' | 'motorcycle' | 'bicycle'
}

interface PerformanceMetrics {
  totalTasks: number
  completedTasks: number
  averageRating: number
  totalEarnings: number
  responseTime: number
  completionRate: number
  onTimeRate: number
  customerSatisfaction: number
  activeStreak: number
}

interface Document {
  id: string
  name: string
  type: 'license' | 'insurance' | 'registration' | 'background_check' | 'other'
  uploadDate: string
  expiryDate?: string
  status: 'verified' | 'pending' | 'expired' | 'rejected'
}

const mockProfileData: ProfileData = {
  firstName: 'Alex',
  lastName: 'Runner',
  email: 'alex.runner@email.com',
  phone: '+1 (555) 987-6543',
  address: '123 Main Street',
  city: 'Los Angeles',
  state: 'CA',
  zipCode: '90210',
  profilePhoto: '',
  bio: 'Reliable and efficient property service runner with 2+ years of experience. Specialized in property visits, photo shoots, and document delivery. Committed to providing excellent service and maintaining high customer satisfaction.',
  joinDate: '2022-03-15',
  isVerified: true
}

const mockVehicleInfo: VehicleInfo = {
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  color: 'Silver',
  licensePlate: 'ABC123',
  insurance: 'State Farm Insurance',
  insuranceExpiry: '2024-12-31',
  vehicleType: 'car'
}

const mockPerformanceMetrics: PerformanceMetrics = {
  totalTasks: 342,
  completedTasks: 328,
  averageRating: 4.8,
  totalEarnings: 15420.50,
  responseTime: 15,
  completionRate: 95.9,
  onTimeRate: 98.2,
  customerSatisfaction: 97.5,
  activeStreak: 28
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Driver License',
    type: 'license',
    uploadDate: '2023-01-15',
    expiryDate: '2025-01-15',
    status: 'verified'
  },
  {
    id: '2',
    name: 'Vehicle Insurance',
    type: 'insurance',
    uploadDate: '2023-12-01',
    expiryDate: '2024-12-31',
    status: 'verified'
  },
  {
    id: '3',
    name: 'Background Check',
    type: 'background_check',
    uploadDate: '2022-03-10',
    status: 'verified'
  }
]

export default function RunnerProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>(mockProfileData)
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>(mockVehicleInfo)
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>(mockPerformanceMetrics)
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'expired': return 'bg-red-500'
      case 'rejected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your profile and account settings</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {profileData.firstName} {profileData.lastName}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">Runner</span>
                    {profileData.isVerified && (
                      <Badge className="bg-green-500">Verified</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.city}, {profileData.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Member since {formatDate(profileData.joinDate)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
                <CardDescription>Your key performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{performanceMetrics.totalTasks}</div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{performanceMetrics.averageRating.toFixed(1)}</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">${performanceMetrics.totalEarnings.toLocaleString()}</div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{performanceMetrics.activeStreak}</div>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completion Rate</span>
                      <span className="text-sm font-medium">{performanceMetrics.completionRate}%</span>
                    </div>
                    <Progress value={performanceMetrics.completionRate} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">On-Time Rate</span>
                      <span className="text-sm font-medium">{performanceMetrics.onTimeRate}%</span>
                    </div>
                    <Progress value={performanceMetrics.onTimeRate} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium">{performanceMetrics.customerSatisfaction}%</span>
                    </div>
                    <Progress value={performanceMetrics.customerSatisfaction} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="text-sm font-medium">{performanceMetrics.responseTime} min</span>
                    </div>
                    <Progress value={Math.max(0, 100 - performanceMetrics.responseTime * 2)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{performanceMetrics.completedTasks}</div>
                    <p className="text-sm text-muted-foreground">Completed Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{performanceMetrics.averageRating.toFixed(1)}/5</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{performanceMetrics.responseTime}m</div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Your earnings breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">${performanceMetrics.totalEarnings.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Lifetime Earnings</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">${(performanceMetrics.totalEarnings / performanceMetrics.totalTasks).toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">Average per Task</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">${(performanceMetrics.totalEarnings / 12).toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">Monthly Average</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Statistics</CardTitle>
                <CardDescription>Your task completion metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tasks Completed</span>
                    <span className="text-sm font-medium">{performanceMetrics.completedTasks}/{performanceMetrics.totalTasks}</span>
                  </div>
                  <Progress value={(performanceMetrics.completedTasks / performanceMetrics.totalTasks) * 100} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{performanceMetrics.completionRate}%</div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{performanceMetrics.onTimeRate}%</div>
                    <p className="text-sm text-muted-foreground">On-Time Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vehicle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
              <CardDescription>Your vehicle details and insurance information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Make</Label>
                      <Input value={vehicleInfo.make} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label>Model</Label>
                      <Input value={vehicleInfo.model} disabled={!isEditing} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Year</Label>
                      <Input value={vehicleInfo.year.toString()} disabled={!isEditing} />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <Input value={vehicleInfo.color} disabled={!isEditing} />
                    </div>
                  </div>
                  <div>
                    <Label>License Plate</Label>
                    <Input value={vehicleInfo.licensePlate} disabled={!isEditing} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Vehicle Type</Label>
                    <Select value={vehicleInfo.vehicleType} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        <SelectItem value="bicycle">Bicycle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Insurance Company</Label>
                    <Input value={vehicleInfo.insurance} disabled={!isEditing} />
                  </div>
                  <div>
                    <Label>Insurance Expiry</Label>
                    <Input value={formatDate(vehicleInfo.insuranceExpiry)} disabled={!isEditing} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents & Verification
              </CardTitle>
              <CardDescription>Your uploaded documents and verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{document.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {document.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {formatDate(document.uploadDate)}
                          {document.expiryDate && ` • Expires: ${formatDate(document.expiryDate)}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getDocumentStatusColor(document.status)} text-white`}>
                        {document.status}
                      </Badge>
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Update</Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload New Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="block w-10 h-6 rounded-full bg-primary"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform translate-x-4"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="block w-10 h-6 rounded-full bg-primary"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform translate-x-4"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Notifications</span>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" className="sr-only" />
                      <div className="block w-10 h-6 rounded-full bg-gray-300"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="block w-10 h-6 rounded-full bg-primary"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform translate-x-4"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Login Alerts</span>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="block w-10 h-6 rounded-full bg-primary"></div>
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transform translate-x-4"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Manage Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}