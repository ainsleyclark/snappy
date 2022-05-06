/**
 * index.ts
 * TODO
 */
import * as express from 'express';
import {Log, HTTPLog} from "./util/logger"
import {Environment} from "./util/env";
import {Options} from "./service/options";
import {Snappy} from "./service/snappy";
import expressWinston from "express-winston";
import winston from "winston";
import {getErrorMessage} from "./util/error";

const app = express();

const snappy = new Snappy();

/**
 *
 */
app.get('/', async (req: express.Request, res: express.Response) => {

    // This is an object, we can loop.
    const opts = <Options>{
        url: req.query.url,
        delay: req.query.delay,
        crop: req.query.crop,
        hide: req.query.hide,
        script: req.query.script,
        // TODO - More?
    };

    // TODO
    snappy.snap({
        url: opts.url,
        sizes: ['1920x1080'],
        crop: true,
    }).then(data => {
        const image = Buffer.from(data, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': image.length,
        });
        res.end(image);
    }).catch(err => {
        Log.error(getErrorMessage(err));
    })

});

/**
 * Prevent GET /favicon.ico.
 */
app.get('/favicon.ico', (req: express.Request, res: express.Response) => res.status(204));


// app.use(expressWinston.logger({
//     transports: [
//         new winston.transports.Console()
//     ],
//     format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.json()
//     ),
//     meta: true, // optional: control whether you want to log the meta data about the request (default to true)
//     msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
//     expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
//     colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
//     ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
// }));

/**
 * 404 Handler.
 * TODO: Log handler
 */
// app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     res.status(404).send("Page not found");
//     Log.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
// });

/**
 * Wait for Snappy to load and start the server on the port
 * specified in the env file.
 */
snappy.ready
    .then(() => {
        const port = Environment.appPort || 3000;
        app.listen(port, () => {
            Log.info(`Snappy is listening on port ${port}`);
        });
    })
    .catch(err => {
       Log.crit(err);
    });
