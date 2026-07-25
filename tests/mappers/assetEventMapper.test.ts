import { AssetEventMapper } from '../../src/mappers/assetEventMapper';
import { EventType } from '../../src/interfaces/economicEvent';

describe('AssetEventMapper', () => {
  let mapper: AssetEventMapper;

  beforeEach(() => {
    mapper = new AssetEventMapper();
  });

  describe('getEventsForAsset', () => {
    it('should return events for EURUSD', () => {
      const events = mapper.getEventsForAsset('EURUSD');
      expect(events.length).toBeGreaterThan(0);
      expect(events).toContain(EventType.NFP);
      expect(events).toContain(EventType.ECB_RATE);
    });

    it('should return events for gold (XAUUSD)', () => {
      const events = mapper.getEventsForAsset('XAUUSD');
      expect(events).toContain(EventType.CPI);
      expect(events).toContain(EventType.FED_RATE);
    });

    it('should return empty array for unmapped asset', () => {
      const events = mapper.getEventsForAsset('UNMAPPED_ASSET');
      expect(events).toEqual([]);
    });

    it('should return different events for different assets', () => {
      const eurusdEvents = mapper.getEventsForAsset('EURUSD');
      const btcEvents = mapper.getEventsForAsset('BTC');
      expect(eurusdEvents).not.toEqual(btcEvents);
    });
  });

  describe('getAssetsForEvent', () => {
    it('should return assets affected by NFP', () => {
      const assets = mapper.getAssetsForEvent(EventType.NFP);
      expect(assets.length).toBeGreaterThan(0);
      expect(assets).toContain('EURUSD');
      expect(assets).toContain('GBPUSD');
    });

    it('should return assets affected by CPI', () => {
      const assets = mapper.getAssetsForEvent(EventType.CPI);
      expect(assets).toContain('XAUUSD');
      expect(assets).toContain('BTC');
    });

    it('should return empty array for unmapped event', () => {
      const assets = mapper.getAssetsForEvent('UNMAPPED_EVENT' as EventType);
      expect(assets).toEqual([]);
    });
  });

  describe('isEventRelevantToAsset', () => {
    it('should return true for relevant event-asset pair', () => {
      const isRelevant = mapper.isEventRelevantToAsset('EURUSD', EventType.NFP);
      expect(isRelevant).toBe(true);
    });

    it('should return true for XAUUSD and CPI', () => {
      const isRelevant = mapper.isEventRelevantToAsset('XAUUSD', EventType.CPI);
      expect(isRelevant).toBe(true);
    });

    it('should return false for non-relevant event-asset pair', () => {
      const isRelevant = mapper.isEventRelevantToAsset('EURUSD', EventType.EARNINGS_REPORT);
      expect(isRelevant).toBe(false);
    });

    it('should return false for unmapped asset', () => {
      const isRelevant = mapper.isEventRelevantToAsset('UNMAPPED', EventType.NFP);
      expect(isRelevant).toBe(false);
    });
  });

  describe('getAllAssets', () => {
    it('should return all mapped assets', () => {
      const assets = mapper.getAllAssets();
      expect(assets.length).toBeGreaterThan(0);
      expect(assets).toContain('EURUSD');
      expect(assets).toContain('XAUUSD');
      expect(assets).toContain('BTC');
    });

    it('should not return duplicates', () => {
      const assets = mapper.getAllAssets();
      const uniqueAssets = new Set(assets);
      expect(assets.length).toBe(uniqueAssets.size);
    });
  });

  describe('getAllEvents', () => {
    it('should return all mapped events', () => {
      const events = mapper.getAllEvents();
      expect(events.length).toBeGreaterThan(0);
      expect(events).toContain(EventType.NFP);
      expect(events).toContain(EventType.CPI);
    });

    it('should not return duplicates', () => {
      const events = mapper.getAllEvents();
      const uniqueEvents = new Set(events);
      expect(events.length).toBe(uniqueEvents.size);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics object', () => {
      const stats = mapper.getStatistics();
      expect(stats).toHaveProperty('totalAssets');
      expect(stats).toHaveProperty('totalEvents');
      expect(stats).toHaveProperty('averageEventsPerAsset');
    });

    it('should have positive asset and event counts', () => {
      const stats = mapper.getStatistics();
      expect(stats.totalAssets).toBeGreaterThan(0);
      expect(stats.totalEvents).toBeGreaterThan(0);
    });

    it('should calculate reasonable average events per asset', () => {
      const stats = mapper.getStatistics();
      expect(stats.averageEventsPerAsset).toBeGreaterThan(0);
      expect(stats.averageEventsPerAsset).toBeLessThan(50); // Sanity check
    });
  });

  describe('asset-event relationships', () => {
    it('should have equity indices mapped', () => {
      const spyEvents = mapper.getEventsForAsset('SPY');
      expect(spyEvents.length).toBeGreaterThan(0);
    });

    it('should have forex pairs mapped', () => {
      const eurusdEvents = mapper.getEventsForAsset('EURUSD');
      expect(eurusdEvents.length).toBeGreaterThan(0);
    });

    it('should have commodities mapped', () => {
      const goldEvents = mapper.getEventsForAsset('XAUUSD');
      expect(goldEvents.length).toBeGreaterThan(0);
    });

    it('should have cryptocurrencies mapped', () => {
      const btcEvents = mapper.getEventsForAsset('BTC');
      expect(btcEvents.length).toBeGreaterThan(0);
    });
  });
});
