# SMC-ICT Trade Signal Adapter App

A comprehensive TypeScript-based adapter system for Smart Money Concepts (SMC) and Institutional Market Structure (ICT) trade signals with economic event integration.

## 📋 Overview

This application provides a robust framework for:
- Converting trade signals from multiple sources (SMC, ICT, custom adapters) into a standardized format
- Integrating economic events and their impact on trading assets
- Processing and scoring signal relevance based on market conditions
- Mapping asset-to-event relationships for informed trading decisions

## 🎯 Key Features

### Phase 1: Core Foundation ✅
- **Generic Adapter Pattern**: Extensible interface for converting raw data to standardized formats
- **Trade Signal Processing**: Convert and validate trade signals with confidence levels
- **Economic Event Integration**: Process economic indicators and their asset impacts
- **Asset-to-Event Mapping**: Hardcoded mapping of 15+ assets to 30+ economic events
- **Signal Orchestration**: Main processor for coordinating signal and event processing
- **Comprehensive Testing**: 90+ unit tests covering all components

### Phase 2: Signal Aggregation (Coming Soon)
- Multi-source signal aggregation
- Confluence analysis
- Signal weighting and scoring

### Phase 3: Economic Event Integration (Coming Soon)
- Real-time event fetching
- Impact prediction
- Alert system

### Phase 4: Advanced Features (Coming Soon)
- Machine learning integration
- Pattern recognition
- Backtesting framework

### Phase 5: Deployment & Monitoring (Coming Soon)
- Docker containerization
- Kubernetes orchestration
- Monitoring and logging
- API documentation

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/usmantukurbaba/SMC-ICT-Trade-Signal-Adapter-App.git
cd SMC-ICT-Trade-Signal-Adapter-App
npm install
```

### Build

```bash
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 💡 Usage Examples

### Basic Signal Processing

```typescript
import { SignalProcessor, SignalType, TradeDirection, ConfidenceLevel } from './dist';

const processor = new SignalProcessor();

// Process a trade signal
const rawSignal = {
  asset: 'EURUSD',
  signalType: 'BREAKOUT',
  direction: 'LONG',
  entryPrice: 1.0850,
  stopLoss: 1.0800,
  takeProfit: [1.0900, 1.0950],
  confidence: 'HIGH',
  source: 'SMC',
  description: 'Daily breakout signal on EURUSD'
};

const signal = processor.processTradeSignal(rawSignal);
console.log('Processed Signal:', signal);
```

### Economic Event Processing

```typescript
const rawEvent = {
  eventName: 'NFP',
  country: 'US',
  impact: 'HIGH',
  forecast: 200000,
  previous: 185000,
  description: 'Non-Farm Payroll Report',
  affectedAssets: ['EURUSD', 'GBPUSD', 'USDJPY']
};

const event = processor.processEconomicEvent(rawEvent);
console.log('Processed Event:', event);
```

### Signal Relevance Analysis

```typescript
// Check if signal is relevant to current events
const isRelevant = processor.isSignalRelevant(signal, [event]);

// Get events relevant to the signal
const relevantEvents = processor.getRelevantEvents(signal, [event]);

// Score signal relevance (0-100)
const relevanceScore = processor.scoreSignalRelevance(signal, relevantEvents);
console.log(`Signal Relevance Score: ${relevanceScore}`);
```

### Asset-Event Mapping

```typescript
import { AssetEventMapper } from './dist';

const mapper = new AssetEventMapper();

// Get events affecting an asset
const eventsForEURUSD = mapper.getEventsForAsset('EURUSD');

// Get assets affected by an event
const assetsAffectedByNFP = mapper.getAssetsForEvent('NFP');

// Check relevance
const isRelevant = mapper.isEventRelevantToAsset('EURUSD', 'NFP');
```

## 📊 Supported Assets

### Equities
- SPY, QQQ, IWM

### Forex Pairs
- EURUSD, GBPUSD, USDJPY, NZDUSD, AUDUSD

### Commodities
- XAUUSD (Gold), XAGUSD (Silver), CRUDE_OIL, NATURAL_GAS

### Cryptocurrencies
- BTC, ETH

## 📅 Supported Economic Events

### US Events
- NFP (Non-Farm Payroll)
- CPI / PPI
- FOMC / FED_RATE
- Unemployment Rate
- Retail Sales
- Housing Starts
- ISM PMI
- Durable Goods
- GDP
- Consumer Sentiment

### EU/UK Events
- ECB_RATE / BOE_RATE
- EU_CPI / UK_CPI
- EU_PMI / UK_PMI

### Other
- Central Bank Decisions
- Earnings Reports
- Custom Economic Data

## 🏗️ Architecture

```
src/
├── interfaces/
│   ├── adapter.ts              # Generic adapter contract
│   ├── tradeSignal.ts          # Trade signal interface
│   └── economicEvent.ts        # Economic event interface
├── adapters/
│   ├── tradeSignalAdapter.ts   # Signal conversion
│   └── economicEventAdapter.ts # Event conversion
├── mappers/
│   └── assetEventMapper.ts     # Asset-to-event mapping
├── processors/
│   └── signalProcessor.ts      # Main orchestrator
└── index.ts                    # Public exports

tests/
├── adapters/
├── mappers/
└── processors/
```

## 📈 Test Coverage

- **Total Tests**: 90+
- **Coverage Target**: 70%+
- **Unit Tests**: Comprehensive coverage for all components
- **Integration Tests**: Signal-event interaction flows

## 🔧 Development

### Lint Code
```bash
npm run lint
```

### Build & Watch
```bash
npm run dev
```

### Clean Build
```bash
npm run clean && npm run build
```

## 📝 Project Structure

- **Phase 1**: ✅ Core adapter foundation with interfaces, adapters, mappers, and processors
- **Phase 2**: Signal aggregation from multiple sources
- **Phase 3**: Economic event integration with real-time data
- **Phase 4**: Advanced features (ML, backtesting)
- **Phase 5**: Production deployment and monitoring

## 🤝 Contributing

Contributions are welcome! Please ensure:
- All tests pass (`npm test`)
- Code is linted (`npm run lint`)
- New features include unit tests
- TypeScript types are properly defined

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Usman Tukur Baba**
- GitHub: [@usmantukurbaba](https://github.com/usmantukurbaba)
- Email: usmantukurbaba@gmail.com

## 🙏 Acknowledgments

- Smart Money Concepts (SMC) trading methodology
- Institutional Market Structure (ICT) framework
- TypeScript and Node.js communities

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Status**: Phase 1 Complete ✅ | Phase 2 In Development 🚀
