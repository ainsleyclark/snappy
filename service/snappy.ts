import * as path from 'path';
import {createClient} from "redis";
import {Options} from "./options";
import {Screenshot} from "pageres";

const fs = require("fs"),
    os = require('os'),
    logger = require('../util/logger'),
    env = require('../util/env'),
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

const DEFAULT_EXPIRY = 30;

export class Snappy {
    /**
     *
     * @type {RedisClientType}
     */
    cache: RedisClientType;

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
        const dir = os.tmpdir(),
			pOptions = {
			delay: opts.delay,
			timeout: opts.timeout,
			crop: opts.crop,
			css: opts.css,
			script: opts.css,
			cookies: opts.cookies,
			filename: Buffer.from(Math.random().toString()).toString("base64").substr(10, 24),
			select: opts.selector,
		};

		// If the options allow TODO
		if (!opts.ignoreCache) {
			this.getImage("TODO: CHANGE");
		}

        const response = new pageres({delay: 1})
            .src(opts.url, opts.sizes, pOptions)
            .dest(dir)
            .run();

		response
			.then((res: Screenshot[]) => {
				if (!opts.ignoreCache) {
					this.processScreenshot(res, dir);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
    }

	/**
	 *
	 * @param {Screenshot[]} screenshots
	 * @param {string} dir
	 * @private
	 */
	private processScreenshot(screenshots: Screenshot[], dir: string) {
		// Bail if there are no screenshots.
		if (screenshots.length == 0) {
			logger.error("Error: no screenshots in the response.");
			return;
		}

		// Retrieve the filepath, read the file from the system and
		// encode into a base 64 buffer.
		const filePath = path.join(dir, screenshots[0].filename),
			b64 = fs.readFileSync(filePath).toString('base64');

		// Cache in b64 data in Redis.
		this.storeImage(b64);

		// Remove the temporary file by force created by
		// the screenshot capture.
		fs.rmSync(filePath, {
			force: true,
		});
	}

    /**
     * Store the file into the redis cache as base 64 with
	 * a TTL as defined the default expiry.
     * @private
     */
    private storeImage(b64: string) {
		this.cache.set('key', b64, {
			EX: DEFAULT_EXPIRY,
		});
    }

	/**
	 * Retrieves the image from cache if it is set.
	 * @param {string} key
	 * @return {string}
	 * @private
	 */
    private getImage(key: string): string {
		this.cache.get(key)
			.then(res => {
				return <string>res;
			})
			.catch(err => {
				console.log(err);
				return "fuck";
			});
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

        client.on('error', (err) => {
			console.log(err);
            throw new Error('Redis Client Error', err);
        });

        await client.connect();

        this.cache = client;
    }
}
