const express = require("express");
const User = require("../models/User");
const Message = require("../models/Message");

module.exports = (bot, io) => { // added io for Socket.IO
    const router = express.Router();

    router.post("/", async (req, res) => {
        try {
            const { username, text, messageId } = req.body;

            if (!username || !text || !messageId) {
                return res.status(400).json({ error: "Missing data" });
            }

            // 1️⃣ Find user
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // 2️⃣ Send reply to Telegram (as a reply to original message)
            await bot.sendMessage(user.chatId, text, {
                reply_to_message_id: messageId
            });

            // 3️⃣ Mark message as replied in DB
            const updatedMessage = await Message.findByIdAndUpdate(
                messageId,
                {
                    replied: true,
                    replyText: text,
                    repliedAt: new Date()
                },
                { new: true }
            );

            // 4️⃣ Notify dashboard via Socket.IO
            io.emit("messageReplied", updatedMessage);

            res.json({ success: true, message: updatedMessage });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Reply failed" });
        }
    });

    return router;
};
