/**
 * snap.ts
 */
import * as express from "express";
import {Options} from "../service/options";
import {Log} from "../util/logger";
import {getErrorMessage} from "../util/error";
import {Snappy} from "../service/snappy";

/**
 * TODO
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export const snap = async (req: express.Request, res: express.Response) => {
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
    Snappy.snap({
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
    });
}