const CustomError = require("./CustomError");

class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super("Page Not Found");

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeError() {
        return [
            { message: "Page not found" }
        ]
    }
}

module.exports = NotFoundError;