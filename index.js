import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { getWeatherIconSVG } from "./weatherIcons.js";
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

function formatLongDateWithSuffix(dateString) {
  const date = new Date(dateString);

  // Get weekday, month, year separately
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  // Get the ordinal suffix
  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const ordinalDay = day + getOrdinal(day);

  // Combine parts in the correct order
  return `${weekday}, ${month} ${ordinalDay}, ${year}`;
}

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
    // Capitalize function (to handle 'quebec' -> 'Quebec')
    function capitalizeWords(str) {
      if (!str) return "";
      return str
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    const cityName = capitalizeWords(chosenResult.name);
    const regionName = capitalizeWords(chosenResult.admin1);
    const countryCode = chosenResult.country_code
      ? chosenResult.country_code.toUpperCase()
      : "";
    const parts = [];
    if (cityName) parts.push(cityName);
    if (regionName) parts.push(regionName);
    if (countryCode) parts.push(countryCode);
    const displayLocation = parts.join(", ");
    let cityLat = chosenResult.latitude;
    let cityLon = chosenResult.longitude;
    console.log(chosenResult);

    // Input Lat and Lon for weather fetch
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${cityLat}&longitude=${cityLon}&model=gem&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&forecast_days=7&timezone=auto`;
    const weatherResponse = await axios.get(weatherURL);

    const daily = weatherResponse.data.daily;

    const forecastArray = daily.time.map((date, i) => ({
      date: formatLongDateWithSuffix(date),
      temp_max: daily.temperature_2m_max[i],
      temp_min: daily.temperature_2m_min[i],
      precipitation: daily.precipitation_sum[i],
      weather_code: daily.weathercode[i],
      iconUrl: `assets/images/weathericons/${getWeatherIconSVG(
        daily.weathercode[i]
      )}`,
    })); // 7-day forecast

    res.render("index", {
      forecast: forecastArray,
      city: displayLocation,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.render("index", {
      forecast: null,
      error: "City not found or API error.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
