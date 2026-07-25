import { EconomicEventAdapter } from '../../src/adapters/economicEventAdapter';
import { EventType, ImpactLevel } from '../../src/interfaces/economicEvent';

describe('EconomicEventAdapter', () => {
  let adapter: EconomicEventAdapter;

  beforeEach(() => {
    adapter = new EconomicEventAdapter('test-event-adapter');
  });

  describe('convert', () => {
    it('should convert valid raw event data to EconomicEvent', () => {
      const rawData = {
        id: 'event_001',
        timestamp: '2024-01-15T13:30:00Z',
        eventName: 'NFP',
        country: 'US',
        impact: 'HIGH',
        forecast: 200000,
        previous: 185000,
        actual: 195000,
        releaseTime: '2024-01-15T13:30:00Z',
        description: 'Non-Farm Payroll Report',
        affectedAssets: ['EURUSD', 'GBPUSD', 'USDJPY']
      };

      const event = adapter.convert(rawData);

      expect(event.id).toBe('event_001');
      expect(event.eventName).toBe(EventType.NFP);
      expect(event.country).toBe('US');
      expect(event.impact).toBe(ImpactLevel.HIGH);
      expect(event.forecast).toBe(200000);
      expect(event.affectedAssets).toContain('EURUSD');
    });

    it('should throw error for invalid event data', () => {
      const invalidData = {
        eventName: 'NFP'
        // Missing required fields
      };

      expect(() => adapter.convert(invalidData)).toThrow();
    });

    it('should generate ID if not provided', () => {
      const rawData = {
        eventName: 'CPI',
        country: 'US',
        impact: 'HIGH',
        description: 'Consumer Price Index',
        affectedAssets: ['EURUSD']
      };

      const event = adapter.convert(rawData);
      expect(event.id).toBeDefined();
      expect(event.id).toMatch(/^event_/);
    });

    it('should handle single affected asset as array', () => {
      const rawData = {
        eventName: 'FOMC',
        country: 'US',
        impact: 'HIGH',
        description: 'FOMC Decision',
        affectedAssets: 'EURUSD'
      };

      const event = adapter.convert(rawData);
      expect(Array.isArray(event.affectedAssets)).toBe(true);
      expect(event.affectedAssets).toContain('EURUSD');
    });

    it('should default country to US if not provided', () => {
      const rawData = {
        eventName: 'NFP',
        impact: 'HIGH',
        description: 'Non-Farm Payroll',
        affectedAssets: ['EURUSD']
      };

      const event = adapter.convert(rawData);
      expect(event.country).toBe('US');
    });
  });

  describe('validate', () => {
    it('should validate correct event data', () => {
      const validData = {
        eventName: 'NFP',
        country: 'US',
        impact: 'HIGH',
        affectedAssets: ['EURUSD']
      };

      expect(adapter.validate(validData)).toBe(true);
    });

    it('should reject null or undefined', () => {
      expect(adapter.validate(null)).toBe(false);
      expect(adapter.validate(undefined)).toBe(false);
    });

    it('should reject non-object data', () => {
      expect(adapter.validate('string')).toBe(false);
      expect(adapter.validate(123)).toBe(false);
    });

    it('should reject data missing required fields', () => {
      const incompleteData = {
        eventName: 'NFP'
        // Missing country, impact, affectedAssets
      };

      expect(adapter.validate(incompleteData)).toBe(false);
    });
  });

  describe('getAdapterId', () => {
    it('should return adapter ID', () => {
      expect(adapter.getAdapterId()).toBe('test-event-adapter');
    });
  });

  describe('parse methods', () => {
    it('should parse event types correctly', () => {
      const data = {
        eventName: 'nfp',
        country: 'US',
        impact: 'HIGH',
        description: 'NFP Test',
        affectedAssets: ['EURUSD']
      };

      const event = adapter.convert(data);
      expect(event.eventName).toBe(EventType.NFP);
    });

    it('should parse impact levels correctly', () => {
      const data = {
        eventName: 'CPI',
        country: 'US',
        impact: 'high',
        description: 'CPI Test',
        affectedAssets: ['EURUSD']
      };

      const event = adapter.convert(data);
      expect(event.impact).toBe(ImpactLevel.HIGH);
    });

    it('should default to MEDIUM impact if invalid', () => {
      const data = {
        eventName: 'CPI',
        country: 'US',
        impact: 'INVALID',
        description: 'CPI Test',
        affectedAssets: ['EURUSD']
      };

      const event = adapter.convert(data);
      expect(event.impact).toBe(ImpactLevel.MEDIUM);
    });
  });
});
