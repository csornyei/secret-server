const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
    },
    iv: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    expiresAt: {
        type: Number,
        default: 0
    },
    remainingViews: {
        type: Number,
        required: true
    }
});

const Secret = mongoose.model('Secret', secretSchema);

module.exports = Secret;