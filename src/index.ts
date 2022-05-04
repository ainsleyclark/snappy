import * as express from 'express';

const Pageres = require('pageres'),
    app = express();

(async () => {
    await new Pageres({delay: 2})
        .src('https://reddico.co.uk', ['480x320', '1024x768', 'iphone 5s'], {crop: true})
        .dest(__dirname)
        .run();

    console.log('Finished generating screenshots!');
})();


app.get('/', (req: express.Request, res: express.Response) => {
    res.send('This is a test web page!');
})


app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})

export interface Options {
    /**
     Delay capturing the screenshot.
     Useful when the site does things after load that you want to capture.
     @default 0
     */
    delay?: number;

    /**
     Number of seconds after which the request is aborted.
     @default 60
     */
    timeout?: number;

    /**
     Crop to the set height.
     @default false
     */
    crop?: boolean;

    /**
     A string with the same format as a [browser cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) or [an object](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagesetcookiecookies).
     Tip: Go to the website you want a cookie for and [copy-paste it from DevTools](https://stackoverflow.com/a/24961735/64949).
     @default []
     */
    readonly cookies?: ReadonlyArray<string | Record<string, string>>;

    /**
     Capture a specific DOM element matching a CSS selector.
     */
    readonly selector?: string;

    /**
     Hide an array of DOM elements matching CSS selectors.
     @default []
     */
    readonly hide?: readonly string[];

    /**
     Scale webpage `n` times.
     @default 1
     */
    readonly scale?: number;

    /**
     Custom user agent.
     */
    readonly userAgent?: string;

    /**
     Custom HTTP request headers.
     @default {}
     */
    readonly headers?: Record<string, string>;

    /**
     Set background color to `transparent` instead of `white` if no background is set.
     @default false
     */
    readonly transparent?: boolean;

    /**
     Emulate preference of dark color scheme.
     @default false
     */
    readonly darkMode?: boolean;
}