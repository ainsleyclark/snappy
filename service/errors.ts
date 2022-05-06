export class NullImageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NullImageError";
    }
}

