export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export function handleError(error: unknown): { error: string; statusCode: number; code?: string; details?: any } {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error);
    return {
      error: 'Internal server error',
      statusCode: 500,
      code: 'INTERNAL_ERROR',
    };
  }

  console.error('Unknown error:', error);
  return {
    error: 'Internal server error',
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
  };
}

export function asyncHandler(fn: (req: any, res: any, next: any) => Promise<any>) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function validateRequest<T>(schema: any, data: T): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      throw new ValidationError('Validation failed', (error as any).errors);
    }
    throw new ValidationError('Validation failed');
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  // This is a simple in-memory rate limiter
  // In production, you should use Redis or similar
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!global.rateLimits) {
    global.rateLimits = new Map();
  }
  
  const userRequests = global.rateLimits.get(key) || [];
  const validRequests = userRequests.filter((time: number) => time > windowStart);
  
  if (validRequests.length >= limit) {
    return false; // Rate limit exceeded
  }
  
  validRequests.push(now);
  global.rateLimits.set(key, validRequests);
  
  return true; // Within rate limit
}