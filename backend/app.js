const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const scrapeRoutes = require("./routes/scrape");
app.use("/api/scrape", scrapeRoutes);

module.exports = app;
