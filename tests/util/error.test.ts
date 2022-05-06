import {getErrorMessage} from "../../util/error";

describe('Errors', () => {

	describe('getErrorMessage()', () => {

		it('Should return message when instanceof Error', () => {
			expect(getErrorMessage(new Error('message'))).toBe('message');
		});

		it('Should return a string when any', () => {
			expect(getErrorMessage('message')).toBe('message');
			expect(getErrorMessage(123)).toBe('123');
		});
	});
});
