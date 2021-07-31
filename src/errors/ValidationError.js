const CustomError = require("./CustomError");

class ValidationError extends CustomError {
    statusCode = 400;

    constructor(errors) {
        super("Validation error");
        this.errors = errors;

        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    serializeError() {
        return this.errors;
    }
}

module.exports = ValidationError;