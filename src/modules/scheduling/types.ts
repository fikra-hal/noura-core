/**
 * Noura Core - Scheduling Types
 * 
 * This module defines all types and interfaces used by the scheduling system,
 * including meeting requests, time windows, proposals, and attendee information.
 * 
 * @author Noura Khalil <nk@fikra.ventures>
 */

/**
 * Meeting attendee information
 */
export interface Attendee {
  /** Attendee's email address (required) */
  email: string;
  /** Attendee's display name (optional) */
  name?: string;
  /** Whether this attendee is required for the meeting */
  required?: boolean;
}

/**
 * Time window representing a meeting slot
 */
export interface TimeWindow {
  /** Start time in ISO 8601 format */
  startISO: string;
  /** End time in ISO 8601 format */
  endISO: string;
}

/**
 * Meeting request parameters
 */
export interface MeetingRequest {
  /** Meeting subject/title */
  subject: string;
  /** List of attendees for the meeting */
  attendees: Attendee[];
  /** Meeting duration in minutes (optional, uses policy default if not specified) */
  durationMinutes?: number;
  /** Earliest acceptable meeting time in ISO 8601 format (optional) */
  earliestISO?: string;
  /** Latest acceptable meeting time in ISO 8601 format (optional) */
  latestISO?: string;
  /** Additional scheduling constraints (optional) */
  constraints?: Record<string, unknown>;
}

/**
 * Meeting slot proposal with scoring
 */
export interface Proposal {
  /** Proposed time slot for the meeting */
  slot: TimeWindow;
  /** Score indicating how well this slot fits the constraints (0-100) */
  score: number;
  /** Human-readable reason for this proposal (optional) */
  reason?: string;
}

/**
 * Result of a successful booking operation
 */
export interface BookingResult {
  /** Unique identifier for the created event */
  eventId: string;
}

/**
 * Scheduling engine interface
 */
export interface SchedulingEngine {
  /** Propose meeting slots for a given request */
  propose(request: MeetingRequest): Promise<Proposal[]>;
  /** Book a specific slot for a meeting */
  book(request: MeetingRequest, slot: TimeWindow): Promise<BookingResult>;
}
