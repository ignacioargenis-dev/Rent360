// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  TENANT = 'TENANT',
  OWNER = 'OWNER',
  BROKER = 'BROKER',
  RUNNER = 'RUNNER',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}

// Property types
export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  commune: string;
  region: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: PropertyStatus;
  type: PropertyType;
  images?: string[];
  features?: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: User;
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  PENDING = 'PENDING',
  MAINTENANCE = 'MAINTENANCE'
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  STUDIO = 'STUDIO',
  ROOM = 'ROOM',
  COMMERCIAL = 'COMMERCIAL'
}

// Contract types
export interface Contract {
  id: string;
  contractNumber: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  brokerId?: string;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  deposit: number;
  status: ContractStatus;
  terms?: string;
  createdAt: Date;
  updatedAt: Date;
  terminatedAt?: Date;
  property?: Property;
  tenant?: User;
  owner?: User;
  broker?: User;
  payments?: Payment[];
  reviews?: Review[];
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TERMINATED = 'TERMINATED',
  CANCELLED = 'CANCELLED'
}

// Payment types
export interface Payment {
  id: string;
  paymentNumber: string;
  contractId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  method?: PaymentMethod;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  contract?: Contract;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIAL = 'PARTIAL'
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CHECK = 'CHECK',
  KHIPU = 'KHIPU',
  OTHER = 'OTHER'
}

// Review types
export interface Review {
  id: string;
  propertyId?: string;
  contractId?: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  property?: Property;
  contract?: Contract;
  reviewer?: User;
  reviewee?: User;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject?: string;
  content: string;
  status: MessageStatus;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  sender?: User;
  receiver?: User;
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  DELETED = 'DELETED'
}

// Ticket types
export interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  userId?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  user?: User;
  assignee?: User;
  comments?: TicketComment[];
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
  ticket?: Ticket;
  user?: User;
}

// Visit types
export interface Visit {
  id: string;
  propertyId: string;
  runnerId: string;
  tenantId?: string;
  scheduledAt: Date;
  duration: number;
  status: VisitStatus;
  notes?: string;
  photosTaken: number;
  rating?: number;
  clientFeedback?: string;
  earnings: number;
  createdAt: Date;
  updatedAt: Date;
  property?: Property;
  runner?: User;
  tenant?: User;
}

export enum VisitStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

// Maintenance types
export interface Maintenance {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  estimatedCost?: number;
  actualCost?: number;
  requestedBy: string;
  assignedTo?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  property?: Property;
}

export enum MaintenancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum MaintenanceStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR'
}

// System types
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  variables?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Document types (existing)
export interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  tags?: string;
  uploaded_by: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
}

export interface PropertyForm {
  title: string;
  description: string;
  address: string;
  city: string;
  commune: string;
  region: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: PropertyType;
  features?: string[];
  images?: string[];
}

export interface ContractForm {
  propertyId: string;
  tenantId: string;
  brokerId?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  terms?: string;
}

export interface PaymentForm {
  contractId: string;
  amount: number;
  dueDate: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface ReviewForm {
  propertyId?: string;
  contractId?: string;
  revieweeId: string;
  rating: number;
  comment?: string;
}

export interface MessageForm {
  receiverId: string;
  subject?: string;
  content: string;
}

export interface TicketForm {
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
}

export interface VisitForm {
  propertyId: string;
  tenantId?: string;
  scheduledAt: string;
  duration: number;
  notes?: string;
}

export interface MaintenanceForm {
  propertyId: string;
  title: string;
  description: string;
  category: string;
  priority: MaintenancePriority;
  estimatedCost?: number;
}

// Search and filter types
export interface PropertyFilters {
  city?: string;
  commune?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  status?: PropertyStatus;
  type?: PropertyType;
}

export interface SearchParams {
  query?: string;
  filters?: PropertyFilters;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Dashboard types
export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  rentedProperties: number;
  totalContracts: number;
  activeContracts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  openTickets: number;
  resolvedTickets: number;
  totalUsers: number;
  activeUsers: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

// Visit report types
export interface VisitReport {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  scheduledDate: string;
  completedDate?: string;
  status: VisitStatus;
  duration: number;
  photosTaken: number;
  notes?: string;
  rating?: number;
  clientFeedback?: string;
  earnings: number;
}

export interface PerformanceMetrics {
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  noShowVisits: number;
  averageRating: number;
  totalEarnings: number;
  averageVisitDuration: number;
  completionRate: number;
  monthlyTrend: { month: string; visits: number; earnings: number }[];
  topProperties: { name: string; visits: number; rating: number }[];
}