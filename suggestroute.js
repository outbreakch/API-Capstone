// suggestroute.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);
  try {
    const response = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: { name: q, count: 5 },
      }
    );
    const suggestions = (response.data.results || []).map((loc) => ({
      name: loc.name,
      region: loc.admin1,
      country: loc.country,
      country_code: loc.country_code,
    }));
    res.json(suggestions);
  } catch (err) {
    res.json([]);
  }
});

export default router;
