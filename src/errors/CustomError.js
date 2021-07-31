class CustomError extends Error {
    statusCode;
    serializeError() {
        return [];
    }

    constructor(message) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

module.exports = CustomError;