import { IAdapter } from '../interfaces/adapter';
import { TradeSignal, SignalType, TradeDirection, ConfidenceLevel, SignalSource } from '../interfaces/tradeSignal';

/**
 * Generic Trade Signal Adapter - Converts raw signal data to standardized format
 * Implements the generic adapter pattern for extensibility
 */
export class TradeSignalAdapter implements IAdapter<TradeSignal> {
  private adapterId: string;

  constructor(adapterId: string = 'default-signal-adapter') {
    this.adapterId = adapterId;
  }

  /**
   * Convert raw signal data to standardized TradeSignal format
   */
  convert(rawData: unknown): TradeSignal {
    if (!this.validate(rawData)) {
      throw new Error(`Invalid signal data for adapter: ${this.adapterId}`);
    }

    const data = rawData as Record<string, unknown>;

    return {
      id: String(data.id || this.generateId()),
      timestamp: new Date(data.timestamp as string || Date.now()),
      asset: String(data.asset || ''),
      signalType: this.parseSignalType(data.signalType),
      direction: this.parseDirection(data.direction),
      entryPrice: Number(data.entryPrice || 0),
      stopLoss: data.stopLoss ? Number(data.stopLoss) : undefined,
      takeProfit: data.takeProfit ? this.parseTakeProfits(data.takeProfit) : undefined,
      confidence: this.parseConfidence(data.confidence),
      source: this.parseSource(data.source),
      description: String(data.description || ''),
      metadata: data.metadata as Record<string, unknown> | undefined
    };
  }

  /**
   * Validate raw signal data has minimum required fields
   */
  validate(rawData: unknown): boolean {
    if (!rawData || typeof rawData !== 'object') {
      return false;
    }

    const data = rawData as Record<string, unknown>;
    const requiredFields = ['asset', 'signalType', 'direction', 'entryPrice', 'confidence'];

    return requiredFields.every(field => field in data && data[field] !== null && data[field] !== undefined);
  }

  getAdapterId(): string {
    return this.adapterId;
  }

  private parseSignalType(value: unknown): SignalType {
    const typeStr = String(value).toUpperCase();
    return Object.values(SignalType).includes(typeStr as SignalType)
      ? (typeStr as SignalType)
      : SignalType.CONFLUENCE;
  }

  private parseDirection(value: unknown): TradeDirection {
    const dirStr = String(value).toUpperCase();
    return dirStr === 'SHORT' ? TradeDirection.SHORT : TradeDirection.LONG;
  }

  private parseConfidence(value: unknown): ConfidenceLevel {
    const confStr = String(value).toUpperCase();
    return Object.values(ConfidenceLevel).includes(confStr as ConfidenceLevel)
      ? (confStr as ConfidenceLevel)
      : ConfidenceLevel.MEDIUM;
  }

  private parseSource(value: unknown): SignalSource {
    const sourceStr = String(value).toUpperCase();
    return Object.values(SignalSource).includes(sourceStr as SignalSource)
      ? (sourceStr as SignalSource)
      : SignalSource.CUSTOM;
  }

  private parseTakeProfits(value: unknown): number[] {
    if (Array.isArray(value)) {
      return value.map(v => Number(v));
    }
    return [Number(value)];
  }

  private generateId(): string {
    return `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
