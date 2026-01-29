/**
 * Input validation utilities for API routes
 */

import { z } from 'zod';

// Schema for submission
export const submissionSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  code: z.string().min(1, 'SQL code is required').max(10000, 'Code is too long'),
  isSubmission: z.boolean().optional().default(false),
});

// Schema for signup
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Schema for problem ID
export const problemIdSchema = z.object({
  id: z.string().min(1, 'Problem ID is required'),
});

/**
 * Validate request body against schema
 */
export function validateBody<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError?.message || 'Validation failed',
      };
    }
    return {
      success: false,
      error: 'Validation failed',
    };
  }
}

/**
 * Sanitize SQL query - remove dangerous patterns
 */
export function sanitizeSQLInput(query: string): string {
  // Remove multiple spaces
  let sanitized = query.replace(/\s+/g, ' ').trim();
  
  // Limit length
  if (sanitized.length > 10000) {
    throw new Error('Query is too long');
  }
  
  return sanitized;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  page?: string | null,
  limit?: string | null
): { page: number; limit: number } {
  const pageNum = parseInt(page || '1', 10);
  const limitNum = parseInt(limit || '20', 10);
  
  return {
    page: Math.max(1, Math.min(pageNum, 1000)),
    limit: Math.max(1, Math.min(limitNum, 100)),
  };
}
