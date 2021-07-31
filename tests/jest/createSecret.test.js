const request = require("supertest");
const createApp = require("../../src/app");

let app;

beforeEach(async () => {
    app = await createApp();
});

it('try to create secret with invalid data', async () => {
    const response = await request(app)
        .post("/api/secret")
        .send({})
        .expect(400);

    const { errors } = JSON.parse(response.text);

    expect(errors.length).toEqual(3);
    expect(errors[0].message).toBe("You must provide a text for the secret!");
    expect(errors[1].message).toBe("You must provide how many views are allowed!");
    expect(errors[2].message).toBe("You must provide a number for how many views are allowed!");

    const secondResponse = await (request(app))
        .post("/api/secret")
        .send({ secret: "test", expireAfterViews: "test", expireAfter: -5 })
        .expect(400);

    const secondErrors = JSON.parse(secondResponse.text).errors;

    expect(secondErrors.length).toEqual(2);
    expect(secondErrors[0].message).toBe("You must provide a number for how many views are allowed!");
    expect(secondErrors[1].message).toBe("Time to live must be positive number!");
});

it("create a secret", async () => {
    const response = await request(app)
        .post("/api/secret")
        .send({ secret: "Test", expireAfterViews: 10, expireAfter: 1000 })
        .expect(201);

    const secret = response.body;

    expect(secret.secretText).toBe("Test");
    expect(new Date(secret.expiresAt).getTime()).toBeGreaterThan(Date.now());
    expect(secret.remainingViews).toBe(10);
})