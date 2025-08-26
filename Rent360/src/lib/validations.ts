import { z } from 'zod';
import { UserRole } from '@/types';

// User validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(5, 'Email debe tener al menos 5 caracteres')
    .max(100, 'Email no puede exceder 100 caracteres'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres'),
});

export const registerSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(5, 'Email debe tener al menos 5 caracteres')
    .max(100, 'Email no puede exceder 100 caracteres'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una minúscula')
    .regex(/\d/, 'La contraseña debe contener al menos un número')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe contener al menos un carácter especial'),
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  role: z.enum(['tenant', 'owner', 'broker', 'runner', 'support', 'admin'], {
    errorMap: () => ({ message: 'Rol inválido' }),
  }) as any,
  phone: z.string()
    .optional()
    .refine(
      (phone) => !phone || /^\+?[\d\s\-\(\)]+$/.test(phone),
      'Teléfono inválido'
    ),
});

// Property validation schemas
export const propertySchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  address: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  city: z.string()
    .min(2, 'La ciudad debe tener al menos 2 caracteres')
    .max(50, 'La ciudad no puede exceder 50 caracteres'),
  commune: z.string()
    .min(2, 'La comuna debe tener al menos 2 caracteres')
    .max(50, 'La comuna no puede exceder 50 caracteres'),
  region: z.string()
    .min(2, 'La región debe tener al menos 2 caracteres')
    .max(50, 'La región no puede exceder 50 caracteres'),
  price: z.number()
    .min(1, 'El precio debe ser mayor a 0')
    .max(10000000, 'El precio no puede exceder $10,000,000'),
  deposit: z.number()
    .min(0, 'El depósito no puede ser negativo')
    .max(5000000, 'El depósito no puede exceder $5,000,000'),
  bedrooms: z.number()
    .min(0, 'Los dormitorios no pueden ser negativos')
    .max(20, 'No puede haber más de 20 dormitorios')
    .int('Los dormitorios deben ser un número entero'),
  bathrooms: z.number()
    .min(0, 'Los baños no pueden ser negativos')
    .max(20, 'No puede haber más de 20 baños')
    .int('Los baños deben ser un número entero'),
  area: z.number()
    .min(1, 'El área debe ser mayor a 0')
    .max(10000, 'El área no puede exceder 10,000 m²'),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'ROOM', 'COMMERCIAL'], {
    errorMap: () => ({ message: 'Tipo de propiedad inválido' }),
  }) as any,
  features: z.array(z.string())
    .max(20, 'No puede haber más de 20 características')
    .optional(),
  images: z.array(z.string()
    .url('URL de imagen inválida')
    .max(500, 'URL de imagen demasiado larga'))
    .max(50, 'No puede haber más de 50 imágenes')
    .optional(),
}).refine((data) => data.deposit <= data.price * 2, {
  message: 'El depósito no puede exceder el doble del precio mensual',
  path: ['deposit'],
});

// Contract validation schemas
export const contractSchema = z.object({
  propertyId: z.string()
    .cuid('ID de propiedad inválido'),
  tenantId: z.string()
    .cuid('ID de inquilino inválido'),
  brokerId: z.string()
    .cuid('ID de corredor inválido')
    .optional(),
  startDate: z.string()
    .min(1, 'Fecha de inicio inválida'),
  endDate: z.string()
    .min(1, 'Fecha de término inválida'),
  monthlyRent: z.number()
    .min(1, 'La renta mensual debe ser mayor a 0')
    .max(10000000, 'La renta mensual no puede exceder $10,000,000'),
  deposit: z.number()
    .min(0, 'El depósito no puede ser negativo')
    .max(5000000, 'El depósito no puede exceder $5,000,000'),
  terms: z.string()
    .max(10000, 'Los términos no pueden exceder 10,000 caracteres')
    .optional(),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
  message: 'La fecha de inicio debe ser anterior a la fecha de término',
  path: ['endDate'],
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 30 && diffDays <= 3650; // 1 month to 10 years
}, {
  message: 'El contrato debe durar entre 1 mes y 10 años',
  path: ['endDate'],
}).refine((data) => data.deposit <= data.monthlyRent * 3, {
  message: 'El depósito no puede exceder 3 veces la renta mensual',
  path: ['deposit'],
});

// Payment validation schemas
export const paymentSchema = z.object({
  contractId: z.string()
    .cuid('ID de contrato inválido'),
  amount: z.number()
    .min(1, 'El monto debe ser mayor a 0')
    .max(10000000, 'El monto no puede exceder $10,000,000'),
  dueDate: z.string()
    .min(1, 'Fecha de vencimiento inválida'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'CHECK', 'OTHER'], {
    errorMap: () => ({ message: 'Método de pago inválido' }),
  }) as any,
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIAL'])
    .optional()
    .default('PENDING'),
  notes: z.string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
});

// Rating validation schemas
export const ratingSchema = z.object({
  propertyId: z.string()
    .cuid('ID de propiedad inválido')
    .optional(),
  contractId: z.string()
    .cuid('ID de contrato inválido')
    .optional(),
  revieweeId: z.string()
    .cuid('ID de usuario calificado inválido'),
  rating: z.number()
    .min(1, 'La calificación mínima es 1')
    .max(5, 'La calificación máxima es 5')
    .int('La calificación debe ser un número entero'),
  comment: z.string()
    .max(500, 'El comentario no puede exceder 500 caracteres')
    .optional(),
}).refine((data) => data.propertyId || data.contractId, {
  message: 'Debe especificar propertyId o contractId',
  path: ['propertyId'],
});

