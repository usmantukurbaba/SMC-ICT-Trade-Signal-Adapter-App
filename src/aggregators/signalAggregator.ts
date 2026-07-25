import { TradeSignal, ConfidenceLevel, TradeDirection } from '../interfaces/tradeSignal';
import { ConfluenceSignal, AggregationResult } from '../interfaces/confluenceSignal';

/**
 * Signal Aggregator - Combines multiple trade signals to identify confluences
 * Analyzes signal alignment and generates confluence opportunities
 */
export class SignalAggregator {
  private signalBuffer: TradeSignal[] = [];
  private confluenceThreshold: number = 2; // Minimum signals to form confluence

  constructor(confluenceThreshold: number = 2) {
    this.confluenceThreshold = Math.max(2, confluenceThreshold);
  }

  /**
   * Add a signal to the aggregation buffer
   */
  addSignal(signal: TradeSignal): void {
    this.signalBuffer.push(signal);
  }

  /**
   * Add multiple signals at once
   */
  addSignals(signals: TradeSignal[]): void {
    this.signalBuffer.push(...signals);
  }

  /**
   * Get all signals for a specific asset
   */
  getSignalsForAsset(asset: string): TradeSignal[] {
    return this.signalBuffer.filter(s => s.asset === asset);
  }

  /**
   * Check if signals have the same direction
   */
  private haveSameDirection(signals: TradeSignal[]): boolean {
    if (signals.length === 0) return false;
    const firstDirection = signals[0].direction;
    return signals.every(s => s.direction === firstDirection);
  }

  /**
   * Check if signals have similar entry prices (within tolerance)
   */
  private haveSimilarEntryPrices(signals: TradeSignal[], tolerance: number = 0.02): boolean {
    if (signals.length < 2) return true;
    const prices = signals.map(s => s.entryPrice);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const range = Math.abs(Math.max(...prices) - Math.min(...prices));
    const allowedRange = avgPrice * tolerance;
    return range <= allowedRange;
  }

