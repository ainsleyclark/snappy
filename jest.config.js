/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    verbose: true,
    silent: false,
    "collectCoverage": true,
    "coverageReporters": ["json", "html"],
};