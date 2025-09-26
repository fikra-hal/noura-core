/**
 * Noura Core - Application Setup
 * 
 * This module contains the main application class responsible for initializing
 * and managing the core application lifecycle. It provides a clean interface
 * for starting up, running, and shutting down the application.
 * 
 * @author Noura Khalil <nk@fikra.ventures>
 */

import { logger } from './core/logger';
import { settings } from './config/settings';

/**
 * Main Application class
 * 
 * Handles the core application lifecycle including initialization,
 * health checks, and graceful shutdown procedures.
 */
class Application {
  private isInitialized = false;
  private isShuttingDown = false;

  /**
   * Initialize the application
   * Sets up core services and validates configuration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.warn('Application is already initialized');
      return;
    }

    logger.info('Initializing Noura Core application');

    try {
      // Validate configuration
      await this.validateConfiguration();

      // Initialize core services
      await this.initializeServices();

      // Run health checks
      await this.performHealthChecks();

      this.isInitialized = true;
      logger.info('Application initialization completed successfully');
    } catch (error) {
      logger.error('Application initialization failed', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  /**
   * Gracefully shutdown the application
   * Cleans up resources and closes connections
   */
  async shutdown(): Promise<void> {
    if (this.isShuttingDown) {
      logger.warn('Application is already shutting down');
      return;
    }

    this.isShuttingDown = true;
    logger.info('Starting application shutdown');

    try {
      // Cleanup services in reverse order
      await this.cleanupServices();

      this.isInitialized = false;
      logger.info('Application shutdown completed successfully');
    } catch (error) {
      logger.error('Error during application shutdown', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    } finally {
      this.isShuttingDown = false;
    }
  }

  /**
   * Get application health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    identity: typeof settings.identity;
    environment: string;
    uptime: number;
  } {
    return {
      status: this.isInitialized && !this.isShuttingDown ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      identity: settings.identity,
      environment: settings.nodeEnv,
      uptime: process.uptime(),
    };
  }

  /**
   * Check if the application is ready to serve requests
   */
  isReady(): boolean {
    return this.isInitialized && !this.isShuttingDown;
  }

  /**
   * Validate application configuration
   */
  private async validateConfiguration(): Promise<void> {
    logger.debug('Validating application configuration');

    // Validate identity constants
    if (!settings.identity.fullName || !settings.identity.email) {
      throw new Error('Identity configuration is incomplete');
    }

    // Validate Slack configuration if enabled
    if (settings.slack.displayName && !settings.slack.memberId) {
      throw new Error('Slack configuration is incomplete');
    }

    logger.debug('Configuration validation completed', {
      identity: {
        name: settings.identity.fullName,
        email: settings.identity.email,
      },
      environment: settings.nodeEnv,
    });
  }

  /**
   * Initialize core services
   */
  private async initializeServices(): Promise<void> {
    logger.debug('Initializing core services');

    // Future service initialization will go here
    // Examples:
    // - Database connections
    // - External API clients
    // - Background job processors
    // - Cache connections

    logger.debug('Core services initialized successfully');
  }

  /**
   * Perform application health checks
   */
  private async performHealthChecks(): Promise<void> {
    logger.debug('Performing health checks');

    // Future health checks will go here
    // Examples:
    // - Database connectivity
    // - External service availability
    // - File system permissions
    // - Memory usage

    logger.debug('Health checks completed successfully');
  }

  /**
   * Clean up services and resources
   */
  private async cleanupServices(): Promise<void> {
    logger.debug('Cleaning up services and resources');

    // Future cleanup logic will go here
    // Examples:
    // - Close database connections
    // - Stop background jobs
    // - Clear caches
    // - Release file handles

    logger.debug('Service cleanup completed successfully');
  }
}

// Export singleton instance
export const app = new Application();
