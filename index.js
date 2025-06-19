import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { getWeatherIconName } from "./weatherIcons.js";
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
  res.render("index", { weather: null, error: null });
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

    // Input Lat and Lon for weather fetch
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${cityLat}&longitude=${cityLon}&model=gem&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&forecast_days=7&timezone=auto`;
    const weatherResponse = await axios.get(weatherURL);

    const daily = weatherResponse.data.daily;

    const forecastArray = daily.time.map((date, i) => ({
      date: date,
      temp_max: daily.temperature_2m_max[i],
      temp_min: daily.temperature_2m_min[i],
      precipitation: daily.precipitation_sum[i],
      weather_code: daily.weathercode[i],
      icon: getWeatherIconName(daily.weathercode[i], 1),
    })); // 7-day forecast

    console.log(forecastArray);
    // Pass dailyForecast to your EJS template
    res.render("index", {
      forecast: forecastArray,
      city: city,
      error: null,
    });
  } catch (error) {
    console.error(error);
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
