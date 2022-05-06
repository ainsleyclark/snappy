/**
 * Returns a formatted error message.
 * @param error
 * @returns {string}
 */
const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    return String(error);
};

export {
    getErrorMessage
};
