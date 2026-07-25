import { TradeSignal } from '../interfaces/tradeSignal';
import { EconomicEvent } from '../interfaces/economicEvent';
import { TradeSignalAdapter } from '../adapters/tradeSignalAdapter';
import { EconomicEventAdapter } from '../adapters/economicEventAdapter';
import { AssetEventMapper } from '../mappers/assetEventMapper';

/**
 * Signal Processor - Main orchestration engine
 * Processes trade signals and economic events, determining relevance and impact
 */
export class SignalProcessor {
  private signalAdapter: TradeSignalAdapter;
  private eventAdapter: EconomicEventAdapter;
  private assetMapper: AssetEventMapper;
  private processedSignals: TradeSignal[] = [];
  private processedEvents: EconomicEvent[] = [];

  constructor(
    signalAdapter?: TradeSignalAdapter,
    eventAdapter?: EconomicEventAdapter,
    assetMapper?: AssetEventMapper
  ) {
    this.signalAdapter = signalAdapter || new TradeSignalAdapter('default-processor-signal');
    this.eventAdapter = eventAdapter || new EconomicEventAdapter('default-processor-event');
    this.assetMapper = assetMapper || new AssetEventMapper();
  }

  /**
   * Process raw trade signal data
   */
  processTradeSignal(rawSignal: unknown): TradeSignal {
    const signal = this.signalAdapter.convert(rawSignal);
    this.processedSignals.push(signal);
    return signal;
  }

  /**
   * Process raw economic event data
   */
  processEconomicEvent(rawEvent: unknown): EconomicEvent {
    const event = this.eventAdapter.convert(rawEvent);
    this.processedEvents.push(event);
    return event;
  }

  /**
   * Process multiple trade signals
   */
  processTradeSignals(rawSignals: unknown[]): TradeSignal[] {
    return rawSignals.map(signal => this.processTradeSignal(signal));
  }

  /**
   * Process multiple economic events
   */
  processEconomicEvents(rawEvents: unknown[]): EconomicEvent[] {
    return rawEvents.map(event => this.processEconomicEvent(event));
  }

  /**
   * Determine if a signal is relevant based on current events
   */
  isSignalRelevant(signal: TradeSignal, events: EconomicEvent[]): boolean {
    // Signal is relevant if it involves an asset affected by any current events
    for (const event of events) {
      if (this.assetMapper.isEventRelevantToAsset(signal.asset, event.eventName)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get events relevant to a specific signal
   */
  getRelevantEvents(signal: TradeSignal, events: EconomicEvent[]): EconomicEvent[] {
    return events.filter(event =>
      this.assetMapper.isEventRelevantToAsset(signal.asset, event.eventName)
    );
  }

  /**
   * Score signal relevance based on event impact and confidence
   * Returns score from 0-100
   */
  scoreSignalRelevance(signal: TradeSignal, relevantEvents: EconomicEvent[]): number {
    if (relevantEvents.length === 0) {
      return this.getConfidenceScore(signal.confidence);
    }

    // Calculate average event impact
    const impactWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    const totalImpact = relevantEvents.reduce((sum, event) => {
      const weight = impactWeights[event.impact as keyof typeof impactWeights] || 1;
      return sum + weight;
    }, 0);

    const averageEventImpact = (totalImpact / relevantEvents.length) / 3; // Normalize to 0-1

    // Combine signal confidence with event impact
    const confidenceScore = this.getConfidenceScore(signal.confidence) / 100;
    const combinedScore = (confidenceScore * 0.6 + averageEventImpact * 0.4) * 100;

    return Math.round(combinedScore);
  }

  /**
   * Get numeric confidence score
   */
  private getConfidenceScore(confidence: string): number {
    const scores = {
      'VERY_HIGH': 90,
      'HIGH': 75,
      'MEDIUM': 50,
      'LOW': 25
    };
    return scores[confidence as keyof typeof scores] || 50;
  }

  /**
   * Get all processed signals
   */
  getProcessedSignals(): TradeSignal[] {
    return [...this.processedSignals];
  }

  /**
   * Get all processed events
   */
  getProcessedEvents(): EconomicEvent[] {
    return [...this.processedEvents];
  }

  /**
   * Clear processing history
   */
  clearHistory(): void {
    this.processedSignals = [];
    this.processedEvents = [];
  }

  /**
   * Get processor statistics
   */
  getStatistics(): {
    totalSignalsProcessed: number;
    totalEventsProcessed: number;
    uniqueAssets: number;
    uniqueEvents: number;
  } {
    const uniqueAssets = new Set(this.processedSignals.map(s => s.asset)).size;
    const uniqueEvents = new Set(this.processedEvents.map(e => e.eventName)).size;

    return {
      totalSignalsProcessed: this.processedSignals.length,
      totalEventsProcessed: this.processedEvents.length,
      uniqueAssets,
      uniqueEvents
    };
  }
}
