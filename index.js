// const cors = require("cors");
// require("dotenv").config();

// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const TelegramBot = require("node-telegram-bot-api");
// const mongoose = require("mongoose");

// const app = express();
// app.use(cors());
// const server = http.createServer(app);

// // MongoDB
// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log("MongoDB connected"));

// // Schemas
// const Message = mongoose.model("Message", {
//     user: String,
//     text: String,
//     time: { type: Date, default: Date.now }
// });

// const User = mongoose.model("User", {
//     chatId: Number,
//     username: String,
//     joinedAt: { type: Date, default: Date.now }
// });

// // Socket.IO
// const io = new Server(server, {
//     cors: { origin: process.env.CLIENT_URL }
// });

// // Telegram Bot
// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
// const ADMIN_ID = Number(process.env.ADMIN_ID); // admin Telegram ID

// // Save users when they send messages
// bot.on("message", async (msg) => {
//     const chatId = msg.chat.id;

//     // Save user if not exists
//     await User.updateOne(
//         { chatId },
//         { $set: { chatId, username: msg.from.username || msg.from.first_name } },
//         { upsert: true }
//     );

//     // Save message
//     const data = {
//         user: msg.from.username || msg.from.first_name,
//         text: msg.text
//     };
//     await Message.create(data);

//     io.emit("newMessage", data);
// });

// // ===== Admin Broadcast Commands =====

// // Text
// bot.onText(/\/broadcast (.+)/, async (msg, match) => {
//     if (msg.chat.id !== ADMIN_ID) return;

//     const text = match[1];
//     const users = await User.find({});
//     let success = 0, failed = 0;

//     for (const u of users) {
//         try {
//             await bot.sendMessage(u.chatId, text);
//             success++;
//         } catch {
//             failed++;
//         }
//     }

//     bot.sendMessage(ADMIN_ID, `Broadcast complete.\n✅ Sent: ${success}\n❌ Failed: ${failed}`);
// });

// // Photo
// bot.onText(/\/broadcastphoto (.+) (https?:\/\/\S+)/, async (msg, match) => {
//     if (msg.chat.id !== ADMIN_ID) return;

//     const caption = match[1];
//     const url = match[2];
//     const users = await User.find({});
//     let success = 0, failed = 0;

//     for (const u of users) {
//         try {
//             await bot.sendPhoto(u.chatId, url, { caption });
//             success++;
//         } catch {
//             failed++;
//         }
//     }

//     bot.sendMessage(ADMIN_ID, `Photo broadcast complete.\n✅ Sent: ${success}\n❌ Failed: ${failed}`);
// });

// // Video
// bot.onText(/\/broadcastvideo (.+) (https?:\/\/\S+)/, async (msg, match) => {
//     if (msg.chat.id !== ADMIN_ID) return;

//     const caption = match[1];
//     const url = match[2];
//     const users = await User.find({});
//     let success = 0, failed = 0;

//     for (const u of users) {
//         try {
//             await bot.sendVideo(u.chatId, url, { caption });
//             success++;
//         } catch {
//             failed++;
//         }
//     }

//     bot.sendMessage(ADMIN_ID, `Video broadcast complete.\n✅ Sent: ${success}\n❌ Failed: ${failed}`);
// });

// // ===== Socket.IO Dashboard Broadcasts =====
// io.on("connection", (socket) => {
//     console.log("Dashboard connected");

//     // Text broadcast
//     socket.on("broadcastText", async (message) => {
//         const users = await User.find({});
//         let success = 0, failed = 0;
//         for (const u of users) {
//             try {
//                 await bot.sendMessage(u.chatId, message);
//                 success++;
//             } catch {
//                 failed++;
//             }
//         }
//         console.log(`Dashboard text broadcast: ✅${success} ❌${failed}`);
//     });

//     // Photo broadcast
//     socket.on("broadcastPhoto", async ({ url, caption }) => {
//         const users = await User.find({});
//         let success = 0, failed = 0;
//         for (const u of users) {
//             try {
//                 await bot.sendPhoto(u.chatId, url, { caption });
//                 success++;
//             } catch {
//                 failed++;
//             }
//         }
//         console.log(`Dashboard photo broadcast: ✅${success} ❌${failed}`);
//     });

//     // Video broadcast
//     socket.on("broadcastVideo", async ({ url, caption }) => {
//         const users = await User.find({});
//         let success = 0, failed = 0;
//         for (const u of users) {
//             try {
//                 await bot.sendVideo(u.chatId, url, { caption });
//                 success++;
//             } catch {
//                 failed++;
//             }
//         }
//         console.log(`Dashboard video broadcast: ✅${success} ❌${failed}`);
//     });
// });

// // Stats API
// app.get("/stats", async (req, res) => {
//     const totalMessages = await Message.countDocuments();
//     const totalUsers = await User.countDocuments();

//     res.json({
//         messages: totalMessages,
//         users: totalUsers
//     });
// });

// // Server
// server.listen(process.env.PORT, () =>
//     console.log(`Backend running on port ${process.env.PORT}`)
// );
