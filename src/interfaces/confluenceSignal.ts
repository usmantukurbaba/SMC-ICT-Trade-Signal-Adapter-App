import { TradeSignal, ConfidenceLevel } from '../interfaces/tradeSignal';

/**
 * Confluence Signal - Represents multiple signals aligned on the same asset
 * Increases confidence when multiple independent signals agree
 */
export interface ConfluenceSignal {
  asset: string;
  timestamp: Date;
  confluenceCount: number;
  sources: string[];
  combinedConfidence: ConfidenceLevel;
  signals: TradeSignal[];
  convergenceScore: number; // 0-100
  averageEntryPrice: number;
  entryPriceRange: { min: number; max: number };
  commonStopLoss?: number;
  commonTakeProfits: number[];
  description: string;
}

/**
 * Signal Aggregation Result - Statistics about aggregation
 */
export interface AggregationResult {
  totalSignalsProcessed: number;
  confluenceSignalsGenerated: number;
  averageConfluenceCount: number;
  highestConfluenceScore: number;
  aggregatedAssets: string[];
}
