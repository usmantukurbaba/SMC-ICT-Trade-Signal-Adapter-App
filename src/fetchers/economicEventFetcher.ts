import { EconomicEvent, EventType, ImpactLevel } from '../interfaces/economicEvent';
import { EventAlert, AlertSeverity } from '../interfaces/eventAlert';

/**
 * Economic Event Fetcher - Simulates fetching economic events from external sources
 * In production, this would connect to APIs like Trading Economics, Investing.com, etc.
 */
export class EconomicEventFetcher {
  private mockEvents: EconomicEvent[] = [];
  private alertListeners: ((alert: EventAlert) => void)[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeMockEvents();
  }

  /**
   * Initialize mock economic events for testing
   * In production, these would come from external APIs
   */
  private initializeMockEvents(): void {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    this.mockEvents = [
      {
        id: 'event_us_nfp_001',
        timestamp: now,
        eventName: EventType.NFP,
        country: 'US',
        impact: ImpactLevel.HIGH,
        forecast: 200000,
        previous: 185000,
        releaseTime: tomorrow,
        description: 'Non-Farm Payroll Report',
        affectedAssets: ['EURUSD', 'GBPUSD', 'USDJPY']
      },
      {
        id: 'event_us_cpi_001',
        timestamp: now,
        eventName: EventType.CPI,
        country: 'US',
        impact: ImpactLevel.HIGH,
        forecast: 3.1,
        previous: 3.2,
        releaseTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        description: 'Consumer Price Index',
        affectedAssets: ['EURUSD', 'XAUUSD', 'BTC']
      },
      {
        id: 'event_ecb_rate_001',
        timestamp: now,
        eventName: EventType.ECB_RATE,
        country: 'EU',
        impact: ImpactLevel.HIGH,
        releaseTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        description: 'ECB Interest Rate Decision',
        affectedAssets: ['EURUSD']
      },
      {
        id: 'event_us_fomc_001',
        timestamp: now,
        eventName: EventType.FOMC,
        country: 'US',
        impact: ImpactLevel.HIGH,
        releaseTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        description: 'FOMC Meeting Decision',
        affectedAssets: ['EURUSD', 'GBPUSD', 'XAUUSD', 'BTC']
      },
      {
        id: 'event_us_retail_001',
        timestamp: now,
        eventName: EventType.RETAIL_SALES,
        country: 'US',
        impact: ImpactLevel.MEDIUM,
        forecast: 0.5,
        previous: -0.1,
        releaseTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        description: 'Retail Sales',
        affectedAssets: ['SPY', 'EURUSD']
      }
    ];
  }

  /**
   * Fetch upcoming economic events
   */
  async fetchUpcomingEvents(hoursAhead: number = 24): Promise<EconomicEvent[]> {
    const now = new Date();
    const cutoffTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

    return this.mockEvents.filter(event => {
      if (!event.releaseTime) return false;
      return event.releaseTime <= cutoffTime && event.releaseTime > now;
    });
  }

  /**
   * Fetch events by country
   */
  async fetchEventsByCountry(country: string): Promise<EconomicEvent[]> {
    return this.mockEvents.filter(event => event.country === country);
  }

  /**
   * Fetch events by type
   */
  async fetchEventsByType(eventType: EventType): Promise<EconomicEvent[]> {
    return this.mockEvents.filter(event => event.eventName === eventType);
  }

  /**
   * Fetch events by asset
   */
  async fetchEventsByAsset(asset: string): Promise<EconomicEvent[]> {
    return this.mockEvents.filter(event => event.affectedAssets?.includes(asset));
  }

  /**
   * Generate alert for an event
   */
  private generateAlert(event: EconomicEvent): EventAlert {
    const now = new Date();
    const timeUntilEvent = event.releaseTime ? event.releaseTime.getTime() - now.getTime() : 0;

    // Determine severity based on impact and time until event
    let severity: AlertSeverity = AlertSeverity.INFO;
    if (event.impact === ImpactLevel.HIGH) {
      if (timeUntilEvent < 60 * 60 * 1000) severity = AlertSeverity.CRITICAL; // Less than 1 hour
      else if (timeUntilEvent < 24 * 60 * 60 * 1000) severity = AlertSeverity.HIGH; // Less than 24 hours
      else severity = AlertSeverity.MEDIUM;
    } else if (event.impact === ImpactLevel.MEDIUM) {
      severity = timeUntilEvent < 24 * 60 * 60 * 1000 ? AlertSeverity.MEDIUM : AlertSeverity.LOW;
    }

    return {
      id: `alert_${event.id}_${Date.now()}`,
      eventId: event.id,
      eventName: event.eventName,
      asset: event.affectedAssets?.[0] || 'UNKNOWN',
      severity,
      timeUntilEvent,
      timestamp: now,
      message: `${event.description} scheduled for ${event.releaseTime?.toLocaleString()}`
    };
  }

  /**
   * Subscribe to event alerts
   */
  onAlert(callback: (alert: EventAlert) => void): () => void {
    this.alertListeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.alertListeners = this.alertListeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Emit alert to all subscribers
   */
  private emitAlert(alert: EventAlert): void {
    this.alertListeners.forEach(listener => listener(alert));
  }

  /**
   * Start monitoring for upcoming events
   */
  startMonitoring(checkIntervalMs: number = 60000): void {
    if (this.checkInterval) return; // Already monitoring

    this.checkInterval = setInterval(async () => {
      const upcomingEvents = await this.fetchUpcomingEvents(24);
      upcomingEvents.forEach(event => {
        const alert = this.generateAlert(event);
        this.emitAlert(alert);
      });
    }, checkIntervalMs);
  }

  /**
   * Stop monitoring for events
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Add a custom event
   */
  addCustomEvent(event: EconomicEvent): void {
    this.mockEvents.push(event);
  }

  /**
   * Clear all events
   */
  clearEvents(): void {
    this.mockEvents = [];
  }

  /**
   * Get all events
   */
  getAllEvents(): EconomicEvent[] {
    return [...this.mockEvents];
  }
}
