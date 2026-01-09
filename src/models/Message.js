const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    user: String,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    replied: { type: Boolean, default: false },
    repliedAt: Date,
    replyText: String,
});

// ⚠️ Important for free tier
MessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);
