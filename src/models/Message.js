const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true
        },

        chatId: {
            type: String,
            required: true
        },

        text: {
            type: String,
            required: true
        },

        telegramMessageId: {
            type: Number,
            required: true
        },

        replied: {
            type: Boolean,
            default: false
        },

        replyText: String,
        repliedAt: Date
    },
    { timestamps: true }
);

// ⚠️ Important for free tier
MessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);
