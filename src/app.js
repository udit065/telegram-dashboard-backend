const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use("/stats", require("./routes/stats.routes"));

module.exports = app;
