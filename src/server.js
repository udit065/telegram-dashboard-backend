require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL }
});

connectDB();

const createBot = require("./bot/telegramBot");
const bot = createBot(io);

require("./bot/broadcastHandlers")(bot);
require("./config/socket")(io, bot);

server.listen(process.env.PORT, () =>
    console.log(`Backend running on ${process.env.PORT}`)
);
