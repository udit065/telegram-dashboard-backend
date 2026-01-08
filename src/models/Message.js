const mongoose = require("mongoose");

module.exports = mongoose.model("Message", {
    user: String,
    text: String,
    time: { type: Date, default: Date.now }
});
