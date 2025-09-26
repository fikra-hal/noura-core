/**
 * Noura Core - Configuration Settings
 * 
 * This module manages all configuration settings for Noura's core identity,
 * environment variables, and application settings. It provides type-safe
 * configuration loading with validation and default values.
 * 
 * @author Noura Khalil <nk@fikra.ventures>
 */

import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables
config();

/**
 * Identity configuration schema
 */
const IdentityConfigSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  defaultTimezone: z.string().min(1, 'Default timezone is required'),
});

/**
 * Slack configuration schema
 */
const SlackConfigSchema = z.object({
  displayName: z.string().optional(),
  memberId: z.string().optional(),
});

/**
 * Application configuration schema
 */
const ApplicationConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  port: z.coerce.number().min(1).max(65535).default(3000),
});

/**
 * Complete settings schema
 */
const SettingsSchema = z.object({
  identity: IdentityConfigSchema,
  slack: SlackConfigSchema,
  application: ApplicationConfigSchema,
});

/**
 * Settings type derived from schema
 */
export type Settings = z.infer<typeof SettingsSchema> & {
  // Add convenience properties
  nodeEnv: 'development' | 'production' | 'test';
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
};

/**
 * Noura's Identity Constants
 * These are the core identity markers that remain consistent
 * across all applications and integrations.
 */
export const NOURA_IDENTITY = {
  FULL_NAME: 'Noura Khalil',
  EMAIL: 'nk@fikra.ventures',
  DEFAULT_TIMEZONE: 'Asia/Dubai',
  SLACK_DISPLAY_NAME: '@Noura Khalil',
  SLACK_MEMBER_ID: 'U09DB024QS2',
} as const;

/**
 * Load and validate configuration from environment variables
 */
function loadConfiguration(): Settings {
  try {
    // Raw configuration from environment with defaults
    const rawConfig = {
      identity: {
        fullName: process.env.NOURA_FULL_NAME || NOURA_IDENTITY.FULL_NAME,
        email: process.env.NOURA_EMAIL || NOURA_IDENTITY.EMAIL,
        defaultTimezone: process.env.DEFAULT_TIMEZONE || NOURA_IDENTITY.DEFAULT_TIMEZONE,
      },
      slack: {
        displayName: process.env.SLACK_DISPLAY_NAME || NOURA_IDENTITY.SLACK_DISPLAY_NAME,
        memberId: process.env.SLACK_MEMBER_ID || NOURA_IDENTITY.SLACK_MEMBER_ID,
      },
      application: {
        nodeEnv: process.env.NODE_ENV || 'development',
        logLevel: process.env.LOG_LEVEL || 'info',
        port: process.env.PORT || '3000',
      },
    };

    // Validate configuration
    const validatedConfig = SettingsSchema.parse(rawConfig);

    // Add convenience properties
    const nodeEnv = validatedConfig.application.nodeEnv;
    const enhancedConfig: Settings = {
      ...validatedConfig,
      nodeEnv,
      isProduction: nodeEnv === 'production',
      isDevelopment: nodeEnv === 'development',
      isTest: nodeEnv === 'test',
    };

    return enhancedConfig;
  } catch (error) {
    console.error('Configuration validation failed:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation errors:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    
    throw new Error('Invalid configuration - please check your environment variables');
  }
}

/**
 * Exported settings instance
 */
export const settings = loadConfiguration();

/**
 * Configuration utilities
 */
export const configUtils = {
  /**
   * Get a configuration value with type safety
   */
  get: <T extends keyof Settings>(key: T): Settings[T] => settings[key],

  /**
   * Check if running in production
   */
  isProduction: () => settings.isProduction,

  /**
   * Check if running in development
   */
  isDevelopment: () => settings.isDevelopment,

  /**
   * Check if running in test mode
   */
  isTest: () => settings.isTest,

  /**
   * Get identity information
   */
  getIdentity: () => settings.identity,

  /**
   * Get Slack configuration
   */
  getSlackConfig: () => settings.slack,

  /**
   * Validate that all required environment variables are set
   */
  validateEnvironment: (): boolean => {
    const requiredVars = [
      'NOURA_FULL_NAME',
      'NOURA_EMAIL',
      'DEFAULT_TIMEZONE',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error('Missing required environment variables:');
      missingVars.forEach(varName => {
        console.error(`  - ${varName}`);
      });
      return false;
    }

    return true;
  },

  /**
   * Get environment-specific configuration
   */
  getEnvironmentConfig: () => ({
    nodeEnv: settings.nodeEnv,
    isProduction: settings.isProduction,
    isDevelopment: settings.isDevelopment,
    isTest: settings.isTest,
    logLevel: settings.application.logLevel,
    port: settings.application.port,
  }),

  /**
   * Create a configuration snapshot for logging/debugging
   */
  createSnapshot: () => ({
    timestamp: new Date().toISOString(),
    environment: settings.nodeEnv,
    identity: {
      name: settings.identity.fullName,
      email: settings.identity.email,
      timezone: settings.identity.defaultTimezone,
    },
    slack: {
      hasDisplayName: Boolean(settings.slack.displayName),
      hasMemberId: Boolean(settings.slack.memberId),
    },
    application: settings.application,
  }),
};

/**
 * Export types for external use
 */
export type {
  Settings as NouraSettings,
  IdentityConfigSchema as IdentityConfig,
  SlackConfigSchema as SlackConfig,
  ApplicationConfigSchema as ApplicationConfig,
};

/**
 * Export schemas for validation in other modules
 */
export {
  IdentityConfigSchema,
  SlackConfigSchema,
  ApplicationConfigSchema,
  SettingsSchema,
};
