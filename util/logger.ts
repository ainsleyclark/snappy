/**
 * logger.ts
 * Logger is responsible for instantiating the Application and
 * HTTP logs. If the application is not in production, debug
 * level will be used.
 */
import {Logger as WinstonLogger} from 'winston';
import {Environment} from "./env";

const winston = require('winston'),
    expressWinston = require('express-winston');

/**
 * Default Options for both the HTTP Log and standard Logger.
 * @type {{colorize: boolean, level: string, format: Format, timestamp: {format: string}}}
 */
const defaultOptions = {
	level: 'info',
	transports: [
		new winston.transports.Console(),
	],
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.cli()
	),
	timestamp: {
		format: 'YYYY-MM-DD HH:mm:ss'
	},
	colorize: true,
};

/**
 * Standard app logger.
 * @type {winston.Logger}
 */
const Log = <WinstonLogger>winston.createLogger(defaultOptions);

/**
 * Options for the HTTP Log.
 * @type {{statusLevels: boolean, msg: string, transports: winston.ConsoleTransportInstance[], colorize: boolean, level: (req: any, res: any) => string, expressFormat: boolean, meta: boolean, format: Format, ignoreRoute: (req: any, res: any) => boolean, timestamp: {format: string}}}
 */
const httpOptions = {
	...defaultOptions,
	statusLevels: false, // Default value
	level: function (req: any, res: any) {
		let level = '';
		if (res.statusCode >= 100) {
			level = 'info';
		}
		if (res.statusCode >= 400) {
			level = 'warn';
		}
		if (res.statusCode >= 500) {
			level = 'error';
		}
		return level;
	},
	meta: true,
	msg: 'HTTP {{req.method}} {{req.url}}',
	expressFormat: true,
};

/**
 * Request HTTP Log.
 * @type {e.Handler}
 */
const HTTPLog = expressWinston.logger(httpOptions);

/**
 * If we're not in production then log to the `console` with the format:
 * ${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (!Environment.isProduction()) {
    Log.level = 'debug';
}

export {
    Log,
    HTTPLog
};
