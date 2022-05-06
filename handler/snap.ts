/**
 * snap.ts
 */
import * as express from "express";
import {Log} from "../util/logger";
import {Snappy} from "../service/snappy"
import {Options} from "../service/options";
import {getErrorMessage} from "../util/error";

/**
 * TODO
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export const snap = async (req: express.Request, res: express.Response) => {
    const opts = <Options>{
        url: req.query.url,
        size: req.query.size,
        ignoreCache: req.query.ignoreCache,
        delay: req.query.delay,
        crop: req.query.crop,
        script: req.query.script,
        cookies: req.query.cookies,
        selector: req.query.selector,
        hide: req.query.hide,
        scale: req.query.scale,
        userAgent: req.query.userAgent,
        headers: req.query.headers,
        transparent: req.query.transparent,
        darkMode: req.query.darkMode,
    };

    console.log(opts);

    res.json(opts).end();
    return;

    Snappy.snap(opts).then(data => {
        const image = Buffer.from(data, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': image.length,
        });
        res.end(image);
    }).catch(err => {
        Log.error(getErrorMessage(err));
    });
}