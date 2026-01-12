const TelegramBot = require("node-telegram-bot-api");
const User = require("../models/User");
const Message = require("../models/Message");

module.exports = (io) => {
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    bot.on("message", async (msg) => {
        try {
            // Ignore non-text messages (photos, stickers, etc.)
            if (!msg.text) return;

            const chatId = msg.chat.id;
            const username = msg.from.username || msg.from.first_name || "unknown";

            // 1️⃣ Save or update user
            await User.updateOne(
                { chatId },
                { $set: { chatId, username } },
                { upsert: true }
            );

            // 2️⃣ Save message with REQUIRED fields
            const savedMessage = await Message.create({
                user: username,
                chatId: chatId,
                text: msg.text,
                telegramMessageId: msg.message_id // 🔥 REQUIRED for replies
            });

            // 3️⃣ MongoDB free-tier optimization (keep only latest 500 messages)
            const MAX_MESSAGES = 500;
            const count = await Message.countDocuments();

            if (count > MAX_MESSAGES) {
                const excess = count - MAX_MESSAGES;

                const oldMessages = await Message.find()
                    .sort({ createdAt: 1 }) // oldest first
                    .limit(excess)
                    .select("_id");

                const ids = oldMessages.map(m => m._id);
                await Message.deleteMany({ _id: { $in: ids } });
            }

            // 4️⃣ Emit live message to dashboard (Socket.IO)
            io.emit("newMessage", savedMessage);

        } catch (err) {
            console.error("Telegram message handler error:", err);
        }
    });

    return bot;
};


// LIVE MESSAGE
// io.emit("newMessage", {
//     user: username,
//     text: msg.text,
//     createdAt: new Date()
// });
