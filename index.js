require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"));

// Schema
const Message = mongoose.model("Message", {
    user: String,
    text: String,
    time: { type: Date, default: Date.now }
});

// Socket.IO
const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL }
});

// Telegram Bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Bot Message Handler (ONLY ONE)
bot.on("message", async (msg) => {
    const data = {
        user: msg.from.username || msg.from.first_name,
        text: msg.text
    };

    await Message.create(data);
    io.emit("newMessage", data);
});

// Stats API
app.get("/stats", async (req, res) => {
    const totalMessages = await Message.countDocuments();
    const totalUsers = await Message.distinct("user");

    res.json({
        messages: totalMessages,
        users: totalUsers.length
    });
});

// Server
server.listen(process.env.PORT, () =>
    console.log(`Backend running on port ${process.env.PORT}`)
);
