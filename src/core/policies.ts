/**
 * Noura Core - Policies Configuration
 * 
 * This module defines default policies for various system behaviors,
 * including scheduling constraints, approval workflows, and operational limits.
 * 
 * @author Noura Khalil <nk@fikra.ventures>
 */

import { NOURA_IDENTITY } from '../config/settings';

/**
 * Scheduling policy configuration
 */
export interface SchedulingPolicy {
  /** Business hours range in 24-hour format */
  businessHours: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
    timezone: string;
  };
  /** Minimum buffer time between meetings in minutes */
  minBufferMinutes: number;
  /** Maximum number of meetings allowed per day */
  maxMeetingsPerDay: number;
  /** Default meeting duration in minutes */
  defaultDurationMinutes: number;
  /** Auto-approve meetings from trusted contacts */
  autoApproveTrustedContacts: boolean;
}

/**
 * Default scheduling policies
 */
const schedulingPolicy: SchedulingPolicy = {
  businessHours: {
    start: '10:00',
    end: '18:00',
    timezone: NOURA_IDENTITY.DEFAULT_TIMEZONE,
  },
  minBufferMinutes: 15,
  maxMeetingsPerDay: 3,
  defaultDurationMinutes: 45,
  autoApproveTrustedContacts: true,
};

/**
 * Core policies configuration
 */
export const Policies = {
  /**
   * Scheduling-related policies
   */
  scheduling: schedulingPolicy,
} as const;

/**
 * Type definitions for external use
 */
export type { SchedulingPolicy as SchedulingPolicyType };
