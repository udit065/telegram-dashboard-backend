const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

module.exports = (bot) => {
    app.use("/upload", require("./routes/upload.routes")(bot));
    app.use("/stats", require("./routes/stats.routes"));
    app.use("/messages", require("./routes/messages.routes"));
    return app;
};

// await Message.deleteMany({
// createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
// });

