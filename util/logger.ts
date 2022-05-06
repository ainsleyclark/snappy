/**
 * logger.ts
 */
import {Logger as WinstonLogger} from "winston";

const winston = require('winston'),
    expressWinston = require('express-winston');

/**
 * Logger TODO
 * @type {winston.Logger}
 */
const Log = <WinstonLogger>winston.createLogger({
    level: 'info',
    format: winston.format.cli(),
});

/**
 * HTTPLog TODO
 * @type {e.Handler}
 */
const HTTPLog = expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    meta: true, // Optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // Optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req: any, res: any) {
        return false;
    } // Optional: allows to skip some log messages based on request and/or response
});

/**
 * If we're not in production then log to the `console` with the format:
 * ${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (process.env.NODE_ENV !== 'production') {
    Log.level = 'debug';
    Log.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export {
    Log,
    HTTPLog
}
