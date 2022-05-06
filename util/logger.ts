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
    timestamp: { format: 'YYYY-MM-DD HH:mm:ss' },
    format: winston.format.cli(),
    colorize: true,
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
        winston.format.cli()
    ),
    statusLevels: false, // default value
    level: function (req: any, res: any) {
        var level = "";
        if (res.statusCode >= 100) { level = "info"; }
        if (res.statusCode >= 400) { level = "warn"; }
        if (res.statusCode >= 500) { level = "error"; }
        // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
        if (res.statusCode == 401 || res.statusCode == 403) { level = "critical"; }
        // No one should be using the old path, so always warn for those
        if (req.path === "/v1" && level === "info") { level = "warn"; }
        return level;
    },
    meta: true, // Optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // Optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
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
};
