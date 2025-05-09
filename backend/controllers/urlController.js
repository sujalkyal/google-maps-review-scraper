const axios = require("axios");

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
