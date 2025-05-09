const axios = require("axios");

exports.scrapeReviews = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.post(
      `${process.env.SCRAPER_BACKEND_URL}/scrape`,
      { url }
    );
    const reviews = response.data.reviews;
    res.status(200).json({ reviews });
  } catch (err) {
    console.error("Error scraping:", err.response?.data || err.message);
    res
      .status(500)
      .json({
        error: "Failed to fetch reviews",
        details: err.response?.data || null,
      });
  }
};
