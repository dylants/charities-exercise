import pino, { LoggerOptions } from 'pino';

const options: LoggerOptions = {
  // "silent" to disable logging
  level: process.env.ENABLE_LOGGING ? 'trace' : 'silent',
};

const logger = pino(options);

export default logger;
