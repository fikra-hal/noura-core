/**
 * Noura Core - Structured Logger
 * 
 * This module provides a structured logging utility with consistent formatting,
 * log levels, and contextual information. It ensures all Noura-related 
 * applications maintain consistent logging patterns.
 * 
 * @author Noura Khalil <nk@fikra.ventures>
 */

/**
 * Log levels in order of severity
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Log level priorities for filtering
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

/**
 * Interface for log entry structure
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  identity?: {
    name: string;
    email: string;
  };
  source?: string;
}

/**
 * Logger configuration options
 */
interface LoggerConfig {
  level: LogLevel;
  format: 'json' | 'pretty';
  includeStackTrace: boolean;
  includeIdentity: boolean;
  source?: string;
}

/**
 * Structured Logger class
 * 
 * Provides consistent, structured logging with contextual information
 * and configurable output formats.
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: this.parseLogLevel(process.env.LOG_LEVEL) || LogLevel.INFO,
      format: process.env.LOG_FORMAT === 'json' ? 'json' : 'pretty',
      includeStackTrace: process.env.NODE_ENV === 'development',
      includeIdentity: true,
      source: 'noura-core',
      ...config,
    };
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, unknown>, source?: string): Logger {
    const childLogger = new Logger({
      ...this.config,
      source: source || this.config.source,
    });

    // Override the log method to include the child context
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (level: LogLevel, message: string, logContext?: Record<string, unknown>) => {
      const mergedContext = { ...context, ...logContext };
      originalLog(level, message, mergedContext);
    };

    return childLogger;
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Core logging method
   */
  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    // Filter by log level
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.config.level]) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      source: this.config.source,
    };

    // Add context if provided
    if (context && Object.keys(context).length > 0) {
      logEntry.context = context;
    }

    // Add identity information if enabled
    if (this.config.includeIdentity) {
      try {
        // Lazy load settings to avoid circular dependencies
        const { settings } = require('../config/settings');
        logEntry.identity = {
          name: settings.identity.fullName,
          email: settings.identity.email,
        };
      } catch (error) {
        // Settings not available yet, skip identity
      }
    }

    // Output the log entry
    this.output(logEntry);
  }

  /**
   * Output log entry to console
   */
  private output(entry: LogEntry): void {
    if (this.config.format === 'json') {
      console.log(JSON.stringify(entry));
    } else {
      this.outputPretty(entry);
    }
  }

  /**
   * Output pretty-formatted log entry
   */
  private outputPretty(entry: LogEntry): void {
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const source = entry.source ? `[${entry.source}]` : '';
    const identity = entry.identity ? `[${entry.identity.name}]` : '';
    
    let output = `${timestamp} ${level} ${source}${identity} ${entry.message}`;

    if (entry.context && Object.keys(entry.context).length > 0) {
      output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
    }

    // Use appropriate console method based on log level
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
      default:
        console.log(output);
    }
  }

  /**
   * Parse log level from string
   */
  private parseLogLevel(level?: string): LogLevel | undefined {
    if (!level) return undefined;
    
    const normalized = level.toLowerCase() as LogLevel;
    return Object.values(LogLevel).includes(normalized) ? normalized : undefined;
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a new logger instance with custom configuration
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config);
}

/**
 * Export types for external use
 */
export type { LogEntry, LoggerConfig };
