/**
 * Centralized error handling utilities
 */

import { logger } from './logger';

export type ErrorType = 'network' | 'validation' | 'auth' | 'database' | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  context?: string;
}

/**
 * Classify error based on error object
 */
export function classifyError(error: unknown): ErrorType {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'network';
    }
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return 'validation';
    }
    
    if (message.includes('auth') || message.includes('unauthorized') || message.includes('login')) {
      return 'auth';
    }
    
    if (message.includes('database') || message.includes('supabase') || message.includes('query')) {
      return 'database';
    }
  }
  
  return 'unknown';
}

/**
 * Create a standardized app error
 */
export function createAppError(
  message: string,
  originalError?: unknown,
  context?: string
): AppError {
  const type = classifyError(originalError);
  
  logger.error(message, context || 'error-handler', { originalError, type });
  
  return {
    type,
    message,
    originalError,
    context,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case 'network':
      return 'Ошибка соединения. Проверьте интернет и попробуйте снова.';
    case 'validation':
      return error.message || 'Проверьте введенные данные.';
    case 'auth':
      return 'Ошибка авторизации. Войдите в аккаунт снова.';
    case 'database':
      return 'Ошибка сохранения данных. Попробуйте позже.';
    default:
      return error.message || 'Произошла ошибка. Попробуйте позже.';
  }
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: string
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = createAppError(
        'Operation failed',
        error,
        context
      );
      throw appError;
    }
  }) as T;
}

/**
 * Safe async execution with fallback
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logger.error('Safe async failed', context, error);
    return fallback;
  }
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: string
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        logger.error(`Retry failed after ${maxRetries} attempts`, context, error);
        throw error;
      }
      
      const backoffDelay = delay * Math.pow(2, attempt);
      logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${backoffDelay}ms`, context);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError;
}
