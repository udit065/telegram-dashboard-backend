const TelegramBot = require("node-telegram-bot-api");
const User = require("../models/User");
const Message = require("../models/Message");

module.exports = (io) => {
    const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

    bot.on("message", async (msg) => {
        const chatId = msg.chat.id;

        await User.updateOne(
            { chatId },
            { $set: { chatId, username: msg.from.username || msg.from.first_name } },
            { upsert: true }
        );

        const data = {
            user: msg.from.username || msg.from.first_name,
            text: msg.text
        };

        await Message.create(data);

        // LIVE MESSAGE
        io.emit("newMessage", data);
    });

    return bot;
};
