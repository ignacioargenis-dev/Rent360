# Rent360 - Plataforma Integral de Arriendos

Rent360 es un sistema completo de gestión de arriendos para el mercado chileno, diseñado para simplificar el proceso de arriendo de propiedades entre propietarios, inquilinos, corredores y otros actores.

## 🚀 Características Principales

### Para Todos los Usuarios
- **Autenticación Segura**: Sistema de login con roles y permisos
- **Dashboard Personalizado**: Interfaz adaptada a cada rol de usuario
- **Sistema de Calificaciones**: Los usuarios pueden calificarse mutuamente
- **Mensajería Interna**: Comunicación directa entre usuarios
- **Notificaciones**: Sistema de alertas y recordatorios

### Para Inquilinos
- **Búsqueda Avanzada**: Filtra propiedades por ubicación, precio, características
- **Gestión de Contratos**: Visualiza y gestiona tus contratos de arriendo
- **Pagos Seguros**: Integra múltiples métodos de pago incluyendo Khipu
- **Calificaciones**: Recibe y da calificaciones a propietarios
- **Documentos**: Gestiona tu documentación requerida

### Para Propietarios
- **Gestión de Propiedades**: Crea y administra tus propiedades
- **Seguimiento de Pagos**: Historial completo de pagos recibidos
- **Gestión de Inquilinos**: Visualiza información de tus inquilinos
- **Calendario**: Sistema de disponibilidad para visitas
- **Reportes**: Analiza el rendimiento de tus propiedades

### Para Corredores
- **Gestión de Inmuebles**: Administra propiedades de terceros
- **Base de Clientes**: Gestiona tu cartera de clientes
- **Seguimiento de Contratos**: Controla todos tus contratos
- **Herramientas de Marketing**: Promociona tus propiedades

### Para Runner360
- **Gestión de Visitas**: Planifica y realiza visitas a propiedades
- **Calendario Personal**: Organiza tu agenda de visitas
- **Seguimiento de Ingresos**: Controla tus ganancias
- **Evaluaciones**: Recibe calificaciones por tu servicio

### Para Administradores
- **Panel Completo**: Acceso total a todas las funcionalidades
- **Gestión de Usuarios**: Crea y administra todos los usuarios
- **Reportes Avanzados**: Estadísticas detalladas del sistema
- **Configuración**: Personaliza todos los aspectos de la plataforma
- **Soporte**: Gestiona tickets de soporte técnico

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: JWT con bcrypt para hashing de contraseñas
- **Pagos**: Integración con Khipu
- **Validaciones**: Zod para validación de formularios
- **Estilos**: Tailwind CSS con componentes shadcn/ui

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repositorio-url>
   cd rent360
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   Editar el archivo `.env.local` con tus credenciales:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="tu-secreto-super-seguro-aqui"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Generar base de datos**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Crear usuarios de prueba**
   ```bash
   npm run seed
   ```

6. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

7. **Abrir el navegador**
   ```
   http://localhost:3000
   ```

## 👥 Usuarios de Prueba

El sistema incluye usuarios de prueba para cada rol:

| Rol | Email | Contraseña | Acceso |
|-----|-------|------------|--------|
| Administrador | admin@rent360.cl | admin123 | `/admin/dashboard` |
| Propietario | propietario@rent360.cl | prop123 | `/owner/dashboard` |
| Inquilino | inquilino@rent360.cl | inq123 | `/tenant/dashboard` |
| Corredor | corredor@rent360.cl | corr123 | `/broker/dashboard` |
| Runner360 | runner@rent360.cl | run123 | `/runner/dashboard` |
| Soporte | soporte@rent360.cl | sop123 | `/support/dashboard` |

## 📚 Documentación

Para información detallada sobre el desarrollo y arquitectura del proyecto:

### Documentación General
- [Documentación Completa](./DOCUMENTATION.md) - Guía completa del sistema
- [Componentes UI](./src/components/README.md) - Documentación de componentes reutilizables
- [Librerías y Utilidades](./src/lib/README.md) - Documentación de utilidades centrales
- [Hooks Personalizados](./src/hooks/README.md) - Documentación de hooks React

