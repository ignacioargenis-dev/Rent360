'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Bell, 
  Mail,
  Database,
  Users,
  CreditCard,
  FileText,
  Globe,
  Smartphone,
  Key,
  CheckCircle,
  AlertTriangle,
  Info,
  Building,
  Zap,
  Link,
  Palette
} from 'lucide-react';
import { User } from '@/types';
import EnhancedDashboardLayout from '@/components/dashboard/EnhancedDashboardLayout';

interface SystemSettings {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  maxPropertyImages: number;
  maxFileSize: number;
  currency: string;
  timezone: string;
  language: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  newPropertyAlerts: boolean;
  paymentReminders: boolean;
  maintenanceAlerts: boolean;
  supportAlerts: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecial: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  encryption: 'none' | 'ssl' | 'tls';
}

interface PaymentSettings {
  enabled: boolean;
  provider: 'stripe' | 'paypal' | 'webpay' | 'transbank';
  apiKey: string;
  secretKey: string;
  environment: 'sandbox' | 'production';
  commissionRate: number;
}

interface IntegrationSettings {
  googleMaps: boolean;
  googleAnalytics: boolean;
  facebookPixel: boolean;
  webhookUrl: string;
  apiEnabled: boolean;
  apiKey: string;
}

interface AdvancedSettings {
  debugMode: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  cacheEnabled: boolean;
  cacheTimeout: number;
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  theme: 'light' | 'dark' | 'auto';
}

