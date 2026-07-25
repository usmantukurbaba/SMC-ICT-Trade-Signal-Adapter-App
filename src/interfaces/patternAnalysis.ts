/**
 * Pattern Analysis Interfaces
 */

/**
 * Pattern Types - Common chart patterns
 */
export enum PatternType {
  DOUBLE_TOP = 'DOUBLE_TOP',
  DOUBLE_BOTTOM = 'DOUBLE_BOTTOM',
  HEAD_AND_SHOULDERS = 'HEAD_AND_SHOULDERS',
  INVERSE_HEAD_AND_SHOULDERS = 'INVERSE_HEAD_AND_SHOULDERS',
  TRIANGLE = 'TRIANGLE',
  FLAG = 'FLAG',
  PENNANT = 'PENNANT',
  WEDGE = 'WEDGE',
  CHANNEL = 'CHANNEL'
}

/**
 * Pattern Match - Detected pattern with confidence
 */
export interface PatternMatch {
  id: string;
  timestamp: Date;
  asset: string;
  patternType: PatternType;
  confidence: number; // 0-100
  startTime: Date;
  endTime: Date;
  description: string;
  breakoutDirection?: 'UP' | 'DOWN';
  metadata?: Record<string, unknown>;
}
