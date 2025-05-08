const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "Scrape endpoint hit!" });
});

module.exports = router;
