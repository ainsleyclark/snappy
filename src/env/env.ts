const env = require('dotenv');

const result = env.config({
    override: false
})
if (result.error) {
    // TODO Handle
    throw result.error
}