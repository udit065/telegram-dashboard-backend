const TelegramBot = require("node-telegram-bot-api");
const User = require("../models/User");
const Message = require("../models/Message");

module.exports = (io) => {
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    bot.on("message", async (msg) => {
        if (!msg.text) return; // Ignore non-text messages
        const chatId = msg.chat.id;
        const username = msg.from.username || msg.from.first_name;
        // Save / update user
        await User.updateOne(
            { chatId },
            { $set: { chatId, username } },
            { upsert: true }
        );

        const messageData = {
            user: username,
            text: msg.text,
            createdAt: new Date()
        };

        await Message.create(messageData);
        // Always keep the latest 500 messages. Delete older ones for better Mongo Free-tier Cluster usage
        const MAX_MESSAGES = 500;

        // After saving message
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

        // LIVE MESSAGE
        io.emit("newMessage", {
            user: username,
            text: msg.text,
            createdAt: new Date()
        });
    });

    return bot;
};
