/**
 * TODO
 */
import * as path from 'path';
import {createClient} from "redis";
import {Options} from "./options";
import {Screenshot} from "pageres";
import {Log} from "../util/logger";
import {Environment} from "../util/env";
import {NullImageError} from "./errors";
import {getErrorMessage} from "../util/error";

const fs = require("fs"),
    os = require('os'),
    pageres = require('pageres'),
    hash = require('object-hash');

/**
 * Alias of a Redis Client.
 */
type RedisClientType = ReturnType<typeof createClient>;

/**
 * DEFAULT_EXPIRY is the amount of time in seconds
 * before an image is expired from the cache.
 * @type {number}
 */
const DEFAULT_EXPIRY = 60 * 60 * 24 * 4;

/**
 * CACHE_KEY_PREFIX is the prefix for cached images that
 * reside in the Redis instance.
 * @type {string}
 */
const CACHE_KEY_PREFIX = `snappy`;

/**
 * TIMEOUT is the number of seconds after which
 * the request is aborted.
 * @type {number}
 */
const TIMEOUT = 20;

/**
 * Snapper is responsible for TODO.
 */
class Snapper {
    /**
     * Ready is resolved when the Redis instance
     * is loaded.
     * @type {Promise<any>}
     */
    public ready: Promise<any>;

    /**
     * cache
     * @type {RedisClientType}
     */
    private cache: RedisClientType;

    /**
     * Creates a new Snappy instance.
     */
    constructor() {
        Log.debug('Starting snappy...');
        this.ready = new Promise((resolve, reject) => {
            this.loadRedis()
                .then(() => resolve(undefined))
                .catch((err) => reject(err));
        });
    }

    /**
     * TODO
     * @param {Options} opts
     */
    public async snap(opts: Options) {
        Log.debug(`Processing image for URL: ${opts.url}`);

        // Setup temporary directory, cache key and convert to
        // Pageres Options for processing.
        const dir = os.tmpdir(),
            cacheKey = Snapper.cacheKey(opts),
            pageresOptions = {
                timeout: TIMEOUT,
                filename: Snapper.fileName(),
                ...opts,
            };

        // If the options have 'ignore cache' set to false,
        // try and retrieve the image from the cache instance.
        if (!opts.ignoreCache) {
            try {
                const b64 = await this.getImage(cacheKey);
                if (b64 == null) {
                    throw new NullImageError(`Base64 is null`);
                }
                Log.debug(`Serving image from cache: ${cacheKey}`);
                return b64;
            } catch (err: unknown) {
                if (!(err instanceof NullImageError)) {
                    Log.debug(getErrorMessage(err));
                }
            }
        }

        // Process the image screenshot download.
		const screenshots = await new pageres({delay: 1})
			.src(opts.url, [opts.size], pageresOptions)
			.dest(dir)
			.run();

		const data = this.processScreenshot(screenshots, dir, cacheKey);
		if (!data) {
			throw new NullImageError('Base64 is null');
		}

		Log.debug(`Serving image from fs: ${cacheKey}`);
		return data;
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
        Log.debug(`Storing image with key ${key}`);
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
            throw new Error(`Item could not be retrieved from cache ${err}: err`);
        }
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
            username: Environment.redisUsername,
            database: Environment.redisDB,
            socket: {
                port: Environment.redisPort,
                host: Environment.redisHost,
            },
        });

        client.on('error', (err) => {
            console.log(err);
            throw new Error(`Redis connect error: ${err}`);
        });

        client.on('connect', () => {
            Log.debug('Successfully connected to Redis client');
        });

        await client.connect();

        this.cache = client;
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
        return `${CACHE_KEY_PREFIX}_${hash(serialised)}`;
    }

    /**
     *
     * @returns {string}
     * @private
     */
    private static fileName(): string {
        return Buffer.from(Math.random().toString()).toString("base64").substr(10, 24);
    }
}

const Snappy = new Snapper();

export {
    Snappy
};
