const { Router } = require("express");
const { encrypt, decrypt } = require("../crypto");
const ValidationError = require("../errors/ValidationError");
const NotFoundError = require("../errors/NotFoundError");
const NotAvailableSecretError = require("../errors/NotAvailableSecretError");
const Secret = require("../models/secret");

const router = Router();

router.get("/:hash", async (req, res) => {
    const { hash } = req.params;

    const secret = await Secret.findOne({ hash: hash });

    if (!secret) {
        throw new NotFoundError();
    }

    if (secret.expiresAt !== 0 && secret.expiresAt < Date.now()) {
        throw new NotAvailableSecretError();
    }

    if (secret.remainingViews === 0) {
        throw new NotAvailableSecretError();
    }

    await Secret.findOneAndUpdate(
        { hash: secret.hash },
        { $set: { remainingViews: secret.remainingViews - 1 } }
    );

    const decryptedText = decrypt(secret.iv, secret.hash);

    res.send({
        "hash": secret.hash,
        "secretText": decryptedText,
        "createdAt": secret.createdAt,
        "expiresAt": secret.expiresAt === 0 ? 0 : new Date(secret.expiresAt),
        "remainingViews": secret.remainingViews - 1,
    });
});

router.post("/", async (req, res) => {
    const { secret, expireAfterViews, expireAfter } = req.body;

    const errors = [];

    if (!secret) {
        errors.push({ message: "You must provide a text for the secret!", field: "secret" });
    }

    if (!expireAfterViews) {
        errors.push({ message: "You must provide how many views are allowed!", field: "expireAfterViews" });
    }

    if (isNaN(parseInt(expireAfterViews))) {
        errors.push({ message: "You must provide a number for how many views are allowed!", field: "expireAfterViews" });
    }

    if (expireAfter < 0) {
        errors.push({ message: "Time to live must be positive number!", field: expireAfter });
    }

    if (errors.length > 0) {
        throw new ValidationError(errors);
    }

    const { iv, content } = encrypt(secret);

    const secretDoc = new Secret({
        hash: content,
        iv,
        expiresAt: expireAfter === 0 ? 0 : Date.now() + (expireAfter * 1000),
        remainingViews: expireAfterViews
    });

    await secretDoc.save();

    res.send(
        {
            "hash": content,
            "secretText": secret,
            "createdAt": secretDoc.createdAt,
            "expiresAt": expireAfter === 0 ? 0 : new Date(secretDoc.expiresAt),
            "remainingViews": expireAfterViews,
        }
    )
})

module.exports = router;