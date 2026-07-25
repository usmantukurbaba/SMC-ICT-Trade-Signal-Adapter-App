import { SignalAggregator } from '../../src/aggregators/signalAggregator';
import { ConfidenceLevel, SignalType, TradeDirection, SignalSource } from '../../src/interfaces/tradeSignal';

describe('SignalAggregator', () => {
  let aggregator: SignalAggregator;

  beforeEach(() => {
    aggregator = new SignalAggregator(2);
  });

  describe('addSignal', () => {
    it('should add a single signal to buffer', () => {
      const signal = {
        id: 'sig1',
        timestamp: new Date(),
        asset: 'EURUSD',
        signalType: SignalType.BREAKOUT,
        direction: TradeDirection.LONG,
        entryPrice: 1.0850,
        confidence: ConfidenceLevel.HIGH,
        source: SignalSource.SMC,
        description: 'Test signal'
      };

      aggregator.addSignal(signal);
      const allSignals = aggregator.getAllSignals();

      expect(allSignals.length).toBe(1);
      expect(allSignals[0].asset).toBe('EURUSD');
    });
  });

  describe('addSignals', () => {
    it('should add multiple signals to buffer', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.LONG,
          entryPrice: 1.0860,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const allSignals = aggregator.getAllSignals();

      expect(allSignals.length).toBe(2);
    });
  });

  describe('getSignalsForAsset', () => {
    it('should return signals for specific asset', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'GBPUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.SHORT,
          entryPrice: 1.2500,
          confidence: ConfidenceLevel.MEDIUM,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const eurusdSignals = aggregator.getSignalsForAsset('EURUSD');

      expect(eurusdSignals.length).toBe(1);
      expect(eurusdSignals[0].asset).toBe('EURUSD');
    });

    it('should return empty array for unmapped asset', () => {
      const signals = aggregator.getSignalsForAsset('UNMAPPED');
      expect(signals).toEqual([]);
    });
  });

  describe('findConfluences', () => {
    it('should find confluence from multiple signals', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          stopLoss: 1.0800,
          takeProfit: [1.0900],
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.LONG,
          entryPrice: 1.0860,
          stopLoss: 1.0800,
          takeProfit: [1.0900],
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const confluences = aggregator.findConfluences();

      expect(confluences.length).toBeGreaterThan(0);
      expect(confluences[0].confluenceCount).toBe(2);
      expect(confluences[0].asset).toBe('EURUSD');
    });

    it('should not find confluence with insufficient signals', () => {
      const signal = {
        id: 'sig1',
        timestamp: new Date(),
        asset: 'EURUSD',
        signalType: SignalType.BREAKOUT,
        direction: TradeDirection.LONG,
        entryPrice: 1.0850,
        confidence: ConfidenceLevel.HIGH,
        source: SignalSource.SMC,
        description: 'Signal 1'
      };

      aggregator.addSignal(signal);
      const confluences = aggregator.findConfluences();

      expect(confluences.length).toBe(0);
    });

    it('should not create confluence with different directions', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.SHORT,
          entryPrice: 1.0860,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const confluences = aggregator.findConfluences();

      expect(confluences.length).toBe(0);
    });
  });

  describe('getHighConfluences', () => {
    it('should return only high confidence confluences', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          confidence: ConfidenceLevel.VERY_HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.LONG,
          entryPrice: 1.0860,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const highConfluences = aggregator.getHighConfluences(ConfidenceLevel.HIGH);

      expect(highConfluences.length).toBeGreaterThan(0);
      highConfluences.forEach(confluence => {
        const confidenceValues = { LOW: 1, MEDIUM: 2, HIGH: 3, VERY_HIGH: 4 };
        const cValue = confidenceValues[confluence.combinedConfidence as keyof typeof confidenceValues];
        expect(cValue).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('convergenceScore', () => {
    it('should calculate high convergence score for aligned signals', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          stopLoss: 1.0800,
          takeProfit: [1.0900],
          confidence: ConfidenceLevel.VERY_HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0852,
          stopLoss: 1.0800,
          takeProfit: [1.0900],
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const confluences = aggregator.findConfluences();

      expect(confluences.length).toBeGreaterThan(0);
      expect(confluences[0].convergenceScore).toBeGreaterThan(50);
    });
  });

  describe('getAggregationResult', () => {
    it('should return aggregation statistics', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.LONG,
          entryPrice: 1.0860,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const result = aggregator.getAggregationResult();

      expect(result.totalSignalsProcessed).toBe(2);
      expect(result.confluenceSignalsGenerated).toBeGreaterThanOrEqual(0);
      expect(result.aggregatedAssets).toContain('EURUSD');
    });
  });

  describe('clearBuffer', () => {
    it('should clear all signals from buffer', () => {
      const signal = {
        id: 'sig1',
        timestamp: new Date(),
        asset: 'EURUSD',
        signalType: SignalType.BREAKOUT,
        direction: TradeDirection.LONG,
        entryPrice: 1.0850,
        confidence: ConfidenceLevel.HIGH,
        source: SignalSource.SMC,
        description: 'Signal 1'
      };

      aggregator.addSignal(signal);
      expect(aggregator.getAllSignals().length).toBe(1);

      aggregator.clearBuffer();
      expect(aggregator.getAllSignals().length).toBe(0);
    });
  });

  describe('setConfluenceThreshold', () => {
    it('should update confluence threshold', () => {
      aggregator.setConfluenceThreshold(3);
      // Test that threshold is applied in findConfluences
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.LONG,
          entryPrice: 1.0860,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const confluences = aggregator.findConfluences();

      // Should be no confluences with threshold of 3
      expect(confluences.length).toBe(0);
    });
  });

  describe('confluence properties', () => {
    it('should calculate correct average entry price', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0800,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.LONG,
          entryPrice: 1.0900,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const confluences = aggregator.findConfluences();

      expect(confluences.length).toBeGreaterThan(0);
      expect(confluences[0].averageEntryPrice).toBe(1.085);
    });

    it('should list all sources in confluence', () => {
      const signals = [
        {
          id: 'sig1',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.BREAKOUT,
          direction: TradeDirection.LONG,
          entryPrice: 1.0850,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.SMC,
          description: 'Signal 1'
        },
        {
          id: 'sig2',
          timestamp: new Date(),
          asset: 'EURUSD',
          signalType: SignalType.REVERSAL,
          direction: TradeDirection.LONG,
          entryPrice: 1.0860,
          confidence: ConfidenceLevel.HIGH,
          source: SignalSource.ICT,
          description: 'Signal 2'
        }
      ];

      aggregator.addSignals(signals);
      const confluences = aggregator.findConfluences();

      expect(confluences.length).toBeGreaterThan(0);
      expect(confluences[0].sources).toContain(SignalSource.SMC);
      expect(confluences[0].sources).toContain(SignalSource.ICT);
    });
  });
});
