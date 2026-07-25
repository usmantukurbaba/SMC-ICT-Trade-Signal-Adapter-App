/**
 * Main entry point for SMC-ICT Trade Signal Adapter App
 * Exports all public interfaces and classes for use in external applications
 */

// Interfaces
export { TradeSignal, SignalType, TradeDirection, ConfidenceLevel, SignalSource } from './interfaces/tradeSignal';
export { EconomicEvent, EventType, ImpactLevel } from './interfaces/economicEvent';
export { IAdapter } from './interfaces/adapter';
export { ConfluenceSignal, AggregationResult } from './interfaces/confluenceSignal';

// Adapters
export { TradeSignalAdapter } from './adapters/tradeSignalAdapter';
export { EconomicEventAdapter } from './adapters/economicEventAdapter';

// Mappers
export { AssetEventMapper } from './mappers/assetEventMapper';

// Processors
export { SignalProcessor } from './processors/signalProcessor';

// Aggregators
export { SignalAggregator } from './aggregators/signalAggregator';

// Phase 3 Exports
export { EconomicEventFetcher } from './fetchers/economicEventFetcher';
export { EventAlert, AlertSeverity } from './interfaces/eventAlert';

// Phase 4 Exports
export { SignalPatternAnalyzer } from './analyzers/signalPatternAnalyzer';
export { PatternType, PatternMatch } from './interfaces/patternAnalysis';