export default function AdminSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Rent360',
    siteUrl: 'https://rent360.cl',
    adminEmail: 'admin@rent360.cl',
    supportEmail: 'soporte@rent360.cl',
    maintenanceMode: false,
    allowRegistrations: true,
    maxPropertyImages: 10,
    maxFileSize: 5,
    currency: 'CLP',
    timezone: 'America/Santiago',
    language: 'es'
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newPropertyAlerts: true,
    paymentReminders: true,
    maintenanceAlerts: true,
    supportAlerts: true
  });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    lockoutDuration: 900
  });
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@rent360.cl',
    fromName: 'Rent360',
    encryption: 'tls'
  });
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    enabled: false,
    provider: 'transbank',
    apiKey: '',
    secretKey: '',
    environment: 'sandbox',
    commissionRate: 5.0
  });
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
    googleMaps: true,
    googleAnalytics: false,
    facebookPixel: false,
    webhookUrl: '',
    apiEnabled: false,
    apiKey: ''
  });
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    debugMode: false,
    logLevel: 'error',
    cacheEnabled: true,
    cacheTimeout: 3600,
    backupEnabled: true,
    backupFrequency: 'daily',
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('system');

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Show success message
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'system', label: 'Sistema', icon: Settings },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'integrations', label: 'Integraciones', icon: Link },
    { id: 'advanced', label: 'Avanzado', icon: Zap }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedDashboardLayout
      user={user}
      title="Configuración del Sistema"
      subtitle="Administra la configuración global de Rent360"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
            <p className="text-gray-600 mt-2">Gestiona las preferencias globales de la plataforma</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Restablecer
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'system' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Configuración General
                  </CardTitle>
                  <CardDescription>
                    Información básica del sitio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Sitio
                    </label>
                    <Input
                      value={systemSettings.siteName}
                      onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL del Sitio
                    </label>
                    <Input
                      value={systemSettings.siteUrl}
                      onChange={(e) => setSystemSettings({...systemSettings, siteUrl: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Administración
                    </label>
                    <Input
                      type="email"
                      value={systemSettings.adminEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, adminEmail: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Soporte
                    </label>
                    <Input
                      type="email"
                      value={systemSettings.supportEmail}
                      onChange={(e) => setSystemSettings({...systemSettings, supportEmail: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Regional Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Configuración Regional
                  </CardTitle>
                  <CardDescription>
                    Preferencias de idioma y moneda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moneda
                    </label>
                    <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                        <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zona Horaria
                    </label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Santiago">Santiago</SelectItem>
                        <SelectItem value="America/Lima">Lima</SelectItem>
                        <SelectItem value="America/Mexico_City">Ciudad de México</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma
                    </label>
                    <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuración del Sistema
                  </CardTitle>
                  <CardDescription>
                    Opciones de funcionamiento del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Modo Mantenimiento</div>
                      <div className="text-sm text-gray-600">
                        Desactiva el sitio para mantenimiento
                      </div>
                    </div>
                    <Button
                      variant={systemSettings.maintenanceMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                    >
                      {systemSettings.maintenanceMode ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Permitir Registros</div>
                      <div className="text-sm text-gray-600">
                        Permite que nuevos usuarios se registren
                      </div>
                    </div>
                    <Button
                      variant={systemSettings.allowRegistrations ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSystemSettings({...systemSettings, allowRegistrations: !systemSettings.allowRegistrations})}
                    >
                      {systemSettings.allowRegistrations ? 'Permitido' : 'Bloqueado'}
                    </Button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Imágenes por Propiedad
                    </label>
                    <Input
                      type="number"
                      value={systemSettings.maxPropertyImages}
                      onChange={(e) => setSystemSettings({...systemSettings, maxPropertyImages: parseInt(e.target.value)})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamaño Máximo de Archivo (MB)
                    </label>
                    <Input
                      type="number"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: parseInt(e.target.value)})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Configuración de Notificaciones
                  </CardTitle>
                  <CardDescription>
                    Gestiona cómo y cuándo se envían las notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Notificaciones por Email</div>
                        <div className="text-sm text-gray-600">
                          Enviar notificaciones al correo electrónico
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={notificationSettings.emailNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
                    >
                      {notificationSettings.emailNotifications ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Notificaciones SMS</div>
                        <div className="text-sm text-gray-600">
                          Enviar notificaciones por mensaje de texto
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={notificationSettings.smsNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationSettings({...notificationSettings, smsNotifications: !notificationSettings.smsNotifications})}
                    >
                      {notificationSettings.smsNotifications ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Notificaciones Push</div>
                        <div className="text-sm text-gray-600">
                          Notificaciones en tiempo real en el navegador
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={notificationSettings.pushNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationSettings({...notificationSettings, pushNotifications: !notificationSettings.pushNotifications})}
                    >
                      {notificationSettings.pushNotifications ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Tipos de Notificaciones
                  </CardTitle>
                  <CardDescription>
                    Selecciona qué eventos generan notificaciones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Nuevas Propiedades</div>
                        <div className="text-sm text-gray-600">
                          Alertas cuando se publican nuevas propiedades
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={notificationSettings.newPropertyAlerts ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationSettings({...notificationSettings, newPropertyAlerts: !notificationSettings.newPropertyAlerts})}
                    >
                      {notificationSettings.newPropertyAlerts ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Recordatorios de Pago</div>
                        <div className="text-sm text-gray-600">
                          Notificaciones antes de las fechas de pago
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={notificationSettings.paymentReminders ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationSettings({...notificationSettings, paymentReminders: !notificationSettings.paymentReminders})}
                    >
                      {notificationSettings.paymentReminders ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Alertas de Mantenimiento</div>
                        <div className="text-sm text-gray-600">
                          Notificaciones de solicitudes de mantenimiento
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={notificationSettings.maintenanceAlerts ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationSettings({...notificationSettings, maintenanceAlerts: !notificationSettings.maintenanceAlerts})}
                    >
                      {notificationSettings.maintenanceAlerts ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Alertas de Soporte</div>
                        <div className="text-sm text-gray-600">
                          Notificaciones de nuevos tickets de soporte
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={notificationSettings.supportAlerts ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationSettings({...notificationSettings, supportAlerts: !notificationSettings.supportAlerts})}
                    >
                      {notificationSettings.supportAlerts ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Configuración de Seguridad
                  </CardTitle>
                  <CardDescription>
                    Opciones de seguridad y autenticación
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Autenticación de Dos Factores</div>
                        <div className="text-sm text-gray-600">
                          Requiere verificación en dos pasos
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={securitySettings.twoFactorAuth ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
                    >
                      {securitySettings.twoFactorAuth ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitud Mínima de Contraseña
                    </label>
                    <Input
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo de Sesión (segundos)
                    </label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intentos Máximos de Inicio de Sesión
                    </label>
                    <Input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración de Bloqueo (segundos)
                    </label>
                    <Input
                      type="number"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Requisitos de Contraseña
                  </CardTitle>
                  <CardDescription>
                    Configura los requisitos para crear contraseñas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Requerir Mayúsculas</div>
                      <div className="text-sm text-gray-600">
                        Las contraseñas deben contener letras mayúsculas
                      </div>
                    </div>
                    <Button
                      variant={securitySettings.passwordRequireUppercase ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSecuritySettings({...securitySettings, passwordRequireUppercase: !securitySettings.passwordRequireUppercase})}
                    >
                      {securitySettings.passwordRequireUppercase ? 'Requerido' : 'Opcional'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Requerir Números</div>
                      <div className="text-sm text-gray-600">
                        Las contraseñas deben contener números
                      </div>
                    </div>
                    <Button
                      variant={securitySettings.passwordRequireNumbers ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSecuritySettings({...securitySettings, passwordRequireNumbers: !securitySettings.passwordRequireNumbers})}
                    >
                      {securitySettings.passwordRequireNumbers ? 'Requerido' : 'Opcional'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Requerir Caracteres Especiales</div>
                      <div className="text-sm text-gray-600">
                        Las contraseñas deben contener caracteres especiales
                      </div>
                    </div>
                    <Button
                      variant={securitySettings.passwordRequireSpecial ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSecuritySettings({...securitySettings, passwordRequireSpecial: !securitySettings.passwordRequireSpecial})}
                    >
                      {securitySettings.passwordRequireSpecial ? 'Requerido' : 'Opcional'}
                    </Button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900">Consejo de Seguridad</div>
                        <div className="text-sm text-blue-700 mt-1">
                          Una contraseña fuerte debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Configuración SMTP
                  </CardTitle>
                  <CardDescription>
                    Configura el servidor de correo saliente
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Servidor SMTP
                      </label>
                      <Input
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Puerto
                      </label>
                      <Input
                        type="number"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                        placeholder="587"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Usuario SMTP
                      </label>
                      <Input
                        value={emailSettings.smtpUsername}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña SMTP
                      </label>
                      <Input
                        type="password"
                        value={emailSettings.smtpPassword}
                        onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cifrado
                    </label>
                    <Select value={emailSettings.encryption} onValueChange={(value) => setEmailSettings({...emailSettings, encryption: value as EmailSettings['encryption']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin cifrado</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Configuración de Emails
                  </CardTitle>
                  <CardDescription>
                    Personaliza los detalles de los correos enviados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Remitente
                    </label>
                    <Input
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                      placeholder="noreply@rent360.cl"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Remitente
                    </label>
                    <Input
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                      placeholder="Rent360"
                    />
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-900">Configuración Recomendada</div>
                        <div className="text-sm text-green-700 mt-1">
                          Usa Gmail con TLS en el puerto 587 para mejor deliverabilidad.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Configuración de Pagos
                  </CardTitle>
                  <CardDescription>
                    Habilita y configura los procesadores de pago
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Habilitar Pagos</div>
                      <div className="text-sm text-gray-600">
                        Permite procesar pagos en línea
                      </div>
                    </div>
                    <Button
                      variant={paymentSettings.enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaymentSettings({...paymentSettings, enabled: !paymentSettings.enabled})}
                    >
                      {paymentSettings.enabled ? 'Habilitado' : 'Deshabilitado'}
                    </Button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procesador de Pago
                    </label>
                    <Select value={paymentSettings.provider} onValueChange={(value) => setPaymentSettings({...paymentSettings, provider: value as PaymentSettings['provider']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transbank">Transbank</SelectItem>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="webpay">WebPay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ambiente
                    </label>
                    <Select value={paymentSettings.environment} onValueChange={(value) => setPaymentSettings({...paymentSettings, environment: value as PaymentSettings['environment']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Pruebas (Sandbox)</SelectItem>
                        <SelectItem value="production">Producción</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tasa de Comisión (%)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={paymentSettings.commissionRate}
                      onChange={(e) => setPaymentSettings({...paymentSettings, commissionRate: parseFloat(e.target.value)})}
                      placeholder="5.0"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Credenciales de API
                  </CardTitle>
                  <CardDescription>
                    Configura las claves de API del procesador
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <Input
                      value={paymentSettings.apiKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, apiKey: e.target.value})}
                      placeholder="pk_test_..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key
                    </label>
                    <Input
                      type="password"
                      value={paymentSettings.secretKey}
                      onChange={(e) => setPaymentSettings({...paymentSettings, secretKey: e.target.value})}
                      placeholder="sk_test_..."
                    />
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-900">Modo Pruebas</div>
                        <div className="text-sm text-yellow-700 mt-1">
                          Estás en modo sandbox. Usa credenciales de prueba para desarrollo.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5" />
                    Integraciones Externas
                  </CardTitle>
                  <CardDescription>
                    Conecta servicios de terceros
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Google Maps</div>
                        <div className="text-sm text-gray-600">
                          Mostrar mapas en las propiedades
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={integrationSettings.googleMaps ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIntegrationSettings({...integrationSettings, googleMaps: !integrationSettings.googleMaps})}
                    >
                      {integrationSettings.googleMaps ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Google Analytics</div>
                        <div className="text-sm text-gray-600">
                          Seguimiento de analíticas
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={integrationSettings.googleAnalytics ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIntegrationSettings({...integrationSettings, googleAnalytics: !integrationSettings.googleAnalytics})}
                    >
                      {integrationSettings.googleAnalytics ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Facebook Pixel</div>
                        <div className="text-sm text-gray-600">
                          Seguimiento de conversiones
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={integrationSettings.facebookPixel ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIntegrationSettings({...integrationSettings, facebookPixel: !integrationSettings.facebookPixel})}
                    >
                      {integrationSettings.facebookPixel ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Configuración API
                  </CardTitle>
                  <CardDescription>
                    Configura el acceso a la API REST
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Habilitar API</div>
                      <div className="text-sm text-gray-600">
                        Permite acceso mediante API REST
                      </div>
                    </div>
                    <Button
                      variant={integrationSettings.apiEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIntegrationSettings({...integrationSettings, apiEnabled: !integrationSettings.apiEnabled})}
                    >
                      {integrationSettings.apiEnabled ? 'Habilitada' : 'Deshabilitada'}
                    </Button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <Input
                      value={integrationSettings.apiKey}
                      onChange={(e) => setIntegrationSettings({...integrationSettings, apiKey: e.target.value})}
                      placeholder="rent360_..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL
                    </label>
                    <Input
                      value={integrationSettings.webhookUrl}
                      onChange={(e) => setIntegrationSettings({...integrationSettings, webhookUrl: e.target.value})}
                      placeholder="https://tu-sitio.com/webhook"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Configuración Avanzada
                  </CardTitle>
                  <CardDescription>
                    Opciones avanzadas del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Modo Debug</div>
                      <div className="text-sm text-gray-600">
                        Muestra información detallada de depuración
                      </div>
                    </div>
                    <Button
                      variant={advancedSettings.debugMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAdvancedSettings({...advancedSettings, debugMode: !advancedSettings.debugMode})}
                    >
                      {advancedSettings.debugMode ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Caché Habilitado</div>
                      <div className="text-sm text-gray-600">
                        Mejora el rendimiento usando caché
                      </div>
                    </div>
                    <Button
                      variant={advancedSettings.cacheEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAdvancedSettings({...advancedSettings, cacheEnabled: !advancedSettings.cacheEnabled})}
                    >
                      {advancedSettings.cacheEnabled ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Respaldo Automático</div>
                      <div className="text-sm text-gray-600">
                        Copias de seguridad automáticas
                      </div>
                    </div>
                    <Button
                      variant={advancedSettings.backupEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAdvancedSettings({...advancedSettings, backupEnabled: !advancedSettings.backupEnabled})}
                    >
                      {advancedSettings.backupEnabled ? 'Activado' : 'Desactivado'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Personalización
                  </CardTitle>
                  <CardDescription>
                    Configura el comportamiento y apariencia
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de Log
                    </label>
                    <Select value={advancedSettings.logLevel} onValueChange={(value) => setAdvancedSettings({...advancedSettings, logLevel: value as AdvancedSettings['logLevel']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Advertencia</SelectItem>
                        <SelectItem value="info">Información</SelectItem>
                        <SelectItem value="debug">Depuración</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo de Caché (segundos)
                    </label>
                    <Input
                      type="number"
                      value={advancedSettings.cacheTimeout}
                      onChange={(e) => setAdvancedSettings({...advancedSettings, cacheTimeout: parseInt(e.target.value)})}
                      placeholder="3600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frecuencia de Respaldo
                    </label>
                    <Select value={advancedSettings.backupFrequency} onValueChange={(value) => setAdvancedSettings({...advancedSettings, backupFrequency: value as AdvancedSettings['backupFrequency']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tema
                    </label>
                    <Select value={advancedSettings.theme} onValueChange={(value) => setAdvancedSettings({...advancedSettings, theme: value as AdvancedSettings['theme']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="auto">Automático</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Status Messages */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">Sistema Operativo</div>
                  <div className="text-sm text-green-700">Todas las funciones están activas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="font-medium text-yellow-900">Atención</div>
                  <div className="text-sm text-yellow-700">23 tickets de soporte pendientes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Base de Datos</div>
                  <div className="text-sm text-blue-700">Última copia: hace 2 horas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EnhancedDashboardLayout>
  );
}