const mongoose = require("mongoose");
require("dotenv").config();
const createApp = require("./app");

const {
    MONGO_USER,
    MONGO_PASSWORD,
    SERVER_PORT,
    CRYPTO_SECRET_KEY
} = process.env;

const start = async () => {
    if (!CRYPTO_SECRET_KEY) {
        throw new Error('CRYPTO_SECRET_KEY must be defined!');
    }
    try {
        await mongoose.connect(`${MONGO_USER}:${MONGO_PASSWORD}@mongodb://mongo:27017`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
    const app = await createApp();
    app.listen(SERVER_PORT, () => {
        console.log(`Listening on port ${SERVER_PORT}`);
    })
}

start();