const request = require("supertest");
const createApp = require("../../src/app");

let app;

beforeEach(async () => {
    app = await createApp();
});

async function createSecret(expireAfter, expireAfterViews) {
    const { body } = await request(app)
        .post("/api/secret/")
        .send({
            secret: `Test${Date.now()}`,
            expireAfterViews,
            expireAfter
        });

    return body;
}

it("gets a secret with not existing hash", async () => {
    await request(app)
        .get("/api/secret/notexisting")
        .send()
        .expect(404);
});

it("successfully get a secret", async () => {
    const { hash, secretText } = await createSecret(0, 100);

    const { body } = await request(app)
        .get(`/api/secret/${hash}`)
        .send()
        .expect(200);

    expect(body.hash).toBe(hash);
    expect(body.secretText).toBe(secretText);
});

it("get not available secret error after there are no remaining views", async () => {
    const { hash } = await createSecret(0, 1);

    await request(app)
        .get(`/api/secret/${hash}`)
        .send()
        .expect(200);

    const { body } = await request(app)
        .get(`/api/secret/${hash}`)
        .send()
        .expect(404);

    expect(body.errors[0].message).toBe("Secret no longer available!");
});

it("get not available secret after ttl is passed", async () => {
    const { hash } = await createSecret(1, 100);

    await new Promise(resolve => setTimeout(() => resolve(), 2000));

    const { body } = await request(app)
        .get(`/api/secret/${hash}`)
        .send()
        .expect(404);

    expect(body.errors[0].message).toBe("Secret no longer available!");
});

it("updates remaining view after each request", async () => {
    const { hash } = await createSecret(1, 100);

    const firstResponse = await request(app)
        .get(`/api/secret/${hash}`)
        .send()
        .expect(200);

    expect(firstResponse.body.remainingViews).toBe(99);

    const secondResponse = await request(app)
        .get(`/api/secret/${hash}`)
        .send()
        .expect(200);

    expect(secondResponse.body.remainingViews).toBe(98);
})