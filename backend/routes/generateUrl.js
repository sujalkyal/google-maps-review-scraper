const express = require("express");
const router = express.Router();
const { generate_map_url } = require("../controllers/urlController");

router.post("/", generate_map_url);

module.exports = router;
