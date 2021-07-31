const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const { CRYPTO_SECRET_KEY } = process.env;
const key = crypto.createHash("sha256")
    .update(CRYPTO_SECRET_KEY)
    .digest();
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

function decrypt(iv, content) {
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

        const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()])

        return decrypted.toString();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    encrypt,
    decrypt
}