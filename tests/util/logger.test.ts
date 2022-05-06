
import {Log} from "../../util/logger";
import {Environment} from "../../util/env";



jest.mock('../../util/env', () => jest.fn());

Environment.isProduction = (): boolean => {
	return true;
};

describe('Logger', () => {

	console.log('hello', Environment);

	it('Should be log level: debug in development', () => {
		expect(Log.level).toBe('debug');
	});

	it('Should be log level: info in production', () => {
		expect(Log.level).toBe('info');
	});
});
