/**
 *
 */
import {Logger} from "winston";

const winston = require('winston');

/**
 * Logger TODO
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.cli(),
});

/**
 * If we're not in production then log to the `console` with the format:
 * ${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (process.env.NODE_ENV !== 'production') {
    logger.level = 'debug';
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

module.exports = <Logger>logger;
