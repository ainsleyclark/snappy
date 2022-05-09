/**
 * env.ts
 * Environment is responsible for loading the .env file in the root
 * directory and validating the keys.
 * Throws an error if validation failed.
 * @throws
 */
const env = require('dotenv'),
    joi = require('joi');

/**
 * Load the environment file inside the root directory.
 */
env.config({
    override: false,
});

/**
 * Config represents the environment variables set in the .env file
 * used a system configuration for the application.
 */
export class Config {
	appEnv: string;
	appDebug: boolean;
	appPort: number;
	redisPort: number;
	redisHost: string;
	redisUsername: string;
	redisPassword: string;
	redisDB: number;
	redisTLS: boolean;

	/**
	 * Creates a new config instance.
	 */
	constructor() {
		this.validate();
	}

	/**
	 * Validates the .env file.
	 * @type {joi.ObjectSchema<any>}
	 */
	public validate() {
		const schema = joi
			.object()
			.keys({
				APP_ENV: joi.string().valid("production", "prod", "dev", "development", "test").required(),
				APP_DEBUG: joi.bool().default(true),
				APP_PORT: joi.number().default(3000),
				REDIS_PORT: joi.number().positive().required(),
				REDIS_HOST: joi.string().required(),
				REDIS_DB: joi.number().optional().allow('')
			})
			.unknown();

		const {value: envVars, error} = schema
			.prefs({ errors: { label: "key" } })
			.validate(process.env);

		if (error) {
			throw new Error(`Environment config validation error: ${error.message}`);
		}

		this.setVars(envVars);
	}

	/**
	 * Determines if the application is in development mode.
	 * @return {boolean}
	 */
	public isProduction(): boolean {
		return this.appEnv === 'production' || this.appEnv === 'prod';
	}

	/**
	 * Sets the environment variables to the instance.
	 * @param envVars
	 * @private
	 */
	private setVars(envVars: any): void {
		this.appEnv = envVars.APP_ENV;
		this.appDebug = envVars.APP_DEBUG;
		this.appPort = envVars.APP_PORT;
		this.redisPort = envVars.REDIS_PORT;
		this.redisHost = envVars.REDIS_HOST;
		this.redisUsername = envVars.REDIS_USERNAME;
		this.redisPassword = envVars.REDIS_PASSWORD;
		this.redisDB = envVars.REDIS_DB !== '' ? envVars.REDIS_DB : 0;
		this.redisTLS = envVars.REDIS_TLS === 'true';
	}
}

const Environment = new Config();

export {
    Environment
};
