import { EventType } from '../interfaces/economicEvent';

/**
 * Asset-to-Event Mapper - Hardcoded mapping of economic events to trading assets
 * Defines which assets are affected by which economic events
 */
export class AssetEventMapper {
  private assetEventMap: Map<string, EventType[]>;
  private eventAssetMap: Map<EventType, string[]>;

  constructor() {
    this.assetEventMap = new Map();
    this.eventAssetMap = new Map();
    this.initializeMappings();
  }

  /**
   * Initialize hardcoded asset-to-event mappings
   */
  private initializeMappings(): void {
    // US Equity Assets
    this.mapAssetToEvents('SPY', [
      EventType.NFP,
      EventType.CPI,
      EventType.GDP,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.RETAIL_SALES,
      EventType.ISM_PMI,
      EventType.CONSUMER_SENTIMENT
    ]);

    this.mapAssetToEvents('QQQ', [
      EventType.NFP,
      EventType.CPI,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.DURABLE_GOODS,
      EventType.ISM_PMI
    ]);

    this.mapAssetToEvents('IWM', [
      EventType.NFP,
      EventType.UNEMPLOYMENT,
      EventType.RETAIL_SALES,
      EventType.HOUSING_STARTS,
      EventType.ISM_PMI
    ]);

    // Forex Pairs - USD Based
    this.mapAssetToEvents('EURUSD', [
      EventType.NFP,
      EventType.CPI,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.EU_CPI,
      EventType.ECB_RATE,
      EventType.EU_PMI
    ]);

    this.mapAssetToEvents('GBPUSD', [
      EventType.NFP,
      EventType.CPI,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.UK_CPI,
      EventType.BOE_RATE,
      EventType.UK_PMI
    ]);

    this.mapAssetToEvents('USDJPY', [
      EventType.NFP,
      EventType.CPI,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.UNEMPLOYMENT,
      EventType.ISM_PMI
    ]);

    this.mapAssetToEvents('NZDUSD', [
      EventType.CPI,
      EventType.RETAIL_SALES,
      EventType.EMPLOYMENT
    ]);

    this.mapAssetToEvents('AUDUSD', [
      EventType.CPI,
      EventType.EMPLOYMENT,
      EventType.RETAIL_SALES
    ]);

    // Commodities
    this.mapAssetToEvents('XAUUSD', [
      EventType.CPI,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.NFP,
      EventType.GDP,
      EventType.UNEMPLOYMENT
    ]);

    this.mapAssetToEvents('XAGUSD', [
      EventType.CPI,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.ISM_PMI
    ]);

    this.mapAssetToEvents('CRUDE_OIL', [
      EventType.CPI,
      EventType.ISM_PMI,
      EventType.GDP,
      EventType.RETAIL_SALES
    ]);

    this.mapAssetToEvents('NATURAL_GAS', [
      EventType.CPI,
      EventType.CONSUMER_SENTIMENT
    ]);

    // Cryptocurrencies
    this.mapAssetToEvents('BTC', [
      EventType.CPI,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.NFP,
      EventType.GDP
    ]);

    this.mapAssetToEvents('ETH', [
      EventType.CPI,
      EventType.FOMC,
      EventType.FED_RATE,
      EventType.NFP
    ]);

    // Build reverse map
    this.buildEventAssetMap();
  }

  /**
   * Map asset to events and update reverse map
   */
  private mapAssetToEvents(asset: string, events: EventType[]): void {
    this.assetEventMap.set(asset, events);
  }

  /**
   * Build reverse mapping from events to assets
   */
  private buildEventAssetMap(): void {
    for (const [asset, events] of this.assetEventMap.entries()) {
      for (const event of events) {
        if (!this.eventAssetMap.has(event)) {
          this.eventAssetMap.set(event, []);
        }
        const assets = this.eventAssetMap.get(event);
        if (assets && !assets.includes(asset)) {
          assets.push(asset);
        }
      }
    }
  }

  /**
   * Get all events that affect a specific asset
   */
  getEventsForAsset(asset: string): EventType[] {
    return this.assetEventMap.get(asset) || [];
  }

  /**
   * Get all assets affected by a specific event
   */
  getAssetsForEvent(event: EventType): string[] {
    return this.eventAssetMap.get(event) || [];
  }

  /**
   * Check if an event affects a specific asset
   */
  isEventRelevantToAsset(asset: string, event: EventType): boolean {
    const events = this.assetEventMap.get(asset) || [];
    return events.includes(event);
  }

  /**
   * Get all mapped assets
   */
  getAllAssets(): string[] {
    return Array.from(this.assetEventMap.keys());
  }

  /**
   * Get all mapped events
   */
  getAllEvents(): EventType[] {
    return Array.from(this.eventAssetMap.keys());
  }

  /**
   * Get mapping statistics
   */
  getStatistics(): { totalAssets: number; totalEvents: number; averageEventsPerAsset: number } {
    const totalAssets = this.assetEventMap.size;
    let totalEventCount = 0;
    for (const events of this.assetEventMap.values()) {
      totalEventCount += events.length;
    }
    const totalEvents = this.eventAssetMap.size;
    const averageEventsPerAsset = totalAssets > 0 ? totalEventCount / totalAssets : 0;

    return {
      totalAssets,
      totalEvents,
      averageEventsPerAsset: Math.round(averageEventsPerAsset * 100) / 100
    };
  }
}
