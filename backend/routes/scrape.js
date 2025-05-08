const express = require("express");
const router = express.Router();
const { scrapeReviews } = require("../controllers/scrapeController");

router.post("/", scrapeReviews);

module.exports = router;
