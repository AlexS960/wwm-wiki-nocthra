/**
 * Validation utilities for user input and data
 */

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const GAME_NICKNAME_MAX_LENGTH = 50;

/**
 * Validate username format
 */
export function validateUsername(username: string): ValidationResult {
  const trimmed = username.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Логин обязателен' };
  }
  
  if (trimmed.length < USERNAME_MIN_LENGTH) {
    return { valid: false, error: `Логин должен быть не короче ${USERNAME_MIN_LENGTH} символов` };
  }
  
  if (trimmed.length > USERNAME_MAX_LENGTH) {
    return { valid: false, error: `Логин должен быть не длиннее ${USERNAME_MAX_LENGTH} символов` };
  }
  
  // Allow only alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { valid: false, error: 'Логин может содержать только буквы, цифры, подчеркивания и дефисы' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: 'Пароль обязателен' };
  }
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Пароль должен быть не короче ${PASSWORD_MIN_LENGTH} символов` };
  }
  
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { valid: false, error: `Пароль должен быть не длиннее ${PASSWORD_MAX_LENGTH} символов` };
  }
  
  // Check for at least one letter and one number
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, error: 'Пароль должен содержать хотя бы одну букву и одну цифру' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate game nickname
 */
export function validateGameNickname(nickname: string): ValidationResult {
  const trimmed = nickname.trim();
  
  if (!trimmed) {
    return { valid: true, error: null }; // Optional field
  }
  
  if (trimmed.length > GAME_NICKNAME_MAX_LENGTH) {
    return { valid: false, error: `Игровой ник должен быть не длиннее ${GAME_NICKNAME_MAX_LENGTH} символов` };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): ValidationResult {
  if (!url.trim()) {
    return { valid: true, error: null }; // Optional
  }
  
  try {
    new URL(url);
    return { valid: true, error: null };
  } catch {
    return { valid: false, error: 'Некорректный URL' };
  }
}

/**
 * Validate email format (basic)
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { valid: true, error: null }; // Optional
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Некорректный email' };
  }
  
  return { valid: true, error: null };
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate and sanitize text content
 */
export function validateTextContent(content: string, maxLength: number = 10000): ValidationResult {
  if (!content || !content.trim()) {
    return { valid: false, error: 'Содержание не может быть пустым' };
  }
  
  if (content.length > maxLength) {
    return { valid: false, error: `Содержание слишком длинное (максимум ${maxLength} символов)` };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate guide/article data
 */
export function validateGuideData(data: {
  title: string;
  content: string;
  category?: string;
}): ValidationResult {
  if (!data.title || !data.title.trim()) {
    return { valid: false, error: 'Заголовок обязателен' };
  }
  
  if (data.title.length > 200) {
    return { valid: false, error: 'Заголовок слишком длинный (максимум 200 символов)' };
  }
  
  if (!data.content || !data.content.trim()) {
    return { valid: false, error: 'Содержание обязательно' };
  }
  
  if (data.content.length > 50000) {
    return { valid: false, error: 'Содержание слишком длинное (максимум 50000 символов)' };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate message/chat text
 */
export function validateMessageText(text: string, maxLength: number = 2000): ValidationResult {
  const trimmed = text.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Сообщение не может быть пустым' };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `Сообщение слишком длинное (максимум ${maxLength} символов)` };
  }
  
  return { valid: true, error: null };
}
