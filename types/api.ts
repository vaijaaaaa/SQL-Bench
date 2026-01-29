/**
 * Type definitions for API responses
 */

// Common response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Problem types
export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  companies: string[];
  schema: string;
  sampleData: string;
  solution: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProblemListItem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  companies: string[];
  acceptanceRate?: number;
  isSolved?: boolean;
}

// Submission types
export interface TestCaseResult {
  id: string;
  passed: boolean;
  error?: string;
  actual?: any[];
  expected?: any[];
  isHidden: boolean;
}

export interface SubmissionResult {
  success: boolean;
  rows?: any[];
  error?: string;
  testResults?: TestCaseResult[];
  submissionId?: string;
  executionTime?: number;
}

// User types
export interface UserProgress {
  id: string;
  userId: string;
  problemId: string;
  status: 'UNSOLVED' | 'ATTEMPTED' | 'SOLVED';
  attempts: number;
  solvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalAttempted: number;
  totalSubmissions: number;
  acceptanceRate: number;
  rank?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  image?: string;
  solvedCount: number;
  totalSubmissions?: number;
  acceptanceRate?: number;
}

// Auth types
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse extends ApiResponse {
  userId?: string;
}

// Error types
export interface ApiError {
  error: string;
  message?: string;
  statusCode: number;
  details?: any;
}
