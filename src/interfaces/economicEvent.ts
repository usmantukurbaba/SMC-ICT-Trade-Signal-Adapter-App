/**
 * Economic Event Interface - Represents economic indicators and events
 * that impact trading assets
 */
export interface EconomicEvent {
  id: string;
  timestamp: Date;
  eventName: EventType;
  country: string;
  impact: ImpactLevel;
  forecast?: number;
  previous?: number;
  actual?: number;
  releaseTime?: Date;
  description: string;
  affectedAssets: string[];
  metadata?: Record<string, unknown>;
}

export enum EventType {
  // US Events
  NFP = 'NFP', // Non-Farm Payroll
  CPI = 'CPI', // Consumer Price Index
  PPI = 'PPI', // Producer Price Index
  FOMC = 'FOMC', // Federal Open Market Committee
  FED_RATE = 'FED_RATE',
  UNEMPLOYMENT = 'UNEMPLOYMENT',
  RETAIL_SALES = 'RETAIL_SALES',
  HOUSING_STARTS = 'HOUSING_STARTS',
  ISM_PMI = 'ISM_PMI',
  INITIAL_JOBLESS = 'INITIAL_JOBLESS',
  DURABLE_GOODS = 'DURABLE_GOODS',
  GDP = 'GDP',
  CONSUMER_SENTIMENT = 'CONSUMER_SENTIMENT',
  
  // EU Events
  ECB_RATE = 'ECB_RATE',
  EU_CPI = 'EU_CPI',
  EU_PMI = 'EU_PMI',
  
  // UK Events
  BOE_RATE = 'BOE_RATE',
  UK_CPI = 'UK_CPI',
  UK_PMI = 'UK_PMI',
  
  // Other
  CENTRAL_BANK_DECISION = 'CENTRAL_BANK_DECISION',
  EARNINGS_REPORT = 'EARNINGS_REPORT',
  ECONOMIC_DATA = 'ECONOMIC_DATA'
}

export enum ImpactLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}