### Guías de Desarrollo
- [Estructura del Proyecto](./DOCUMENTATION.md#estructura-del-proyecto)
- [Instalación y Configuración](./DOCUMENTATION.md#instalación-y-configuración)
- [Convenciones de Código](./DOCUMENTATION.md#convenciones-de-código)
- [Seguridad](./DOCUMENTATION.md#seguridad)
- [Despliegue](./DOCUMENTATION.md#despliegue)

### API Reference
- [Rutas de Autenticación](./src/app/api/auth/)
- [Rutas de Propiedades](./src/app/api/properties/)
- [Rutas de Contratos](./src/app/api/contracts/)
- [Rutas de Pagos](./src/app/api/payments/)
- [Rutas de Usuarios](./src/app/api/users/)

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── admin/             # Dashboard administrador
│   ├── owner/             # Dashboard propietario
│   ├── tenant/            # Dashboard inquilino
│   ├── broker/            # Dashboard corredor
│   ├── runner/            # Dashboard Runner360
│   ├── support/           # Dashboard soporte
│   ├── properties/        # Búsqueda y gestión de propiedades
│   ├── api/               # API Routes
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes UI de shadcn
│   ├── auth/             # Componentes de autenticación
│   ├── properties/       # Componentes de propiedades
│   ├── contracts/        # Componentes de contratos
│   ├── payments/         # Componentes de pagos
│   ├── messages/         # Componentes de mensajería
│   ├── ratings/          # Componentes de calificaciones
│   ├── dashboard/        # Componentes de dashboard
│   └── common/           # Componentes comunes
├── lib/                  # Utilidades y configuración
│   ├── auth.ts           # Funciones de autenticación
│   ├── db.ts             # Configuración de base de datos
│   ├── validations.ts    # Esquemas de validación
│   ├── utils.ts          # Utilidades varias
│   ├── email.ts          # Funciones de email
│   ├── payments.ts       # Funciones de pagos
│   └── uploads.ts        # Funciones de carga de archivos
├── hooks/                # Custom React hooks
├── store/                # Estado global (Zustand)
├── types/                # Definiciones de TypeScript
└── prisma/               # Esquema de base de datos
```

## 📊 Diagrama de Base de Datos

El sistema utiliza las siguientes entidades principales:

- **Users**: Usuarios del sistema con diferentes roles
- **Properties**: Propiedades disponibles para arriendo
- **Contracts**: Contratos de arriendo entre propietarios e inquilinos
- **Payments**: Registro de pagos y transacciones
- **Ratings**: Sistema de calificaciones entre usuarios
- **Messages**: Sistema de mensajería interna
- **Documents**: Gestión de documentos de usuarios
- **Tickets**: Sistema de soporte técnico
- **Notifications**: Sistema de notificaciones
- **Visits**: Gestión de visitas para Runner360
- **Availability**: Calendario de disponibilidad

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar ESLint

# Base de datos
npm run db:push      # Enviar esquema a la base de datos
npm run db:generate  # Generar Prisma Client
npm run db:studio    # Abrir Prisma Studio
npm run seed         # Crear datos de prueba

# Otros
npm run type-check   # Verificar tipos de TypeScript
```

## 🎨 Diseño y UI

El proyecto utiliza:
- **Tailwind CSS**: Para estilos rápidos y consistentes
- **shadcn/ui**: Componentes UI de alta calidad
- **Lucide React**: Iconos modernos y consistentes
- **Responsive Design**: Totalmente adaptable a móviles y escritorio

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros con expiración
- **Hashing de Contraseñas**: bcrypt para almacenamiento seguro
- **Validación de Entrada**: Zod para sanitización de datos
- **Autorización por Roles**: Control de acceso basado en roles
- **HTTPS**: Soporte para conexiones seguras

## 📈 Funcionalidades Futuras

- [ ] Integración con Webpay/Transbank
- [ ] Sistema de notificaciones push
- [ ] Módulo de mantenimiento y reparaciones
- [ ] Integración con servicios de mapas
- [ ] Reportes avanzados y exportación
- [ ] API para integraciones externas
- [ ] Móvil nativo (React Native)
- [ ] Sistema de multas y penalizaciones
- [ ] Integración con servicios legales

## 🤝 Contribuir

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes algún problema o pregunta, por favor:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con información detallada

## 🙏 Agradecimientos

- Al equipo de Next.js por el excelente framework
- A los creadores de shadcn/ui por los componentes UI
- A Prisma por el excelente ORM
- A toda la comunidad de código abierto

---

**Rent360** - Transformando la experiencia de arriendo en Chile 🇨🇱