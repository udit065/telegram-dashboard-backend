const User = require("../models/User");

module.exports = (bot) => {
    const ADMIN_ID = Number(process.env.ADMIN_ID);

    // TEXT
    bot.onText(/\/broadcast (.+)/, async (msg, match) => {
        if (msg.chat.id !== ADMIN_ID) return;

        const users = await User.find({});
        users.forEach(u => bot.sendMessage(u.chatId, match[1]));
    });

    // PHOTO
    bot.onText(/\/broadcastphoto (.+) (https?:\/\/\S+)/, async (msg, match) => {
        if (msg.chat.id !== ADMIN_ID) return;

        const caption = match[1];
        const url = match[2];
        const users = await User.find({});

        users.forEach(u => bot.sendPhoto(u.chatId, url, { caption }));
    });

    // VIDEO
    bot.onText(/\/broadcastvideo (.+) (https?:\/\/\S+)/, async (msg, match) => {
        if (msg.chat.id !== ADMIN_ID) return;

        const caption = match[1];
        const url = match[2];
        const users = await User.find({});

        users.forEach(u => bot.sendVideo(u.chatId, url, { caption }));
    });
};
