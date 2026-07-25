import { SignalProcessor } from '../../src/processors/signalProcessor';
import { TradeSignalAdapter } from '../../src/adapters/tradeSignalAdapter';
import { EconomicEventAdapter } from '../../src/adapters/economicEventAdapter';
import { AssetEventMapper } from '../../src/mappers/assetEventMapper';
import { ConfidenceLevel, SignalType, TradeDirection } from '../../src/interfaces/tradeSignal';
import { EventType, ImpactLevel } from '../../src/interfaces/economicEvent';

describe('SignalProcessor', () => {
  let processor: SignalProcessor;
  let signalAdapter: TradeSignalAdapter;
  let eventAdapter: EconomicEventAdapter;
  let mapper: AssetEventMapper;

  beforeEach(() => {
    signalAdapter = new TradeSignalAdapter('test-signal');
    eventAdapter = new EconomicEventAdapter('test-event');
    mapper = new AssetEventMapper();
    processor = new SignalProcessor(signalAdapter, eventAdapter, mapper);
  });

  describe('processTradeSignal', () => {
    it('should process a valid trade signal', () => {
      const rawSignal = {
        asset: 'EURUSD',
        signalType: 'BREAKOUT',
        direction: 'LONG',
        entryPrice: 1.0850,
        confidence: 'HIGH',
        source: 'SMC',
        description: 'Test signal'
      };

      const signal = processor.processTradeSignal(rawSignal);

      expect(signal.asset).toBe('EURUSD');
      expect(signal.signalType).toBe(SignalType.BREAKOUT);
      expect(signal.direction).toBe(TradeDirection.LONG);
    });

    it('should throw error for invalid signal', () => {
      const invalidSignal = { asset: 'EURUSD' }; // Missing required fields

      expect(() => processor.processTradeSignal(invalidSignal)).toThrow();
    });

    it('should add processed signal to history', () => {
      const rawSignal = {
        asset: 'EURUSD',
        signalType: 'BREAKOUT',
        direction: 'LONG',
        entryPrice: 1.0850,
        confidence: 'HIGH',
        source: 'SMC',
        description: 'Test signal'
      };

      processor.processTradeSignal(rawSignal);
      const signals = processor.getProcessedSignals();

      expect(signals.length).toBe(1);
    });
  });

  describe('processEconomicEvent', () => {
    it('should process a valid economic event', () => {
      const rawEvent = {
        eventName: 'NFP',
        country: 'US',
        impact: 'HIGH',
        description: 'Non-Farm Payroll',
        affectedAssets: ['EURUSD', 'GBPUSD']
      };

      const event = processor.processEconomicEvent(rawEvent);

      expect(event.eventName).toBe(EventType.NFP);
      expect(event.country).toBe('US');
      expect(event.impact).toBe(ImpactLevel.HIGH);
    });

    it('should add processed event to history', () => {
      const rawEvent = {
        eventName: 'CPI',
        country: 'US',
        impact: 'HIGH',
        description: 'Consumer Price Index',
        affectedAssets: ['EURUSD']
      };

      processor.processEconomicEvent(rawEvent);
      const events = processor.getProcessedEvents();

      expect(events.length).toBe(1);
    });
  });

  describe('processTradeSignals', () => {
    it('should process multiple trade signals', () => {
      const rawSignals = [
        {
          asset: 'EURUSD',
          signalType: 'BREAKOUT',
          direction: 'LONG',
          entryPrice: 1.0850,
          confidence: 'HIGH',
          source: 'SMC',
          description: 'Signal 1'
        },
        {
          asset: 'GBPUSD',
          signalType: 'REVERSAL',
          direction: 'SHORT',
          entryPrice: 1.2500,
          confidence: 'MEDIUM',
          source: 'ICT',
          description: 'Signal 2'
        }
      ];

      const signals = processor.processTradeSignals(rawSignals);

      expect(signals.length).toBe(2);
      expect(signals[0].asset).toBe('EURUSD');
      expect(signals[1].asset).toBe('GBPUSD');
    });
  });

  describe('processEconomicEvents', () => {
    it('should process multiple economic events', () => {
      const rawEvents = [
        {
          eventName: 'NFP',
          country: 'US',
          impact: 'HIGH',
          description: 'NFP',
          affectedAssets: ['EURUSD']
        },
        {
          eventName: 'CPI',
          country: 'US',
          impact: 'HIGH',
          description: 'CPI',
          affectedAssets: ['XAUUSD']
        }
      ];

      const events = processor.processEconomicEvents(rawEvents);

      expect(events.length).toBe(2);
    });
  });

  describe('isSignalRelevant', () => {
    it('should determine signal is relevant to events', () => {
      const signal = {
        id: 'sig1',
        timestamp: new Date(),
        asset: 'EURUSD',
        signalType: SignalType.BREAKOUT,
        direction: TradeDirection.LONG,
        entryPrice: 1.0850,
        confidence: ConfidenceLevel.HIGH,
        source: 'SMC' as any,
        description: 'Test'
      };

      const events = [
        {
          id: 'evt1',
          timestamp: new Date(),
          eventName: EventType.NFP,
          country: 'US',
          impact: ImpactLevel.HIGH,
          description: 'NFP',
          affectedAssets: ['EURUSD']
        }
      ];

      const isRelevant = processor.isSignalRelevant(signal, events);
      expect(isRelevant).toBe(true);
    });

    it('should determine signal is not relevant to events', () => {
      const signal = {
        id: 'sig1',
        timestamp: new Date(),
        asset: 'EURUSD',
        signalType: SignalType.BREAKOUT,
        direction: TradeDirection.LONG,
        entryPrice: 1.0850,
        confidence: ConfidenceLevel.HIGH,
        source: 'SMC' as any,
        description: 'Test'
      };

      const events = [
        {
          id: 'evt1',
          timestamp: new Date(),
          eventName: EventType.EARNINGS_REPORT,
          country: 'US',
          impact: ImpactLevel.HIGH,
          description: 'Earnings',
          affectedAssets: ['SPY']
        }
      ];

      const isRelevant = processor.isSignalRelevant(signal, events);
      expect(isRelevant).toBe(false);
    });
  });

  describe('getRelevantEvents', () => {
    it('should return relevant events for a signal', () => {
      const signal = {
        id: 'sig1',
        timestamp: new Date(),
        asset: 'XAUUSD',
        signalType: SignalType.BREAKOUT,
        direction: TradeDirection.LONG,
        entryPrice: 1900,
        confidence: ConfidenceLevel.HIGH,
        source: 'SMC' as any,
        description: 'Test'
      };

      const events = [
        {
          id: 'evt1',
          timestamp: new Date(),
          eventName: EventType.CPI,
          country: 'US',
          impact: ImpactLevel.HIGH,
          description: 'CPI',
          affectedAssets: ['XAUUSD']
        },
        {
          id: 'evt2',
          timestamp: new Date(),
          eventName: EventType.FED_RATE,
          country: 'US',
          impact: ImpactLevel.HIGH,
          description: 'Fed Rate',
          affectedAssets: ['XAUUSD']
        }
      ];

      const relevant = processor.getRelevantEvents(signal, events);
      expect(relevant.length).toBe(2);
    });
  });

  describe('scoreSignalRelevance', () => {
    it('should score signal with no relevant events', () => {
      const signal = {
        id: 'sig1',
        timestamp: new Date(),
        asset: 'EURUSD',
        signalType: SignalType.BREAKOUT,
        direction: TradeDirection.LONG,
        entryPrice: 1.0850,
        confidence: ConfidenceLevel.HIGH,
        source: 'SMC' as any,
        description: 'Test'
      };

      const score = processor.scoreSignalRelevance(signal, []);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should score signal with relevant events', () => {
      const signal = {
        id: 'sig1',
        timestamp: new Date(),
        asset: 'EURUSD',
        signalType: SignalType.BREAKOUT,
        direction: TradeDirection.LONG,
        entryPrice: 1.0850,
        confidence: ConfidenceLevel.HIGH,
        source: 'SMC' as any,
        description: 'Test'
      };

      const events = [
        {
          id: 'evt1',
          timestamp: new Date(),
          eventName: EventType.NFP,
          country: 'US',
          impact: ImpactLevel.HIGH,
          description: 'NFP',
          affectedAssets: ['EURUSD']
        }
      ];

      const score = processor.scoreSignalRelevance(signal, events);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getStatistics', () => {
    it('should return processor statistics', () => {
      const rawSignal = {
        asset: 'EURUSD',
        signalType: 'BREAKOUT',
        direction: 'LONG',
        entryPrice: 1.0850,
        confidence: 'HIGH',
        source: 'SMC',
        description: 'Test'
      };

      const rawEvent = {
        eventName: 'NFP',
        country: 'US',
        impact: 'HIGH',
        description: 'NFP',
        affectedAssets: ['EURUSD']
      };

      processor.processTradeSignal(rawSignal);
      processor.processEconomicEvent(rawEvent);

      const stats = processor.getStatistics();

      expect(stats.totalSignalsProcessed).toBe(1);
      expect(stats.totalEventsProcessed).toBe(1);
      expect(stats.uniqueAssets).toBe(1);
      expect(stats.uniqueEvents).toBe(1);
    });
  });

  describe('clearHistory', () => {
    it('should clear processing history', () => {
      const rawSignal = {
        asset: 'EURUSD',
        signalType: 'BREAKOUT',
        direction: 'LONG',
        entryPrice: 1.0850,
        confidence: 'HIGH',
        source: 'SMC',
        description: 'Test'
      };

      processor.processTradeSignal(rawSignal);
      expect(processor.getProcessedSignals().length).toBe(1);

      processor.clearHistory();
      expect(processor.getProcessedSignals().length).toBe(0);
    });
  });
});
