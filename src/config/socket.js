const User = require("../models/User");

module.exports = (io, bot) => {
    // send broadcast from Frontend
    io.on("connection", (socket) => {
        console.log("Dashboard connected");

        socket.on("broadcastText", async (message) => {
            const users = await User.find({});
            users.forEach(u => bot.sendMessage(u.chatId, message));
        });
    });
};
