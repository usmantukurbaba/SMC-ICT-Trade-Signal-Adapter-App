/**
 * Event Alert - Notification for upcoming or triggered economic events
 */
export interface EventAlert {
  id: string;
  eventId: string;
  eventName: string;
  asset: string;
  severity: AlertSeverity;
  timeUntilEvent: number; // milliseconds
  timestamp: Date;
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * Alert Severity Levels
 */
export enum AlertSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO'
}
