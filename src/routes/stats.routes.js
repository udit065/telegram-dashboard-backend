const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
    res.json({
        messages: await Message.countDocuments(),
        users: await User.countDocuments()
    });
});

module.exports = router;
