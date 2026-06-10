type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatMessage(entry: LogEntry): string {
    const context = entry.context ? `[${entry.context}]` : '';
    const data = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    return `${entry.timestamp} ${entry.level.toUpperCase()} ${context} ${entry.message}${data}`;
  }

  private log(level: LogLevel, message: string, context?: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      data,
    };

    // Store in memory for debugging
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const formatted = this.formatMessage(entry);
      switch (level) {
        case 'debug':
          console.debug(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'error':
          console.error(formatted);
          break;
      }
    }

    // In production, send errors to monitoring service (optional)
    if (level === 'error' && !this.isDevelopment) {
      // TODO: Integrate with Sentry, LogRocket, or similar service
      // this.sendToMonitoring(entry);
    }
  }

  debug(message: string, context?: string, data?: unknown) {
    this.log('debug', message, context, data);
  }

  info(message: string, context?: string, data?: unknown) {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: unknown) {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, data?: unknown) {
    this.log('error', message, context, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
