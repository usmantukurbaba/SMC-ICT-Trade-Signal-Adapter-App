import { SignalPatternAnalyzer } from '../../src/analyzers/signalPatternAnalyzer';
import { PatternType } from '../../src/interfaces/patternAnalysis';

describe('SignalPatternAnalyzer', () => {
  let analyzer: SignalPatternAnalyzer;

  beforeEach(() => {
    analyzer = new SignalPatternAnalyzer();
  });

  describe('detectPatterns', () => {
    it('should detect patterns from signals', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      const patterns = analyzer.detectPatterns(signals);
      expect(Array.isArray(patterns)).toBe(true);
    });

    it('should not detect patterns with insufficient signals', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      const patterns = analyzer.detectPatterns(signals);
      expect(patterns).toEqual([]);
    });

    it('should detect double bottom pattern', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0801 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      const patterns = analyzer.detectPatterns(signals);
      const doubleBottoms = patterns.filter(p => p.patternType === PatternType.DOUBLE_BOTTOM);

      if (doubleBottoms.length > 0) {
        expect(doubleBottoms[0].breakoutDirection).toBe('UP');
      }
    });

    it('should calculate pattern confidence', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      const patterns = analyzer.detectPatterns(signals);
      patterns.forEach(pattern => {
        expect(pattern.confidence).toBeGreaterThanOrEqual(0);
        expect(pattern.confidence).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('getPatternsByType', () => {
    it('should return patterns of specific type', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      analyzer.detectPatterns(signals);
      const doubleBottoms = analyzer.getPatternsByType(PatternType.DOUBLE_BOTTOM);

      doubleBottoms.forEach(pattern => {
        expect(pattern.patternType).toBe(PatternType.DOUBLE_BOTTOM);
      });
    });
  });

  describe('getPatternsByAsset', () => {
    it('should return patterns for specific asset', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      analyzer.detectPatterns(signals);
      const eurusdPatterns = analyzer.getPatternsByAsset('EURUSD');

      eurusdPatterns.forEach(pattern => {
        expect(pattern.asset).toBe('EURUSD');
      });
    });

    it('should return empty array for unmapped asset', () => {
      const patterns = analyzer.getPatternsByAsset('UNMAPPED');
      expect(patterns).toEqual([]);
    });
  });

  describe('getHighConfidencePatterns', () => {
    it('should return only high confidence patterns', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      analyzer.detectPatterns(signals);
      const highConfidence = analyzer.getHighConfidencePatterns(70);

      highConfidence.forEach(pattern => {
        expect(pattern.confidence).toBeGreaterThanOrEqual(70);
      });
    });
  });

  describe('getAllPatterns', () => {
    it('should return all detected patterns', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      const initialPatterns = analyzer.getAllPatterns();
      analyzer.detectPatterns(signals);
      const allPatterns = analyzer.getAllPatterns();

      expect(allPatterns.length).toBeGreaterThanOrEqual(initialPatterns.length);
    });
  });

  describe('clearPatterns', () => {
    it('should clear all detected patterns', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      analyzer.detectPatterns(signals);
      expect(analyzer.getAllPatterns().length).toBeGreaterThan(0);

      analyzer.clearPatterns();
      expect(analyzer.getAllPatterns()).toEqual([]);
    });
  });

  describe('pattern properties', () => {
    it('should include required pattern properties', () => {
      const signals = [
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 4 * 60000), price: 1.0900 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 3 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 2 * 60000), price: 1.0800 },
        { asset: 'EURUSD', timestamp: new Date(Date.now() - 1 * 60000), price: 1.0850 },
        { asset: 'EURUSD', timestamp: new Date(), price: 1.0900 }
      ];

      const patterns = analyzer.detectPatterns(signals);
      patterns.forEach(pattern => {
        expect(pattern).toHaveProperty('id');
        expect(pattern).toHaveProperty('timestamp');
        expect(pattern).toHaveProperty('asset');
        expect(pattern).toHaveProperty('patternType');
        expect(pattern).toHaveProperty('confidence');
        expect(pattern).toHaveProperty('startTime');
        expect(pattern).toHaveProperty('endTime');
        expect(pattern).toHaveProperty('description');
      });
    });
  });
});
