const axios = require("axios");
const db = require("../lib/db");

exports.scrapeReviews = async (req, res) => {
  const { url, name } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const lowercaseName = name.toLowerCase();

  // Check if the URL is already in the database
  const existingEntry = await db.business.findUnique({
    where: { name: lowercaseName },
    include: {
      reviews: true
    },
  });

  if (existingEntry) {
    console.log("🗂️ Existing entry in the database");
    return res.status(200).json({
      reviews: existingEntry.reviews,
      summary: existingEntry.summary,
    });
  }

  try {
    const response = await axios.post(
      `${process.env.SCRAPER_BACKEND_URL}/scrape`,
      { url }
    );

    const reviews = response.data.reviews;
    const summary = response.data.summary;

    // Create a new entry in the database
    const newEntry = await db.business.create({
      data: {
        name: lowercaseName,
        mapUrl: url,
        reviews: {
          create: reviews.map((review) => ({
            name: review.name,
            rating: review.rating,
            date: review.date,
            text: review.text,
            sentiment_label: review.sentiment_label,
            sentiment_score: review.sentiment_score,
          })),
        },
        summary: summary,
      },
    });

    return res.status(200).json({ reviews, summary });
  } catch (err) {
    console.error("Error scraping:", err.response?.data || err.message);
    return res
      .status(500)
      .json({
        error: "Failed to fetch reviews",
        details: err.response?.data || null,
      });
  }
};
