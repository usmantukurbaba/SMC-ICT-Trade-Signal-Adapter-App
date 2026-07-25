import { PatternType, PatternMatch } from '../interfaces/patternAnalysis';

/**
 * Signal Pattern Analyzer - Detects chart patterns from signal data
 * Implements pattern recognition for advanced trading analysis
 */
export class SignalPatternAnalyzer {
  private patterns: PatternMatch[] = [];

  /**
   * Analyze signals for pattern formation
   * This is a simplified pattern detector for demonstration
   */
  detectPatterns(
    assetSignals: Array<{
      asset: string;
      timestamp: Date;
      price: number;
      type: string;
    }>
  ): PatternMatch[] {
    if (assetSignals.length < 3) return [];

    const detected: PatternMatch[] = [];
    const asset = assetSignals[0].asset;
    const prices = assetSignals.map(s => s.price);

    // Simple pattern detection logic
    if (this.isDoubleBottom(prices)) {
      detected.push({
        id: `pattern_${Date.now()}`,
        timestamp: new Date(),
        asset,
        patternType: PatternType.DOUBLE_BOTTOM,
        confidence: this.calculatePatternConfidence(prices),
        startTime: assetSignals[0].timestamp,
        endTime: assetSignals[assetSignals.length - 1].timestamp,
        description: 'Double Bottom pattern detected',
        breakoutDirection: 'UP'
      });
    }

    if (this.isDoubleTop(prices)) {
      detected.push({
        id: `pattern_${Date.now()}_top`,
        timestamp: new Date(),
        asset,
        patternType: PatternType.DOUBLE_TOP,
        confidence: this.calculatePatternConfidence(prices),
        startTime: assetSignals[0].timestamp,
        endTime: assetSignals[assetSignals.length - 1].timestamp,
        description: 'Double Top pattern detected',
        breakoutDirection: 'DOWN'
      });
    }

    if (this.isTriangle(prices)) {
      detected.push({
        id: `pattern_${Date.now()}_triangle`,
        timestamp: new Date(),
        asset,
        patternType: PatternType.TRIANGLE,
        confidence: this.calculatePatternConfidence(prices),
        startTime: assetSignals[0].timestamp,
        endTime: assetSignals[assetSignals.length - 1].timestamp,
        description: 'Triangle pattern detected'
      });
    }

    this.patterns.push(...detected);
    return detected;
  }

  /**
   * Detect double bottom pattern
   */
  private isDoubleBottom(prices: number[]): boolean {
    if (prices.length < 5) return false;
    const min1 = Math.min(...prices.slice(0, Math.floor(prices.length / 2)));
    const min2 = Math.min(...prices.slice(Math.floor(prices.length / 2)));
    return Math.abs(min1 - min2) < min1 * 0.02 && prices[prices.length - 1] > min1 * 1.02;
  }

  /**
   * Detect double top pattern
   */
  private isDoubleTop(prices: number[]): boolean {
    if (prices.length < 5) return false;
    const max1 = Math.max(...prices.slice(0, Math.floor(prices.length / 2)));
    const max2 = Math.max(...prices.slice(Math.floor(prices.length / 2)));
    return Math.abs(max1 - max2) < max1 * 0.02 && prices[prices.length - 1] < max1 * 0.98;
  }

  /**
   * Detect triangle pattern
   */
  private isTriangle(prices: number[]): boolean {
    if (prices.length < 5) return false;
    const range = Math.max(...prices) - Math.min(...prices);
    const isConverging = range * 0.5 > Math.max(...prices.slice(Math.floor(prices.length / 2))) - Math.min(...prices.slice(Math.floor(prices.length / 2)));
    return isConverging;
  }

  /**
   * Calculate pattern confidence score
   */
  private calculatePatternConfidence(prices: number[]): number {
    // Simple confidence calculation based on price consistency
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean; // Coefficient of variation

    // Lower CV = higher confidence
    return Math.max(30, Math.min(95, 100 - cv * 1000));
  }

  /**
   * Get all detected patterns
   */
  getAllPatterns(): PatternMatch[] {
    return [...this.patterns];
  }

  /**
   * Get patterns by type
   */
  getPatternsByType(patternType: PatternType): PatternMatch[] {
    return this.patterns.filter(p => p.patternType === patternType);
  }

  /**
   * Get patterns by asset
   */
  getPatternsByAsset(asset: string): PatternMatch[] {
    return this.patterns.filter(p => p.asset === asset);
  }

  /**
   * Get high-confidence patterns
   */
  getHighConfidencePatterns(minConfidence: number = 70): PatternMatch[] {
    return this.patterns.filter(p => p.confidence >= minConfidence);
  }

  /**
   * Clear pattern history
   */
  clearPatterns(): void {
    this.patterns = [];
  }
}
