/**
 *
 */
import * as express from "express";

const joi = require('joi');

/**
 * TODO
 */
export class Options {
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
	ignoreCache: boolean;

	/**
	 * TODO
	 */
	rebuildCache: boolean;

    /**
     * Delay capturing the screenshot.
     * Useful when the site does things after load that you want to capture.
     * @default 0
     */
    delay: number;

    /**
     * Crop to the set height.
     * @default false
     */
    crop: boolean;

    /**
     * Apply custom CSS to the webpage. Specify some CSS or the path to a CSS file.
     */
    css: string;

    /**
     * Apply custom JavaScript to the webpage. Specify some JavaScript or the path to a file.
     */
    script: string;

    /**
     * Capture a specific DOM element matching a CSS selector.
     */
    selector: string;

    /**
     * Hide an array of DOM elements matching CSS selectors.
     * @default []
     */
    hide: string[];

    /**
     * Scale webpage `n` times.
     * @default 1
     */
    scale: number;

    /**
     * Custom user agent.
     */
    userAgent: string;

    /**
     * Set background color to `transparent` instead of `white` if no background is set.
     * @default false
     */
    transparent: boolean;

    /**
     * Emulate preference of dark color scheme.
     * @default false
     */
    darkMode: boolean;

    /**
     * Default arguments for the Options.
     * @type {any}
     * @private
     */
    private readonly defaults: any = {
        size: '1920x1080',
        ignoreCache: false,
        rebuildCache: false,
        delay: 1,
        crop: false,
        scale: 1,
        transparent: false,
        darkMode: false,
    };

    /**
     * From Request parses a raq URL query to the options, parsing
     * defaults.
     * @param {e.Request} request
     */
    public fromRequest(request: express.Request): Options {
        const query = request.query;

        this.url = query.url ? <string>query.url : '';
        this.size = query.size ? <string>query.size : this.defaults.size;
        this.ignoreCache = query.ignoreCache ? (query.ignoreCache === 'true') : this.defaults.ignoreCache;
        this.rebuildCache = query.rebuildCache ? (query.rebuildCache === 'true') : this.defaults.rebuildCache;
        this.delay = !isNaN(Number(query.delay)) ? parseInt(<string>query.delay) : this.defaults.delay;
        this.crop = query.crop ? (query.crop === 'true') : this.defaults.crop;
        this.css = query.css ? <string>query.css : '';
        this.script = query.script ? <string>query.script : '';
        this.selector = query.selector ? <string>query.selector : '';
        this.hide = query.hide ? (<string>query.hide).split(',') : [];
        this.scale = !isNaN(Number(query.scale)) ? parseInt(<string>query.scale) : this.defaults.scale;
        this.userAgent = <string>query.userAgent;
        this.transparent = query.transparent ? (query.transparent === 'true') : this.defaults.transparent;
        this.darkMode = query.darkMode ? (query.darkMode === 'true') : this.defaults.darkMode;

        return this;
    }



    /**
     * Validates the Options instance and throws an error
     * if validation failed.
     */
    public validate() {
        const schema = joi
            .object()
            .keys({
                url: joi.string().uri({allowRelative: false}).required(),
            });

        const {error} = schema
            .prefs({ errors: { label: "key" } })
            .validate({ url: this.url });

        if (error) {
            throw (error);
        }
    }
}
