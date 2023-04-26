class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getTimestamp(): string {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  public info(message: string | object): void {
    console.info(`[${this.getTimestamp()}] [INFO] ${message}`);
  }

  public error(message: string | object): void {
    console.error(`[${this.getTimestamp()}] [ERROR] ${message}`);
  }

  public debug(message: string | object): void {
    console.debug(`[${this.getTimestamp()}] [DEBUG] ${message}`);
  }

  public warn(message: string | object): void {
    console.warn(`[${this.getTimestamp()}] [WARN] ${message}`);
  }
}

const logger = Logger.getInstance();

export default logger;
