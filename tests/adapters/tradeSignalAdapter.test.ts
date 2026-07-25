import { TradeSignalAdapter } from '../../src/adapters/tradeSignalAdapter';
import { SignalType, TradeDirection, ConfidenceLevel, SignalSource } from '../../src/interfaces/tradeSignal';

describe('TradeSignalAdapter', () => {
  let adapter: TradeSignalAdapter;

  beforeEach(() => {
    adapter = new TradeSignalAdapter('test-signal-adapter');
  });

  describe('convert', () => {
    it('should convert valid raw signal data to TradeSignal', () => {
      const rawData = {
        id: 'signal_001',
        timestamp: '2024-01-15T10:30:00Z',
        asset: 'EURUSD',
        signalType: 'BREAKOUT',
        direction: 'LONG',
        entryPrice: 1.0850,
        stopLoss: 1.0800,
        takeProfit: [1.0900, 1.0950],
        confidence: 'HIGH',
        source: 'SMC',
        description: 'Daily breakout signal'
      };

      const signal = adapter.convert(rawData);

      expect(signal.id).toBe('signal_001');
      expect(signal.asset).toBe('EURUSD');
      expect(signal.signalType).toBe(SignalType.BREAKOUT);
      expect(signal.direction).toBe(TradeDirection.LONG);
      expect(signal.entryPrice).toBe(1.0850);
      expect(signal.stopLoss).toBe(1.0800);
      expect(signal.takeProfit).toEqual([1.0900, 1.0950]);
      expect(signal.confidence).toBe(ConfidenceLevel.HIGH);
      expect(signal.source).toBe(SignalSource.SMC);
    });

    it('should throw error for invalid signal data', () => {
      const invalidData = {
        asset: 'EURUSD'
        // Missing required fields
      };

      expect(() => adapter.convert(invalidData)).toThrow();
    });

    it('should generate ID if not provided', () => {
      const rawData = {
        asset: 'GBPUSD',
        signalType: 'REVERSAL',
        direction: 'SHORT',
        entryPrice: 1.2500,
        confidence: 'MEDIUM',
        source: 'ICT',
        description: 'Test signal'
      };

      const signal = adapter.convert(rawData);
      expect(signal.id).toBeDefined();
      expect(signal.id).toMatch(/^signal_/);
    });

    it('should handle single takeProfit as array', () => {
      const rawData = {
        asset: 'AUDUSD',
        signalType: 'CONTINUATION',
        direction: 'LONG',
        entryPrice: 0.6500,
        takeProfit: 0.6550,
        confidence: 'LOW',
        source: 'CUSTOM',
        description: 'Test'
      };

      const signal = adapter.convert(rawData);
      expect(Array.isArray(signal.takeProfit)).toBe(true);
      expect(signal.takeProfit).toContain(0.6550);
    });
  });

  describe('validate', () => {
    it('should validate correct signal data', () => {
      const validData = {
        asset: 'EURUSD',
        signalType: 'BREAKOUT',
        direction: 'LONG',
        entryPrice: 1.0850,
        confidence: 'HIGH'
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
        asset: 'EURUSD',
        signalType: 'BREAKOUT'
        // Missing direction, entryPrice, confidence
      };

      expect(adapter.validate(incompleteData)).toBe(false);
    });
  });

  describe('getAdapterId', () => {
    it('should return adapter ID', () => {
      expect(adapter.getAdapterId()).toBe('test-signal-adapter');
    });
  });

  describe('parse methods', () => {
    it('should parse signal types correctly', () => {
      const data = {
        asset: 'EURUSD',
        signalType: 'breakout',
        direction: 'LONG',
        entryPrice: 1.0850,
        confidence: 'HIGH',
        source: 'SMC',
        description: 'Test'
      };

      const signal = adapter.convert(data);
      expect(signal.signalType).toBe(SignalType.BREAKOUT);
    });

    it('should parse direction correctly', () => {
      const longData = {
        asset: 'EURUSD',
        signalType: 'BREAKOUT',
        direction: 'long',
        entryPrice: 1.0850,
        confidence: 'HIGH',
        source: 'SMC',
        description: 'Test'
      };

      const longSignal = adapter.convert(longData);
      expect(longSignal.direction).toBe(TradeDirection.LONG);

      const shortData = { ...longData, direction: 'SHORT' };
      const shortSignal = adapter.convert(shortData);
      expect(shortSignal.direction).toBe(TradeDirection.SHORT);
    });

    it('should default to MEDIUM confidence if invalid', () => {
      const data = {
        asset: 'EURUSD',
        signalType: 'BREAKOUT',
        direction: 'LONG',
        entryPrice: 1.0850,
        confidence: 'INVALID',
        source: 'SMC',
        description: 'Test'
      };

      const signal = adapter.convert(data);
      expect(signal.confidence).toBe(ConfidenceLevel.MEDIUM);
    });
  });
});
