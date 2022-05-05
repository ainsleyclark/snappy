/**
 * index.ts
 * TODO
 */
import * as express from 'express';
import {Options} from "./service/options";
import {Snappy} from "./service/snappy";

const app = express(),
    logger = require('./util/logger'),
	env = require('./util/env');

const snappy = new Snappy();

/**
 *
 */
app.get('/', async (req: express.Request, res: express.Response) => {
    const opts = <Options>{
        url: req.query.url,
        delay: req.query.delay,
        timeout: req.query.timeout,
        crop: req.query.crop,
        hide: req.query.hide,
        // TODO - More?
    };

    const data = await snappy.snap({
        url: opts.url,
        sizes: ['1920x1080'],
        crop: true,
    });

    if (!data) {
        return;
    }

    const image = Buffer.from(data, 'base64');
    res.writeHead(200, {
		'Content-Type': 'image/png',
		'Content-Length': image.length,
	});
	res.end(image);
});

/**
 * Prevent GET /favicon.ico.
 */
app.get('/favicon.ico', (req: express.Request, res: express.Response) => res.status(204));

/**
 * 404 Handler.
 * TODO: Log handler
 */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).send("Page not found");
    logger.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
});

/**
 * Wait for Snappy to load and start the server on the port
 * specified in the env file.
 */
snappy.ready
    .then(() => {
        const port = env.appPort || 3000;
        app.listen(port, () => {
            logger.info(`Snappy is listening on port ${port}`);
        });
    })
    .catch(err => {
       logger.crit(err);
    });
