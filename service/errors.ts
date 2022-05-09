/**
 * NullImageError is thrown when image data is null.
 */
export class NullImageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NullImageError";
    }
}