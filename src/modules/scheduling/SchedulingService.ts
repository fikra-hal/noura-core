/**
 * Noura Core - Scheduling Service
 * 
 * This module provides the main scheduling service interface that delegates
 * to different scheduling engines based on configuration. It handles engine
 * selection, request validation, and provides a unified API for meeting scheduling.
 * 
 * @author Noura Khalil <nk@fikra.ventures>
 */

import type { MeetingRequest, Proposal, TimeWindow, BookingResult, SchedulingEngine } from './types';
import { GoogleCalendarEngine } from './engines/googleCalendarEngine';
import { SidekickEngine } from './engines/sidekickEngine';
import { logger } from '../../core/logger';
import { Policies } from '../../core/policies';

/**
 * Main scheduling service that coordinates between different scheduling engines
 */
class SchedulingService {
  private readonly logger = logger.child({ source: 'SchedulingService' });
  private engine: SchedulingEngine;

  constructor() {
    this.engine = this.createEngine();
    this.logger.info('Scheduling service initialized', {
      engineType: this.getEngineType(),
      policies: {
        businessHours: Policies.scheduling.businessHours,
        maxMeetingsPerDay: Policies.scheduling.maxMeetingsPerDay,
        defaultDuration: Policies.scheduling.defaultDurationMinutes,
      },
    });
  }

  /**
   * Propose meeting slots for a given request
   * 
   * @param request Meeting request with attendees and constraints
   * @returns Array of proposed meeting slots with scores
   */
  async proposeSlots(request: MeetingRequest): Promise<Proposal[]> {
    this.logger.debug('Proposing meeting slots', {
      subject: request.subject,
      attendeeCount: request.attendees.length,
      engine: this.getEngineType(),
    });

    try {
      // Validate the request
      this.validateMeetingRequest(request);

      // Apply default duration if not specified
      const enhancedRequest = this.enhanceRequest(request);

      // Delegate to the selected engine
      const proposals = await this.engine.propose(enhancedRequest);

      this.logger.debug('Generated meeting proposals', {
        proposalCount: proposals.length,
        engine: this.getEngineType(),
      });

      return proposals;
    } catch (error) {
      this.logger.error('Failed to propose meeting slots', { error });
      throw error;
    }
  }

  /**
   * Confirm and book a specific meeting slot
   * 
   * @param request Original meeting request
   * @param chosenSlot Selected time slot to book
   * @returns Booking result with event ID
   */
  async confirmSlot(request: MeetingRequest, chosenSlot: TimeWindow): Promise<BookingResult> {
    this.logger.debug('Confirming meeting slot', {
      subject: request.subject,
      slot: chosenSlot,
      engine: this.getEngineType(),
    });

    try {
      // Validate the request and slot
      this.validateMeetingRequest(request);
      this.validateTimeWindow(chosenSlot);

      // Apply default duration if not specified
      const enhancedRequest = this.enhanceRequest(request);

      // Delegate to the selected engine
      const result = await this.engine.book(enhancedRequest, chosenSlot);

      this.logger.info('Meeting successfully booked', {
        eventId: result.eventId,
        subject: request.subject,
        slot: chosenSlot,
        engine: this.getEngineType(),
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to confirm meeting slot', { error });
      throw error;
    }
  }

  /**
   * Create the appropriate scheduling engine based on configuration
   */
  private createEngine(): SchedulingEngine {
    const useSidekick = process.env['ENABLE_SIDEKICK'] === 'true';
    
    if (useSidekick) {
      this.logger.info('Using Sidekick scheduling engine');
      return new SidekickEngine();
    } else {
      this.logger.info('Using Google Calendar scheduling engine');
      return new GoogleCalendarEngine();
    }
  }

  /**
   * Get the current engine type for logging
   */
  private getEngineType(): string {
    return this.engine.constructor.name;
  }

  /**
   * Validate meeting request parameters
   */
  private validateMeetingRequest(request: MeetingRequest): void {
    if (!request.subject || request.subject.trim().length === 0) {
      throw new Error('Meeting subject is required');
    }

    if (!request.attendees || request.attendees.length === 0) {
      throw new Error('At least one attendee is required');
    }

    for (const attendee of request.attendees) {
      if (!attendee.email || !attendee.email.includes('@')) {
        throw new Error(`Invalid email address for attendee: ${attendee.email}`);
      }
    }

    if (request.durationMinutes && request.durationMinutes <= 0) {
      throw new Error('Meeting duration must be positive');
    }

    if (request.earliestISO && request.latestISO) {
      const earliest = new Date(request.earliestISO);
      const latest = new Date(request.latestISO);
      
      if (earliest >= latest) {
        throw new Error('Earliest time must be before latest time');
      }
    }
  }

  /**
   * Validate time window parameters
   */
  private validateTimeWindow(slot: TimeWindow): void {
    const start = new Date(slot.startISO);
    const end = new Date(slot.endISO);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid time slot format');
    }

    if (start >= end) {
      throw new Error('Meeting start time must be before end time');
    }
  }

  /**
   * Enhance request with default values from policies
   */
  private enhanceRequest(request: MeetingRequest): MeetingRequest {
    return {
      ...request,
      durationMinutes: request.durationMinutes || Policies.scheduling.defaultDurationMinutes,
    };
  }
}

/**
 * Singleton scheduling service instance
 */
const schedulingService = new SchedulingService();

/**
 * Propose meeting slots for a given request
 * 
 * @param request Meeting request with attendees and constraints
 * @returns Array of proposed meeting slots with scores
 */
export const proposeSlots = (request: MeetingRequest): Promise<Proposal[]> => {
  return schedulingService.proposeSlots(request);
};

/**
 * Confirm and book a specific meeting slot
 * 
 * @param request Original meeting request
 * @param chosenSlot Selected time slot to book
 * @returns Booking result with event ID
 */
export const confirmSlot = (request: MeetingRequest, chosenSlot: TimeWindow): Promise<BookingResult> => {
  return schedulingService.confirmSlot(request, chosenSlot);
};

/**
 * Export the scheduling service for advanced usage
 */
export { SchedulingService };

/**
 * Export types for external use
 */
export type { MeetingRequest, Proposal, TimeWindow, BookingResult } from './types';
