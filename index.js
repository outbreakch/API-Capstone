//index.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import suggestRoute from "./suggestroute.js";

import forecastRoute from "./routes/forecast.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 5500;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/suggest", suggestRoute);
app.use("/", forecastRoute);

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
  res.render("index", { forecast: null, city: null, error: null });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
