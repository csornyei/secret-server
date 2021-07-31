const express = require('express');
require("express-async-errors");
const { json } = require('express');

const secretRoutes = require("./routes/secret");

const errorHandler = require("./middlewares/errorHandler");

const NotFoundError = require("./errors/NotFoundError");

const app = express();
app.use(json());

app.use("/api/secret", secretRoutes);
app.all('*', async () => {
    throw new NotFoundError();
});
app.use(errorHandler);

module.exports = app;