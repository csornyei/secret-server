const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

beforeAll(async () => {
    process.env.CRYPTO_SECRET_KEY = "test";

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    collections.forEach(async (collection) => {
        await collection.deleteMany({});
    })
})

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})