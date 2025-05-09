const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const scrapeRoutes = require("./routes/scrape");
app.use("/api/scrape", scrapeRoutes);

const generateUrlRoutes = require("./routes/generateUrl");
app.use("/api/generate-url", generateUrlRoutes);

module.exports = app;
