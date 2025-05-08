const axios = require("axios");

exports.scrapeReviews = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.post("http://localhost:8001/scrape", { url });
    const reviews = response.data.reviews;
    res.json({ reviews }).status(200);
  } catch (err) {
    console.error("Error scraping:", err.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
