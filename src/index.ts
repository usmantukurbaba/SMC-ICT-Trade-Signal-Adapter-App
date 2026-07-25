/**
 * Main entry point for SMC-ICT Trade Signal Adapter App
 * Exports all public interfaces and classes for use in external applications
 */

// Interfaces
export { TradeSignal, SignalType, TradeDirection, ConfidenceLevel, SignalSource } from './interfaces/tradeSignal';
export { EconomicEvent, EventType, ImpactLevel } from './interfaces/economicEvent';
export { IAdapter } from './interfaces/adapter';

// Adapters
export { TradeSignalAdapter } from './adapters/tradeSignalAdapter';
export { EconomicEventAdapter } from './adapters/economicEventAdapter';

// Mappers
export { AssetEventMapper } from './mappers/assetEventMapper';

// Processors
export { SignalProcessor } from './processors/signalProcessor';