  /**
   * Calculate convergence score based on signal alignment
   */
  private calculateConvergenceScore(signals: TradeSignal[]): number {
    let score = 0;
    const maxScore = 100;

    // Same direction (30 points)
    if (this.haveSameDirection(signals)) {
      score += 30;
    }

    // Similar entry prices (25 points)
    if (this.haveSimilarEntryPrices(signals)) {
      score += 25;
    }

    // Average confidence boost (25 points)
    const confidenceValues = { VERY_HIGH: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const avgConfidence =
      signals.reduce((sum, s) => sum + confidenceValues[s.confidence as keyof typeof confidenceValues], 0) /
      signals.length;
    score += (avgConfidence / 4) * 25;

    // Multiple sources boost (20 points)
    const uniqueSources = new Set(signals.map(s => s.source)).size;
    if (uniqueSources >= 2) {
      score += 20;
    }

    return Math.round(Math.min(score, maxScore));
  }

  /**
   * Calculate combined confidence from multiple signals
   */
  private calculateCombinedConfidence(signals: TradeSignal[]): ConfidenceLevel {
    const confidenceValues = { VERY_HIGH: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const avgConfidence =
      signals.reduce((sum, s) => sum + confidenceValues[s.confidence as keyof typeof confidenceValues], 0) /
      signals.length;

    if (avgConfidence >= 3.5) return ConfidenceLevel.VERY_HIGH;
    if (avgConfidence >= 2.75) return ConfidenceLevel.HIGH;
    if (avgConfidence >= 1.75) return ConfidenceLevel.MEDIUM;
    return ConfidenceLevel.LOW;
  }

  /**
   * Find common stop losses across signals
   */
  private findCommonStopLoss(signals: TradeSignal[]): number | undefined {
    const stopLosses = signals.filter(s => s.stopLoss !== undefined).map(s => s.stopLoss as number);
    if (stopLosses.length === 0) return undefined;

    // Check if all stop losses are within 0.5% of each other
    const avgSL = stopLosses.reduce((a, b) => a + b, 0) / stopLosses.length;
    const tolerance = avgSL * 0.005;
    const isCommon = stopLosses.every(sl => Math.abs(sl - avgSL) <= tolerance);

    return isCommon ? Math.round(avgSL * 10000) / 10000 : undefined;
  }

  /**
   * Find common take profit levels across signals
   */
  private findCommonTakeProfits(signals: TradeSignal[]): number[] {
    const allTakeProfits = signals
      .filter(s => s.takeProfit && s.takeProfit.length > 0)
      .flatMap(s => s.takeProfit as number[]);

    if (allTakeProfits.length === 0) return [];

    // Group similar take profits (within 0.5%)
    const grouped: number[] = [];
    allTakeProfits.sort((a, b) => a - b);

    for (const tp of allTakeProfits) {
      const similar = grouped.find(g => Math.abs(g - tp) <= g * 0.005);
      if (!similar) {
        grouped.push(tp);
      }
    }

    return grouped.sort((a, b) => a - b);
  }

  /**
   * Generate confluence signal from multiple signals
   */
  private generateConfluenceSignal(signals: TradeSignal[]): ConfluenceSignal {
    const prices = signals.map(s => s.entryPrice);
    const convergenceScore = this.calculateConvergenceScore(signals);

    return {
      asset: signals[0].asset,
      timestamp: new Date(),
      confluenceCount: signals.length,
      sources: Array.from(new Set(signals.map(s => s.source))),
      combinedConfidence: this.calculateCombinedConfidence(signals),
      signals: signals,
      convergenceScore,
      averageEntryPrice: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 10000) / 10000,
      entryPriceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      commonStopLoss: this.findCommonStopLoss(signals),
      commonTakeProfits: this.findCommonTakeProfits(signals),
      description: `Confluence signal from ${signals.length} sources for ${signals[0].asset}`
    };
  }

  /**
   * Find all confluence signals in the buffer
   */
  findConfluences(): ConfluenceSignal[] {
    const assetSignalsMap = new Map<string, TradeSignal[]>();

    // Group signals by asset
    for (const signal of this.signalBuffer) {
      if (!assetSignalsMap.has(signal.asset)) {
        assetSignalsMap.set(signal.asset, []);
      }
      assetSignalsMap.get(signal.asset)!.push(signal);
    }

    // Generate confluences for assets with enough signals
    const confluences: ConfluenceSignal[] = [];
    for (const [asset, signals] of assetSignalsMap.entries()) {
      if (signals.length >= this.confluenceThreshold) {
        // Filter signals with same direction
        const longSignals = signals.filter(s => s.direction === signals[0].direction);
        if (longSignals.length >= this.confluenceThreshold) {
          confluences.push(this.generateConfluenceSignal(longSignals));
        }
      }
    }

    return confluences;
  }

  /**
   * Get high-confidence confluences only
   */
  getHighConfluences(minConfidence: ConfidenceLevel = ConfidenceLevel.HIGH): ConfluenceSignal[] {
    const confidenceValues = { LOW: 1, MEDIUM: 2, HIGH: 3, VERY_HIGH: 4 };
    const minValue = confidenceValues[minConfidence as keyof typeof confidenceValues];

    return this.findConfluences().filter(c => {
      const cValue = confidenceValues[c.combinedConfidence as keyof typeof confidenceValues];
      return cValue >= minValue;
    });
  }

  /**
   * Get aggregation statistics
   */
  getAggregationResult(): AggregationResult {
    const confluences = this.findConfluences();
    const confluenceCounts = confluences.map(c => c.confluenceCount);

    return {
      totalSignalsProcessed: this.signalBuffer.length,
      confluenceSignalsGenerated: confluences.length,
      averageConfluenceCount:
        confluenceCounts.length > 0 ? Math.round((confluenceCounts.reduce((a, b) => a + b, 0) / confluenceCounts.length) * 100) / 100 : 0,
      highestConfluenceScore: confluences.length > 0 ? Math.max(...confluences.map(c => c.convergenceScore)) : 0,
      aggregatedAssets: Array.from(new Set(confluences.map(c => c.asset)))
    };
  }

  /**
   * Clear the signal buffer
   */
  clearBuffer(): void {
    this.signalBuffer = [];
  }

  /**
   * Get all signals in buffer
   */
  getAllSignals(): TradeSignal[] {
    return [...this.signalBuffer];
  }

  /**
   * Set confluence threshold
   */
  setConfluenceThreshold(threshold: number): void {
    this.confluenceThreshold = Math.max(2, threshold);
  }
}
