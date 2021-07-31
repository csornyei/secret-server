const CustomError = require("../errors/CustomError");

function errorHandler(err, _, res, __) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeError() });
    }

    console.error("Unknown error");

    res.status(500).send({
        errors: [
            { message: "Something went wrong!" }
        ]
    });
}

module.exports = errorHandler;