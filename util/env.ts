/**
 *
 */
import * as path from 'path';

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
export interface Config {
    appEnv: string;
    appDebug: boolean,
    appPort: number,
    redisPort: number,
    redisHost: string,
    redisUsername: string,
    redisPassword: string,
    redisDB: number,
}

/**
 * Validates the .env file.
 * @type {joi.ObjectSchema<any>}
 */
const envVarsSchema = joi
    .object()
    .keys({
        APP_ENV: joi.string().valid("production", "prod", "dev", "development", "test").required(),
        APP_DEBUG: joi.bool().default(true),
        APP_PORT: joi.number().default(3000),
        REDIS_PORT: joi.number().positive().required(),
        REDIS_HOST: joi.string().ip().required(),
        REDIS_DB: joi.number().optional().allow('')
    })
    .unknown();

const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

if (error) {
    throw new Error(`Environment config validation error: ${error.message}`);
}

module.exports = <Config>{
    appEnv: envVars.APP_ENV,
    appDebug: envVars.APP_DEBUG,
    appPort: envVars.APP_PORT,
    redisPort: envVars.REDIS_PORT,
    redisHost: envVars.REDIS_ADDRESS,
    redisUsername: envVars.REDIS_USERNAME,
    redisPassword: envVars.REDIS_PASSWORD,
    redisDB: envVars.REDIS_DB !== '' ? envVars.REDIS_DB : 0,
};
