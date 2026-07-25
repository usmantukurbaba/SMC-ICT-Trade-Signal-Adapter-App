import { IAdapter } from '../interfaces/adapter';
import { EconomicEvent, EventType, ImpactLevel } from '../interfaces/economicEvent';

/**
 * Generic Economic Event Adapter - Converts raw event data to standardized format
 * Implements the generic adapter pattern for extensibility
 */
export class EconomicEventAdapter implements IAdapter<EconomicEvent> {
  private adapterId: string;

  constructor(adapterId: string = 'default-event-adapter') {
    this.adapterId = adapterId;
  }

  /**
   * Convert raw event data to standardized EconomicEvent format
   */
  convert(rawData: unknown): EconomicEvent {
    if (!this.validate(rawData)) {
      throw new Error(`Invalid event data for adapter: ${this.adapterId}`);
    }

    const data = rawData as Record<string, unknown>;

    return {
      id: String(data.id || this.generateId()),
      timestamp: new Date(data.timestamp as string || Date.now()),
      eventName: this.parseEventType(data.eventName),
      country: String(data.country || 'US'),
      impact: this.parseImpactLevel(data.impact),
      forecast: data.forecast ? Number(data.forecast) : undefined,
      previous: data.previous ? Number(data.previous) : undefined,
      actual: data.actual ? Number(data.actual) : undefined,
      releaseTime: data.releaseTime ? new Date(data.releaseTime as string) : undefined,
      description: String(data.description || ''),
      affectedAssets: this.parseAffectedAssets(data.affectedAssets),
      metadata: data.metadata as Record<string, unknown> | undefined
    };
  }

  /**
   * Validate raw event data has minimum required fields
   */
  validate(rawData: unknown): boolean {
    if (!rawData || typeof rawData !== 'object') {
      return false;
    }

    const data = rawData as Record<string, unknown>;
    const requiredFields = ['eventName', 'country', 'impact', 'affectedAssets'];

    return requiredFields.every(field => field in data && data[field] !== null && data[field] !== undefined);
  }

  getAdapterId(): string {
    return this.adapterId;
  }

  private parseEventType(value: unknown): EventType {
    const eventStr = String(value).toUpperCase();
    return Object.values(EventType).includes(eventStr as EventType)
      ? (eventStr as EventType)
      : EventType.ECONOMIC_DATA;
  }

  private parseImpactLevel(value: unknown): ImpactLevel {
    const impactStr = String(value).toUpperCase();
    return Object.values(ImpactLevel).includes(impactStr as ImpactLevel)
      ? (impactStr as ImpactLevel)
      : ImpactLevel.MEDIUM;
  }

  private parseAffectedAssets(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.map(v => String(v));
    }
    return [String(value)];
  }

  private generateId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
