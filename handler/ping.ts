/**
 * ping.ts
 */
import * as express from "express";

/**
 * Ping endpoint for health checks.
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<void>}
 */
export const ping = async (req: express.Request, res: express.Response) => {
    res.status(200).send('PONG').end();
};