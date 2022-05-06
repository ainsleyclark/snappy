/**
 * TODO
 */
export interface Options {
    /**
     * TODO
     */
    url: string;
    /**
     * TODO
     */
    size: string;
	/**
	 * TODO
	 */
	ignoreCache?: boolean;
	/**
	 * TODO
	 */
	rebuildCache?: boolean;
    /**
     * Delay capturing the screenshot.
     * Useful when the site does things after load that you want to capture.
     * @default 0
     */
    delay?: number;
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
