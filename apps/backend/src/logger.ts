/**
 * @file logger.ts
 * @description Logging utility for backend operations
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Simple logger utility with configurable log levels
 */
export class Logger {
  private level: LogLevel;

  /**
   * Initialize logger with log level
   * @param level - Minimum log level to display (default: INFO)
   */
  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  /**
   * Log debug message (lowest priority)
   * @param message - Message to log
   * @param data - Additional data
   */
  debug(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(`[${new Date().toISOString()}] [DEBUG] ${message}`, data || "");
    }
  }

  /**
   * Log info message
   * @param message - Message to log
   * @param data - Additional data
   */
  info(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(`[${new Date().toISOString()}] [INFO] ${message}`, data || "");
    }
  }

  /**
   * Log warning message
   * @param message - Message to log
   * @param data - Additional data
   */
  warn(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, data || "");
    }
  }

  /**
   * Log error message (highest priority)
   * @param message - Message to log
   * @param error - Error object or additional data
   */
  error(message: string, error?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(
        `[${new Date().toISOString()}] [ERROR] ${message}`,
        error || ""
      );
    }
  }

  /**
   * Check if message should be logged based on level
   * @param messageLevel - Level of message being logged
   * @returns true if should log
   *
   * @internal
   */
  private shouldLog(messageLevel: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
    };

    return levels[messageLevel] >= levels[this.level];
  }
}

export const logger = new Logger(
  (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO
);
