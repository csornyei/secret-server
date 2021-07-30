const express = require('express');
const { json } = require('express');

const app = express();
app.use(json());

app.all('*', async () => {
    throw new Error("Page Not Found");
});

module.exports = app;