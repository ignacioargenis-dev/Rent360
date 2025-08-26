'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  Eye,
  Settings,
  User,
  Building,
  FileText,
  MessageSquare,
  AlertTriangle,
  DollarSign,
  Calendar,
  Star,
  Wrench,
  MapPin,
  Clock
} from 'lucide-react'
import useSocket from '@/hooks/useSocket'

interface NotificationProps {
  id: string
  type: string
  message: string
  data?: any
  timestamp: string
  read: boolean
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'user_connected':
    case 'user_disconnected':
      return <User className="w-4 h-4" />
    case 'property_updated':
    case 'property_created':
      return <Building className="w-4 h-4" />
    case 'contract_signed':
    case 'contract_updated':
      return <FileText className="w-4 h-4" />
    case 'direct_message':
      return <MessageSquare className="w-4 h-4" />
    case 'security_alert':
      return <AlertTriangle className="w-4 h-4" />
    case 'payment_received':
    case 'payment_failed':
      return <DollarSign className="w-4 h-4" />
    case 'visit_scheduled':
    case 'visit_completed':
      return <Calendar className="w-4 h-4" />
    case 'rating_received':
      return <Star className="w-4 h-4" />
    case 'maintenance_request':
    case 'maintenance_updated':
      return <Wrench className="w-4 h-4" />
    case 'property_visit':
      return <MapPin className="w-4 h-4" />
    default:
      return <Bell className="w-4 h-4" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'security_alert':
    case 'payment_failed':
      return 'border-red-200 bg-red-50'
    case 'user_connected':
    case 'property_created':
    case 'payment_received':
    case 'visit_completed':
    case 'rating_received':
      return 'border-green-200 bg-green-50'
    case 'property_updated':
    case 'contract_signed':
    case 'contract_updated':
    case 'visit_scheduled':
    case 'maintenance_updated':
      return 'border-blue-200 bg-blue-50'
    case 'maintenance_request':
    case 'direct_message':
      return 'border-yellow-200 bg-yellow-50'
    default:
      return 'border-gray-200 bg-gray-50'
  }
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Ahora mismo'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} h`
  if (diffDays < 7) return `Hace ${diffDays} d`
  
  return date.toLocaleDateString('es-CL', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

interface RealTimeNotificationsProps {
  maxItems?: number
  showHeader?: boolean
  className?: string
}

export default function RealTimeNotifications({ 
  maxItems = 10, 
  showHeader = true, 
  className = '' 
}: RealTimeNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  
  const {
    notifications,
    unreadCount,
    isConnected,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications
  } = useSocket({ enableNotifications: true })

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  }).slice(0, maxItems)

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
  }

  const handleClearAll = () => {
    clearNotifications()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        {!isConnected && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-96 max-h-96 shadow-xl border z-50">
          {showHeader && (
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notificaciones
                    {unreadCount > 0 && (
                      <Badge className="bg-blue-500 text-white">
                        {unreadCount} nueva{unreadCount > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Conectado en tiempo real
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Sin conexión
                      </>
                    )}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
          )}

          <CardContent className="p-0">
            {/* Filter Tabs */}
            <div className="flex border-b px-4 pt-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  filter === 'all' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Todas ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  filter === 'unread' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                No leídas ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  filter === 'read' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Leídas ({notifications.filter(n => n.read).length})
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Marcar todas como leídas
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>

            {/* Notifications List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No hay notificaciones</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/30' : ''
                    } ${getNotificationColor(notification.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 h-auto"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(notification.timestamp)}
                          </div>
                          {notification.data?.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs p-1 h-auto"
                              onClick={() => {
                                // Aquí podrías navegar a la URL de acción
                                window.location.href = notification.data.actionUrl
                              }}
                            >
                              Ver
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}