import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { chown } from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home route
app.get("/", (req, res) => {
  res.render("index.ejs", { weather: null, error: null });
});

//POST route
app.post("/", async (req, res) => {
  const city = req.body.city;
  const geoCacheAPIURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&language=en&format=json`;
  try {
    const geoResponse = await axios.get(geoCacheAPIURL);
    const results = geoResponse.data.results;
    if (!results || results.length === 0) {
      return res.render("index", { weather: null, error: "City not found." });
    }
    let chosenResult = results[0];
    let cityLat = chosenResult.latitude;
    let cityLon = chosenResult.longitude;
    console.log(cityLat, cityLon);
    res.render("index", { weather: "Still working on this", error: null });
  } catch (error) {
    res.render("index", {
      weather: null,
      error: "City not found or API error.",
    });
  }
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
