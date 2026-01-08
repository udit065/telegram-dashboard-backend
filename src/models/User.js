const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
    chatId: Number,
    username: String,
    joinedAt: { type: Date, default: Date.now }
});
