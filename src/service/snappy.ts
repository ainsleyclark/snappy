import * as path from 'path';
import {createClient} from "redis";
import {Options} from "./options";
import {Screenshot} from "pageres";

const fs = require("fs"),
    os = require('os'),
    logger = require('./../util/logger'),
    env = require('./../util/env'),
    pageres = require('pageres'),
    mime = require('mime');

// Get the query parameters into options
// Check if the URL exists, if it doesn't return error
// Check if the image is in cache
//      -> Read from cache convert base64 and return
// Run screenshot generator
//      -> Save in tmp dir
//      -> Read file
// Cache new file
// Return image


type RedisClientType = ReturnType<typeof createClient>;
type RedisClientOptions = Parameters<typeof createClient>[0];

export class Snappy {
    /**
     *
     * @type {RedisClientType}
     */
    client: RedisClientType

    /**
     *
     */
    constructor() {
        this.loadRedis();
    }

    /**
     *
     * @param {Options} opts
     */
    public snap(opts: Options) {
        const pOptions = {
            delay: opts.delay,
            timeout: opts.timeout,
            crop: opts.crop,
            css: opts.css,
            script: opts.css,
            cookies: opts.cookies,
            filename: Buffer.from(Math.random().toString()).toString("base64").substr(10, 24),
            select: opts.selector,
        }

        const dir = os.tmpdir(),
            test = new pageres({delay: 1})
            .src(opts.url, opts.sizes, pOptions)
            .dest(dir)
            .run();

        test.then((res: Screenshot[]) => {
            const filePath = path.join(dir, res[0].filename);

            const mimeType = mime.getType(filePath);
            const buf = this.fileread(filePath);
            const b64 = buf.toString('base64');
        })
        .catch((err: any) => {
            // TODO Log
            console.log(err)
        });
    }

    /**
     *
     * @param {string} filename
     * @returns {Buffer}
     * @private
     */
    private fileread(filename: string) {
        return fs.readFileSync(filename);
    }

    /**
     *
     * @private
     */
    private storeImage() {

    }

    /**
     *
     * @private
     */
    private getImage() {

    }

    /**
     * Loads the redis cache driver for storing images within
     * the Redis datalayer.
     * TODO: Errors
     * @returns {Promise<void>}
     * @private
     */
    private async loadRedis() {
        const client = createClient({
            username: env.redisUsername,
            database: env.redisDB,
            socket: {
                port: env.redisPort,
                host: env.redisHost,
            }
        });

        client.on('error', (err) =>{
            throw new Error('Redis Client Error', err)
        });

        await client.connect();

        this.client = client;
    }
}