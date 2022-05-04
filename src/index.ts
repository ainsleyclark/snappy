import * as express from 'express';
import { createClient } from 'redis';

const app = express(),
    logger = require("./log/logger");

app.get('/', async (req: express.Request, res: express.Response) => {


    const opts = <Options>{
        url: req.query.url,
        delay: req.query.delay,
        timeout: req.query.timeout,
        crop: req.query.crop,
        hide: req.query.hide,
        // TODO - More?
    }

    // const client = createClient({
    //     username: process.env.username,
    //     database: process.env.database,
    //     socket: {
    //         port: 6379,
    //         host: "127.0.0.1",
    //     }
    // });
    // client.on('error', (err) => console.log('Redis Client Error', err));
    //
    // await client.connect();
    //
    // await client.set('key', 'value');
    // const value = await client.get('key');

   //console.log(value);

    res.json(opts)

    // Get the query parameters into options
    // Check if the URL exists, if it doesn't return error
    // Check if the image is in cache
    //      -> Read from cache convert base64 and return
    // Run screenshot generator
    //      -> Save in tmp dir
    //      -> Read file
    // Cache new file
    // Return image
})

// Capture 404 errors
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).send("Page not found");
    logger.error(`400 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
});


// app.listen(3000, () => {
//     console.log('The application is listening on port 3000!');
// })

export interface Options {
    /**
     *
     */
    url: string
    /**
     * Delay capturing the screenshot.
     * Useful when the site does things after load that you want to capture.
     * @default 0
     */
    delay?: number;
    /**
     * Number of seconds after which the request is aborted.
     * @default 60
     */
    timeout?: number;
    /**
     * Crop to the set height.
     * @default false
     */
    crop?: boolean;
    /**
     * Apply custom CSS to the webpage. Specify some CSS or the path to a CSS file.
     */
    css?: string;
    /**
     * Apply custom JavaScript to the webpage. Specify some JavaScript or the path to a file.
     */
    script?: string;
    /**
     * A string with the same format as a [browser cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) or [an object](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetcookiecookies).
     * Tip: Go to the website you want a cookie for and [copy-paste it from DevTools](https://stackoverflow.com/a/24961735/64949).
     * @default []
     */
    cookies?: ReadonlyArray<string | Record<string, string>>;
    /**
     * Capture a specific DOM element matching a CSS selector.
     */
    selector?: string;
    /**
     * Hide an array of DOM elements matching CSS selectors.
     * @default []
     */
    readonly hide?: readonly string[];
    /**
     * Scale webpage `n` times.
     * @default 1
     */
    readonly scale?: number;
    /**
     * Custom user agent.
     */
    readonly userAgent?: string;
    /**
     * Custom HTTP request headers.
     * @default {}
     */
    readonly headers?: Record<string, string>;
    /**
     * Set background color to `transparent` instead of `white` if no background is set.
     * @default false
     */
    readonly transparent?: boolean;
    /**
     * Emulate preference of dark color scheme.
     * @default false
     */
    readonly darkMode?: boolean;
}