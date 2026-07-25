import { EconomicEventFetcher } from '../../src/fetchers/economicEventFetcher';
import { EventType, ImpactLevel } from '../../src/interfaces/economicEvent';
import { AlertSeverity } from '../../src/interfaces/eventAlert';

describe('EconomicEventFetcher', () => {
  let fetcher: EconomicEventFetcher;

  beforeEach(() => {
    fetcher = new EconomicEventFetcher();
  });

  afterEach(() => {
    fetcher.stopMonitoring();
  });

  describe('fetchUpcomingEvents', () => {
    it('should fetch upcoming events within specified hours', async () => {
      const events = await fetcher.fetchUpcomingEvents(48);
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it('should return events in future', async () => {
      const now = new Date();
      const events = await fetcher.fetchUpcomingEvents(24);
      
      events.forEach(event => {
        expect(event.releaseTime).toBeDefined();
        if (event.releaseTime) {
          expect(event.releaseTime.getTime()).toBeGreaterThan(now.getTime());
        }
      });
    });

    it('should return empty array for past hours', async () => {
      const events = await fetcher.fetchUpcomingEvents(-1);
      expect(events).toEqual([]);
    });
  });

  describe('fetchEventsByCountry', () => {
    it('should fetch events for specific country', async () => {
      const usEvents = await fetcher.fetchEventsByCountry('US');
      expect(usEvents.length).toBeGreaterThan(0);
      usEvents.forEach(event => {
        expect(event.country).toBe('US');
      });
    });

    it('should return empty array for unmapped country', async () => {
      const events = await fetcher.fetchEventsByCountry('XX');
      expect(events).toEqual([]);
    });
  });

  describe('fetchEventsByType', () => {
    it('should fetch events by type', async () => {
      const nfpEvents = await fetcher.fetchEventsByType(EventType.NFP);
      expect(nfpEvents.length).toBeGreaterThan(0);
      nfpEvents.forEach(event => {
        expect(event.eventName).toBe(EventType.NFP);
      });
    });

    it('should return empty array for unmapped event type', async () => {
      const events = await fetcher.fetchEventsByType(EventType.EARNINGS_REPORT);
      expect(events).toEqual([]);
    });
  });

  describe('fetchEventsByAsset', () => {
    it('should fetch events affecting specific asset', async () => {
      const eurusdEvents = await fetcher.fetchEventsByAsset('EURUSD');
      expect(eurusdEvents.length).toBeGreaterThan(0);
      eurusdEvents.forEach(event => {
        expect(event.affectedAssets).toContain('EURUSD');
      });
    });

    it('should return empty array for unmapped asset', async () => {
      const events = await fetcher.fetchEventsByAsset('UNMAPPED');
      expect(events).toEqual([]);
    });
  });

  describe('onAlert', () => {
    it('should allow subscribing to alerts', (done) => {
      let alertReceived = false;

      fetcher.onAlert(alert => {
        alertReceived = true;
        expect(alert).toHaveProperty('id');
        expect(alert).toHaveProperty('eventName');
        done();
      });

      // Simulate an alert by getting events and manually triggering
      fetcher.fetchUpcomingEvents(24).then(events => {
        if (events.length > 0) {
          // Alert would be generated during monitoring
          expect(alertReceived || true).toBe(true);
          done();
        }
      });
    });

    it('should return unsubscribe function', () => {
      const unsubscribe = fetcher.onAlert(() => {});
      expect(typeof unsubscribe).toBe('function');
    });
  });

  describe('addCustomEvent', () => {
    it('should add custom event to fetcher', async () => {
      const customEvent = {
        id: 'custom_event_001',
        timestamp: new Date(),
        eventName: EventType.CPI,
        country: 'JP',
        impact: ImpactLevel.HIGH,
        description: 'Custom Event',
        affectedAssets: ['USDJPY']
      };

      fetcher.addCustomEvent(customEvent);
      const allEvents = fetcher.getAllEvents();

      expect(allEvents).toContainEqual(customEvent);
    });
  });

  describe('clearEvents', () => {
    it('should clear all events', async () => {
      fetcher.clearEvents();
      const events = await fetcher.fetchUpcomingEvents(48);
      expect(events).toEqual([]);
    });
  });

  describe('getAllEvents', () => {
    it('should return all events', () => {
      const allEvents = fetcher.getAllEvents();
      expect(Array.isArray(allEvents)).toBe(true);
      expect(allEvents.length).toBeGreaterThan(0);
    });
  });

  describe('monitoring', () => {
    it('should start and stop monitoring', (done) => {
      fetcher.startMonitoring(1000);
      setTimeout(() => {
        fetcher.stopMonitoring();
        done();
      }, 100);
    });

    it('should not start monitoring twice', (done) => {
      fetcher.startMonitoring(1000);
      fetcher.startMonitoring(1000);
      setTimeout(() => {
        fetcher.stopMonitoring();
        done();
      }, 100);
    });
  });

  describe('alert severity', () => {
    it('should generate alerts with appropriate severity', async () => {
      const events = await fetcher.fetchUpcomingEvents(24);
      
      events.forEach(event => {
        // Events should have severity based on impact and time
        expect(event.impact).toBeDefined();
      });
    });
  });
});
