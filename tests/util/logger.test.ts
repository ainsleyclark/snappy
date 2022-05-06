import {Log} from "../../util/logger";
import {Environment} from "../../util/env";

describe('Logger', () => {

	it('Should be log level: debug in development', () => {
		// @ts-ignore

		// (Environment.prototype.isProduction as jest.Mock).mockReturnValue('Mocked bar');
		expect(Log.level).toBe('debug');
	});

	it('Should be log level: info in production', () => {
		expect(Log.level).toBe('info');
	});
});
