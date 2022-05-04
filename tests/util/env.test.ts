

describe('Environment', () => {
    it('Should pass validation', () => {
    });
    it("Should throw an error when validation is bad", () => {
        try {
            const env = require("./../../src/util/env");
            console.log(env)
        } catch (e) {
            console.log(e);
        }
    });

});