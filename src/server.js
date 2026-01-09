require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const createBot = require("./bot/telegramBot");
const createApp = require("./app");
const socketHandler = require("./config/socket");
require("./bot/broadcastHandlers");

const app = express();
const server = http.createServer(app);

// socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

// telegram bot
const bot = createBot(io);

// express routes
const expressApp = createApp(bot);
app.use(expressApp);

// socket handlers
socketHandler(io, bot);

(async () => {
    await connectDB();

    // 🧹 Cleanup old messages (7 days)
    // await Message.deleteMany({
    //     createdAt: {
    //         $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    //     }
    // });

    server.listen(process.env.PORT, () => {
        console.log(`Backend running on ${process.env.PORT}`);
    });
})();
