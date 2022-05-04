import * as express from 'express';
import {Options} from "./service/options";
import {Snappy} from "./service/snappy";

const app = express(),
    logger = require('./util/logger'),
    env = require('./util/env');

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
    res.json(opts);
});

/**
 *
 */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).send("Page not found");
    logger.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
});

const snappy = new Snappy();

snappy.snap({
    url: "https://reddico.co.uk",
    sizes: ['1920x1080'],
    crop: true,
});


/**
 *
//  */
// app.listen(env.appPort, () => {
//     console.log('The application is listening on port 3000!');
// });