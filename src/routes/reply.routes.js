const express = require("express");
const Message = require("../models/Message");

module.exports = (bot, io) => {
    const router = express.Router();

    router.post("/", async (req, res) => {
        try {
            const { messageId, text } = req.body;

            if (!messageId || !text) {
                return res.status(400).json({ error: "Missing data" });
            }

            const message = await Message.findById(messageId);
            if (!message) {
                return res.status(404).json({ error: "Message not found" });
            }

            // 1️⃣ Send reply to Telegram
            await bot.sendMessage(message.chatId, text, {
                reply_to_message_id: message.telegramMessageId
            });

            // 2️⃣ Update DB
            message.replied = true;
            message.replyText = text;
            message.repliedAt = new Date();
            await message.save();

            // 3️⃣ Emit socket SAFELY
            if (io) {
                io.emit("messageReplied", message);
            }

            // 4️⃣ ALWAYS return success
            return res.status(200).json({ success: true, message });

        } catch (err) {
            console.error("Reply error:", err);
            return res.status(500).json({ error: "Reply failed" });
        }
    });

    return router;
};
