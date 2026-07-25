/**
 * Trade Signal Interface - Represents a standardized trading signal
 * from any source (SMC, ICT, or custom adapters)
 */
export interface TradeSignal {
  id: string;
  timestamp: Date;
  asset: string;
  signalType: SignalType;
  direction: TradeDirection;
  entryPrice: number;
  stopLoss?: number;
  takeProfit?: number[];
  confidence: ConfidenceLevel;
  source: SignalSource;
  description: string;
  metadata?: Record<string, unknown>;
}

export enum SignalType {
  BREAKOUT = 'BREAKOUT',
  REVERSAL = 'REVERSAL',
  CONTINUATION = 'CONTINUATION',
  DIVERGENCE = 'DIVERGENCE',
  CONFLUENCE = 'CONFLUENCE'
}

export enum TradeDirection {
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export enum ConfidenceLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export enum SignalSource {
  SMC = 'SMC',
  ICT = 'ICT',
  COMBINED = 'COMBINED',
  CUSTOM = 'CUSTOM'
}