// Message validation schemas
export const messageSchema = z.object({
  receiverId: z.string()
    .cuid('ID de receptor inválido'),
  subject: z.string()
    .max(100, 'El asunto no puede exceder 100 caracteres')
    .optional(),
  content: z.string()
    .min(1, 'El contenido no puede estar vacío')
    .max(2000, 'El contenido no puede exceder 2000 caracteres'),
});

// Ticket validation schemas
export const ticketSchema = z.object({
  title: z.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  category: z.string()
    .min(2, 'La categoría debe tener al menos 2 caracteres')
    .max(50, 'La categoría no puede exceder 50 caracteres'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    errorMap: () => ({ message: 'Prioridad inválida' }),
  }) as any,
});

// Document validation schemas
export const documentSchema = z.object({
  type: z.enum(['id_front', 'id_back', 'criminal_record', 'social_security', 'property_deed', 'residence_proof', 'contract', 'other'], {
    errorMap: () => ({ message: 'Tipo de documento inválido' }),
  }) as any,
  name: z.string()
    .min(1, 'El nombre no puede estar vacío')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  fileName: z.string()
    .min(1, 'El nombre del archivo no puede estar vacío')
    .max(255, 'El nombre del archivo no puede exceder 255 caracteres'),
  fileSize: z.number()
    .min(1, 'El tamaño del archivo debe ser mayor a 0')
    .max(50 * 1024 * 1024, 'El tamaño del archivo no puede exceder 50MB'),
  mimeType: z.string()
    .min(1, 'El tipo MIME no puede estar vacío')
    .max(100, 'El tipo MIME no puede exceder 100 caracteres'),
});

// Visit validation schemas
export const visitSchema = z.object({
  propertyId: z.string()
    .cuid('ID de propiedad inválido'),
  tenantId: z.string()
    .cuid('ID de inquilino inválido')
    .optional(),
  scheduledAt: z.date('Fecha programada inválida'),
  duration: z.number()
    .min(15, 'La duración mínima es de 15 minutos')
    .max(240, 'La duración máxima es de 240 minutos')
    .int('La duración debe ser un número entero'),
  notes: z.string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
}).refine((data) => {
  const now = new Date();
  const visitDate = new Date(data.scheduledAt);
  return visitDate > now;
}, {
  message: 'La visita debe ser programada para una fecha futura',
  path: ['scheduledAt'],
});

// Availability validation schemas
export const availabilitySchema = z.object({
  propertyId: z.string()
    .cuid('ID de propiedad inválido'),
  date: z.date('Fecha inválida'),
  startTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de inicio inválida (formato HH:MM)'),
  endTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora de término inválida (formato HH:MM)'),
}).refine((data) => {
  const start = data.startTime.split(':').map(Number);
  const end = data.endTime.split(':').map(Number);
  const startMinutes = start[0] * 60 + start[1];
  const endMinutes = end[0] * 60 + end[1];
  return endMinutes > startMinutes;
}, {
  message: 'La hora de término debe ser posterior a la hora de inicio',
  path: ['endTime'],
});

// Search filters validation
export const propertySearchSchema = z.object({
  city: z.string()
    .max(50, 'La ciudad no puede exceder 50 caracteres')
    .optional(),
  commune: z.string()
    .max(50, 'La comuna no puede exceder 50 caracteres')
    .optional(),
  minPrice: z.number()
    .min(0, 'El precio mínimo no puede ser negativo')
    .max(10000000, 'El precio mínimo no puede exceder $10,000,000')
    .optional(),
  maxPrice: z.number()
    .min(0, 'El precio máximo no puede ser negativo')
    .max(10000000, 'El precio máximo no puede exceder $10,000,000')
    .optional(),
  bedrooms: z.number()
    .min(0, 'Los dormitorios no pueden ser negativos')
    .max(20, 'No puede haber más de 20 dormitorios')
    .int('Los dormitorios deben ser un número entero')
    .optional(),
  bathrooms: z.number()
    .min(0, 'Los baños no pueden ser negativos')
    .max(20, 'No puede haber más de 20 baños')
    .int('Los baños deben ser un número entero')
    .optional(),
  minArea: z.number()
    .min(0, 'El área mínima no puede ser negativa')
    .max(10000, 'El área mínima no puede exceder 10,000 m²')
    .optional(),
  maxArea: z.number()
    .min(0, 'El área máxima no puede ser negativa')
    .max(10000, 'El área máxima no puede exceder 10,000 m²')
    .optional(),
  status: z.enum(['AVAILABLE', 'RENTED', 'PENDING', 'MAINTENANCE'])
    .optional(),
}).refine((data) => {
  if (data.minPrice && data.maxPrice) {
    return data.minPrice <= data.maxPrice;
  }
  return true;
}, {
  message: 'El precio mínimo no puede ser mayor que el precio máximo',
  path: ['minPrice'],
}).refine((data) => {
  if (data.minArea && data.maxArea) {
    return data.minArea <= data.maxArea;
  }
  return true;
}, {
  message: 'El área mínima no puede ser mayor que el área máxima',
  path: ['minArea'],
});

// Settings validation schemas
export const settingSchema = z.object({
  key: z.string()
    .min(1, 'La clave no puede estar vacía')
    .max(100, 'La clave no puede exceder 100 caracteres')
    .regex(/^[a-zA-Z0-9_.-]+$/, 'La clave solo puede contener letras, números, guiones y puntos'),
  value: z.string()
    .min(1, 'El valor no puede estar vacío')
    .max(1000, 'El valor no puede exceder 1000 caracteres'),
  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
});

// Export all validation schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type ContractInput = z.infer<typeof contractSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type ReviewInput = z.infer<typeof ratingSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type TicketInput = z.infer<typeof ticketSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type VisitInput = z.infer<typeof visitSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
export type SettingInput = z.infer<typeof settingSchema>;