/**
 * snap.ts
 */
import * as express from "express";
import {Log} from "../util/logger";
import {Snappy} from "../service/snappy";
import {Options} from "../service/options";
import {getErrorMessage} from "../util/error";
import {ValidationError} from "joi";

/**
 * Snap handler endpoint.
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export const snap = async (req: express.Request, res: express.Response) => {
    const opts = new Options().fromRequest(req);

    try {
        opts.validate();
    } catch (err) {
        if (err instanceof ValidationError) {
            Log.error(err.message);
            res.json({error: true, message: err.message, data: err}).end();
        }
        return;
    }

    Snappy.snap(opts).then(data => {
        const image = Buffer.from(data, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': image.length,
        });
        res.end(image);
    }).catch(err => {
        const msg = getErrorMessage(err);
        Log.error(msg);
        res.json({error: true, message: msg, data: err}).end();
    });
};