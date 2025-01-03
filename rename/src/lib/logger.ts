import winston, { createLogger, format, transports } from 'winston'

const customFormat = format.printf(({ level, message, meta }) => {
  return `${level.toUpperCase()}: ${message} ${meta ? JSON.stringify(meta) : ''}`
})

const { combine, simple, json, splat, errors } = winston.format

const logger = createLogger({
  level: 'info',
  exitOnError: false,
  defaultMeta: {
    service: 'backend',
  },
  format: combine(
    // colorize({ all: true }),
    splat(), // to support multiple arguments
    simple(), // to include simple message formatting
    process.env.SIMPLE_LOGGER ? customFormat : json(),
    errors({ stack: process.env.SIMPLE_LOGGER !== 'true' })
  ),
  transports: [new transports.Console()],
})

export default logger
