const express = require("express");
const upload = require("../config/upload");
const User = require("../models/User");

module.exports = (bot) => {
    const router = express.Router();

    router.post("/photo", upload.single("file"), async (req, res) => {
        const users = await User.find({});
        for (const u of users) {
            await bot.sendPhoto(u.chatId, req.file.buffer, {
                caption: req.body.caption
            });
        }
        res.json({ success: true });
    });

    router.post("/video", upload.single("file"), async (req, res) => {
        const users = await User.find({});
        for (const u of users) {
            await bot.sendVideo(u.chatId, req.file.buffer, {
                caption: req.body.caption
            });
        }
        res.json({ success: true });
    });

    return router;
};
