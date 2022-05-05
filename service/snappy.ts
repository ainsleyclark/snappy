/**
 *
 */
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

const DEFAULT_EXPIRY = 30,
	CACHE_KEY_PREFIX = `snappy`;

export class Snappy {
    /**
     *
     * @type {RedisClientType}
     */
    cache: RedisClientType;

	/**
	 *
	 * @type {Promise<any>}
	 */
	public ready: Promise<any>;

	/**
	 *
	 */
    constructor() {
		this.ready = new Promise((resolve, reject) => {
			this.loadRedis().then(() => resolve(undefined)).catch((err) => reject(err));
		}) ;
    }

    /**
     *
     * @param {Options} opts
     */
    public async snap(opts: Options) {
		logger.info(`Processing image for URL: ${opts.url}`);

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

		const cacheKey = Snappy.cacheKey(opts);

		// If the options have 'ignore cache' set to false,
		// try and retrieve the image from the cache instance.
		if (!opts.ignoreCache) {
			try {
				const b64 = await this.getImage(cacheKey);
				if (b64 == null) {
					throw new Error(`It's null`);
				}
				return b64;
			} catch (err) {
				logger.debug(err);
			}
		}

		throw new Error("fuckedd")

		// Process the image screenshot download.
		try {
			const screenshots = await new pageres({delay: 1})
				.src(opts.url, opts.sizes, pOptions)
				.dest(dir)
				.run();
			return this.processScreenshot(screenshots, dir, cacheKey);
		} catch (err) {
		}
    }

	/**
	 * Process screenshots takes in a slice of screenshots from Pageres,
	 * the temporary directory from where the local file is stored
	 * and the cacheKey to perform lookups.
	 * Throws an error if there are no screenshots in the response.
	 * Returns the base 64 data upon successful retrieval and
	 * stores them in the cache for future processing.
	 * @param {Screenshot[]} screenshots
	 * @param {string} dir
	 * @param cacheKey
	 * @throws
	 * @private
	 */
	private processScreenshot(screenshots: Screenshot[], dir: string, cacheKey: string): string {
		// Bail if there are no screenshots.
		if (screenshots.length == 0) {
			throw new Error('Error: no screenshots in the response.');
		}

		// Retrieve the filepath, read the file from the system and
		// encode into a base 64 buffer.
		const filePath = path.join(dir, screenshots[0].filename),
			b64 = fs.readFileSync(filePath).toString('base64');

		// Cache in b64 data in Redis.
		this.storeImage(b64, cacheKey);

		// Remove the temporary file by force created by
		// the screenshot capture.
		fs.rmSync(filePath, {
			force: true,
		});

		return b64;
	}

    /**
     * Store the file into the redis cache as base 64 with
	 * a TTL as defined the default expiry.
     * @private
     */
    private storeImage(b64: string, key: string) {
		logger.debug(`Storing image with key ${key}`);
		this.cache.set(key, b64, {
			EX: DEFAULT_EXPIRY,
		});
    }

	/**
	 * Retrieves the image from cache if it is set.
	 * @param {string} key
	 * @return {string}
	 * @private
	 */
	private async getImage(key: string) {
		try {
			return await this.cache.get(key);
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Returns a unique key for the cache driver by serialising
	 * the options.
	 * @param {Options} opts
	 * @return {string}
	 * @private
	 */
	private static cacheKey(opts: Options): string {
		const exclude = [
				"ignoreCache",
				"rebuildCache",
			],
			serialised: {
				[key: string]: any
			} = {};
		for (const [key, value] of Object.entries(opts)) {
			if (exclude.includes(key)) {
				continue;
			}
			serialised[key] = value;
		}
		return `${CACHE_KEY_PREFIX}_${JSON.stringify(serialised)}`;
	}

    /**
     * Loads the redis cache driver for storing images within
     * the Redis datalayer.
	 * Throws an error if the connection could not be established.
     * @returns {Promise<void>}
	 * @throws
     * @private
     */
    private async loadRedis() {
        const client = createClient({
            username: env.redisUsername,
            database: env.redisDB,
            socket: {
                port: env.redisPort,
                host: env.redisHost,
            },
        });

        client.on('error', (err) => {
            throw new Error('Redis Client Error', err);
        });

		client.on('connect', () => {
			logger.info('Successfully connected to Redis client')
		});

		await client.connect().then(() => {
			this.cache = client;
		})
    }
}
