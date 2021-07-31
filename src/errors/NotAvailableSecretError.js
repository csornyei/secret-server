const CustomError = require("./CustomError");

class NotAvailableSecretError extends CustomError {
    statusCode = 404;

    constructor() {
        super("Secret no longer available!");

        Object.setPrototypeOf(this, NotAvailableSecretError.prototype);
    }

    serializeError() {
        return [
            { message: "Secret no longer available!" }
        ]
    }
}

module.exports = NotAvailableSecretError;