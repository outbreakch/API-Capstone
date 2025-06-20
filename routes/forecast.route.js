// forecast.route.js
import express from "express";
import axios from "axios";
import { getWeatherIconSVG } from "../weatherIcons.js"; // adjust path if needed

const router = express.Router();

function formatLongDateWithSuffix(dateString) {
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
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
  return `${weekday}, ${month} ${ordinalDay}, ${year}`;
}

function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Calculate Humidex
function calcHumidex(tempC, humidity) {
  const e =
    (humidity / 100) * 6.105 * Math.exp((17.27 * tempC) / (237.7 + tempC));
  return Math.round(tempC + 0.5555 * (e - 10));
}

router.post("/", async (req, res) => {
  const city = req.body.city;
  const geoCacheAPIURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&language=en&format=json`;
  try {
    const geoResponse = await axios.get(geoCacheAPIURL);
    const results = geoResponse.data.results;
    if (!results || results.length === 0) {
      return res.render("index", {
        forecast: null,
        city: null,
        error: "City not found.",
      });
    }
    let chosenResult = results[0];

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

    // Fetch daily and hourly weather
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${cityLat}&longitude=${cityLon}&model=gem&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&hourly=temperature_2m,relative_humidity_2m&forecast_days=7&timezone=auto`;
    const weatherResponse = await axios.get(weatherURL);
    const daily = weatherResponse.data.daily;
    const hourly = weatherResponse.data.hourly;

    // Group hourly data by date for 7 days
    const forecastArray = daily.time.map((date, i) => {
      // Find all hourly indexes for this day
      const hourlyIndexes = [];
      for (let j = 0; j < hourly.time.length; j++) {
        if (hourly.time[j].startsWith(date)) hourlyIndexes.push(j);
      }

      // Compute humidex for each hour, then max
      let maxHumidex = null;
      if (hourlyIndexes.length) {
        maxHumidex = Math.max(
          ...hourlyIndexes.map((j) =>
            calcHumidex(
              hourly.temperature_2m[j],
              hourly.relative_humidity_2m[j]
            )
          )
        );
      }

      return {
        date: formatLongDateWithSuffix(date),
        temp_max: daily.temperature_2m_max[i],
        temp_min: daily.temperature_2m_min[i],
        precipitation: daily.precipitation_sum[i],
        humidex: maxHumidex,
        weather_code: daily.weathercode[i],
        iconUrl: `assets/images/weathericons/${getWeatherIconSVG(
          daily.weathercode[i]
        )}`,
      };
    });

    res.render("index", {
      forecast: forecastArray,
      city: displayLocation,
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.render("index", {
      forecast: null,
      city: null,
      error: "City not found or API error.",
    });
  }
});

export default router;
