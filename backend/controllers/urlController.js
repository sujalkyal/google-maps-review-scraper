const axios = require("axios");
const db = require("../lib/db");

exports.generate_map_url = async (req, res) => {
  const { url, name } = req.body;

  if (!url && !name) {
    return res.status(400).json({ error: "URL or Name is required" });
  }

  try {
    let businessName = name;

    if (url) {
      const response = await axios.post(
        `${process.env.SCRAPER_BACKEND_URL}/scraperName`,
        { url }
      );
      businessName = response.data.name;
      console.log("📛 Extracted business name:", businessName);
    }

    if (!businessName || typeof businessName !== 'string') {
      return res.status(400).json({ error: "Business name could not be determined." });
    }

    const lowercaseName = businessName.toLowerCase();

    // create new entry in the database if it doesn't exist
    const existingEntry = await db.business.findUnique({
      where: { name: lowercaseName },
    });

    if (existingEntry) {
      console.log("🗂️ existing entry in the database");
      return res.status(200).json({url: existingEntry.mapUrl, name: existingEntry.name});
    }

    const response = await axios.post(
      `${process.env.SCRAPER_BACKEND_URL}/generate-url`,
      { businessName }
    );
    const mapUrl = response.data.url;

    console.log("📍 Generated map URL:", mapUrl);
    return res.status(200).json({ url: mapUrl, name: businessName });
  } catch (err) {
    console.error("Error generating url:", err.response?.data || err.message);
    return res
      .status(500)
      .json({
        error: "Failed to generate map url",
        details: err.response?.data || null,
      });
  }
};
