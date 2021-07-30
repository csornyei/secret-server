const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

const { MONGO_USER, MONGO_PASSWORD, SERVER_PORT } = process.env;

const start = async () => {
    try {
        await mongoose.connect(`${MONGO_USER}:${MONGO_PASSWORD}@mongodb://mongo:27017`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
    app.listen(SERVER_PORT, () => {
        console.log(`Listening on port ${SERVER_PORT}`);
    })
}

start();