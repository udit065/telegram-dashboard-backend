const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const messages = await Message.countDocuments();
        const users = await User.countDocuments();

        const replied = await Message.countDocuments({ replied: true });
        const unreplied = await Message.countDocuments({ replied: false });

        res.json({
            messages,
            users,
            replied,
            unreplied
        });
    } catch (err) {
        console.error("Stats API error:", err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

module.exports = router;
