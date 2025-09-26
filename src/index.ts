#!/usr/bin/env node

/**
 * Noura Core - Main Entry Point
 * 
 * This module serves as the primary entry point for the Noura Core library.
 * It initializes the application, loads configuration, and exports the core
 * functionality for use by other applications.
 * 
 * @author Noura Khalil <nk@fikra.ventures>
 */

import { app } from './app';
import { logger } from './core/logger';
import { settings } from './config/settings';

/**
 * Main application startup function
 * Handles initialization and graceful error handling
 */
async function main(): Promise<void> {
  try {
    logger.info('Starting Noura Core application', {
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      environment: settings.nodeEnv,
      timezone: settings.identity.defaultTimezone,
    });

    // Initialize the application
    await app.initialize();

    logger.info('Noura Core application started successfully', {
      identity: {
        name: settings.identity.fullName,
        email: settings.identity.email,
      },
    });
  } catch (error) {
    logger.error('Failed to start Noura Core application', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    process.exit(1);
  }
}

/**
 * Graceful shutdown handling
 */
function setupGracefulShutdown(): void {
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`);
    
    app.shutdown()
      .then(() => {
        logger.info('Application shut down successfully');
        process.exit(0);
      })
      .catch((error) => {
        logger.error('Error during shutdown', {
          error: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
      });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

// Export core functionality for library usage
export { logger } from './core/logger';
export { settings } from './config/settings';
export { app } from './app';

// Export types and constants
export * from './config/settings';

// Run the application if this file is executed directly
if (require.main === module) {
  setupGracefulShutdown();
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
