const express = require('express');
const { loadNuxt, build } = require("nuxt");
require("express-async-errors");
const { json } = require('express');

const secretRoutes = require("./routes/secret");

const errorHandler = require("./middlewares/errorHandler");

const NotFoundError = require("./errors/NotFoundError");

const isDev = process.env.NODE_ENV !== "production";

async function createApp() {
    const app = express();
    app.use(json());

    const nuxt = await loadNuxt(isDev ? 'dev' : 'start');

    app.use("/api/secret", secretRoutes);
    app.use("/", nuxt.render);
    app.all('*', async () => {
        throw new NotFoundError();
    });
    app.use(errorHandler);

    if (isDev) {
        build(nuxt);
    }

    return app;
}


module.exports = createApp;