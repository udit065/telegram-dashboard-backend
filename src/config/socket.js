const User = require("../models/User");

module.exports = (io, bot) => {
    io.on("connection", (socket) => {
        console.log("Dashboard connected:", socket.id);

        socket.on("broadcastText", async (message) => {
            try {
                if (!message?.trim()) return;

                const users = await User.find({});
                let successCount = 0;

                for (const u of users) {
                    try {
                        await bot.sendMessage(u.chatId, message);
                        successCount++;
                    } catch (err) {
                        console.error("Failed for user:", u.chatId);
                    }
                }

                socket.emit("broadcastResult", {
                    success: true,
                    sent: successCount,
                    total: users.length
                });

            } catch (err) {
                socket.emit("broadcastResult", {
                    success: false,
                    error: "Broadcast failed. Try again."
                });
            }
        });
    });
};
