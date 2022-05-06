/**
 * index.ts
 * TODO
 */
import * as express from 'express';
import {Log, HTTPLog} from "./util/logger";
import {Environment} from "./util/env";
import {Snappy} from "./service/snappy";
import {ping} from "./handler/ping";
import {snap} from "./handler/snap";
import {getErrorMessage} from "./util/error";

const app = express(),
    emoji = require('node-emoji'),
    welcome = require('cli-welcome');

/**
 * VERSION is the current version number of Snappy.
 * @type {string}
 */
const VERSION = '1.0';

app.use(HTTPLog);

/**
 *
 */
app.get('/snap', snap);
app.get('/ping', ping);

/**
 * Prevent GET /favicon.ico.
 */
app.get('/favicon.ico', (req: express.Request, res: express.Response) => res.status(204));

/**
 * Print Welcome Message.
 */
welcome({
    title: `${emoji.get('camera_with_flash')} Snappy`,
    tagLine: `by Ainsley Clark`,
    bgColor: `#F15A29`,
    color: `#000000`,
    bold: true,
    clear: true,
    version: `1.0`
});

/**
 * Wait for Snappy to load and start the server on the port
 * specified in the env file.
 */
Snappy.ready
    .then(() => {
        const port = Environment.appPort || 3000;
        app.listen(port, () => {
            Log.info(`${emoji.get('camera_with_flash')} Snappy is listening on port ${port}`);
        });
    })
    .catch(err => {
		Log.error(getErrorMessage(err));
    });
