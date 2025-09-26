/**
 * Noura Core - Scheduling Module Tests
 * 
 * Basic sanity tests for the scheduling system to ensure proper initialization,
 * engine switching, and basic functionality without throwing errors.
 * 
 * @author Noura Khalil <nk@fikra.ventures>
 */

import { proposeSlots, confirmSlot } from '../src/modules/scheduling/SchedulingService';
import type { MeetingRequest, TimeWindow } from '../src/modules/scheduling/types';

// Mock console to avoid noise during tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const originalConsoleInfo = console.info;
const originalConsoleDebug = console.debug;

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
  console.info = originalConsoleInfo;
  console.debug = originalConsoleDebug;
});

describe('SchedulingService', () => {
  const dummyRequest: MeetingRequest = {
    subject: 'Test Meeting',
    attendees: [
      { email: 'test@example.com', name: 'Test User', required: true },
      { email: 'another@example.com', name: 'Another User' },
    ],
    durationMinutes: 30,
    earliestISO: '2024-01-15T10:00:00.000Z',
    latestISO: '2024-01-15T18:00:00.000Z',
  };

  const dummySlot: TimeWindow = {
    startISO: '2024-01-15T14:00:00.000Z',
    endISO: '2024-01-15T14:30:00.000Z',
  };

  describe('Basic Functionality', () => {
    it('should import SchedulingService without throwing', () => {
      expect(() => {
        require('../src/modules/scheduling/SchedulingService');
      }).not.toThrow();
    });

    it('should run proposeSlots on a dummy request without throwing', async () => {
      await expect(proposeSlots(dummyRequest)).resolves.not.toThrow();
      const result = await proposeSlots(dummyRequest);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should run confirmSlot on a dummy request without throwing', async () => {
      await expect(confirmSlot(dummyRequest, dummySlot)).resolves.not.toThrow();
      const result = await confirmSlot(dummyRequest, dummySlot);
      expect(result).toHaveProperty('eventId');
      expect(typeof result.eventId).toBe('string');
    });
  });

  describe('Engine Switching', () => {
    const originalEnv = process.env.ENABLE_SIDEKICK;

    afterEach(() => {
      // Restore original environment
      if (originalEnv !== undefined) {
        process.env.ENABLE_SIDEKICK = originalEnv;
      } else {
        delete process.env.ENABLE_SIDEKICK;
      }
      
      // Clear require cache to force re-initialization
      delete require.cache[require.resolve('../src/modules/scheduling/SchedulingService')];
      delete require.cache[require.resolve('../src/modules/scheduling/engines/googleCalendarEngine')];
      delete require.cache[require.resolve('../src/modules/scheduling/engines/sidekickEngine')];
    });

    it('should use Google Calendar engine by default', async () => {
      delete process.env.ENABLE_SIDEKICK;
      
      // Re-import to get fresh instance
      const { proposeSlots: freshProposeSlots } = require('../src/modules/scheduling/SchedulingService');
      
      const result = await freshProposeSlots(dummyRequest);
      expect(Array.isArray(result)).toBe(true);
      // Google Calendar engine returns empty array by default (stub implementation)
      expect(result).toEqual([]);
    });

    it('should switch to Sidekick engine when ENABLE_SIDEKICK=true', async () => {
      process.env.ENABLE_SIDEKICK = 'true';
      
      // Re-import to get fresh instance with new environment
      const { proposeSlots: freshProposeSlots } = require('../src/modules/scheduling/SchedulingService');
      
      const result = await freshProposeSlots(dummyRequest);
      expect(Array.isArray(result)).toBe(true);
      // Sidekick engine also returns empty array by default (stub implementation)
      expect(result).toEqual([]);
    });

    it('should not switch to Sidekick when ENABLE_SIDEKICK=false', async () => {
      process.env.ENABLE_SIDEKICK = 'false';
      
      // Re-import to get fresh instance
      const { proposeSlots: freshProposeSlots } = require('../src/modules/scheduling/SchedulingService');
      
      const result = await freshProposeSlots(dummyRequest);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([]);
    });
  });

  describe('Request Validation', () => {
    it('should throw error for missing subject', async () => {
      const invalidRequest = { ...dummyRequest, subject: '' };
      await expect(proposeSlots(invalidRequest)).rejects.toThrow('Meeting subject is required');
    });

    it('should throw error for missing attendees', async () => {
      const invalidRequest = { ...dummyRequest, attendees: [] };
      await expect(proposeSlots(invalidRequest)).rejects.toThrow('At least one attendee is required');
    });

    it('should throw error for invalid email', async () => {
      const invalidRequest = {
        ...dummyRequest,
        attendees: [{ email: 'invalid-email', name: 'Invalid User' }],
      };
      await expect(proposeSlots(invalidRequest)).rejects.toThrow('Invalid email address');
    });

    it('should throw error for invalid duration', async () => {
      const invalidRequest = { ...dummyRequest, durationMinutes: -30 };
      await expect(proposeSlots(invalidRequest)).rejects.toThrow('Meeting duration must be positive');
    });

    it('should throw error for invalid time range', async () => {
      const invalidRequest = {
        ...dummyRequest,
        earliestISO: '2024-01-15T18:00:00.000Z',
        latestISO: '2024-01-15T10:00:00.000Z',
      };
      await expect(proposeSlots(invalidRequest)).rejects.toThrow('Earliest time must be before latest time');
    });
  });

  describe('Slot Validation', () => {
    it('should throw error for invalid time slot format', async () => {
      const invalidSlot = { startISO: 'invalid-date', endISO: '2024-01-15T14:30:00.000Z' };
      await expect(confirmSlot(dummyRequest, invalidSlot)).rejects.toThrow('Invalid time slot format');
    });

    it('should throw error for invalid time slot order', async () => {
      const invalidSlot = {
        startISO: '2024-01-15T14:30:00.000Z',
        endISO: '2024-01-15T14:00:00.000Z',
      };
      await expect(confirmSlot(dummyRequest, invalidSlot)).rejects.toThrow('Meeting start time must be before end time');
    });
  });
});
