// weatherIcons.js

// Mapping from Open-Meteo weather codes to SVG filenames
export const weatherCodeToSVG = {
  0: "clearsky_day.svg", // clear sky
  1: "fair_day.svg", // mainly clear
  2: "partlycloudy_day.svg", // partly cloudy
  3: "cloudy.svg", // overcast
  45: "fog.svg", // fog
  48: "fog.svg", // depositing rime fog
  51: "lightrainshowers_day.svg", // drizzle: light
  53: "rainshowers_day.svg", // drizzle: moderate
  55: "heavyrainshowers_day.svg", // drizzle: dense
  56: "lightrainshowers_day.svg", // freezing drizzle: light
  57: "heavyrainshowers_day.svg", // freezing drizzle: dense
  61: "lightrainshowers_day.svg", // rain: slight
  63: "rainshowers_day.svg", // rain: moderate
  65: "heavyrainshowers_day.svg", // rain: heavy
  66: "lightrainshowersandthunder_day.svg", // freezing rain: light
  67: "heavyrainshowersandthunder_day.svg", // freezing rain: heavy
  71: "lightsnowshowers_day.svg", // snow fall: slight
  73: "snowshowers_day.svg", // snow fall: moderate
  75: "heavysnowshowers_day.svg", // snow fall: heavy
  77: "snowshowers_day.svg", // snow grains
  80: "lightrainshowers_day.svg", // rain showers: slight
  81: "rainshowers_day.svg", // rain showers: moderate
  82: "heavyrainshowers_day.svg", // rain showers: violent
  85: "lightsnowshowers_day.svg", // snow showers: slight
  86: "heavysnowshowers_day.svg", // snow showers: heavy
  95: "heavyrainandthunder.svg", // thunderstorm: slight or moderate
  96: "heavyrainshowersandthunder_day.svg", // thunderstorm with slight hail
  99: "heavyrainshowersandthunder_day.svg", // thunderstorm with heavy hail
};

// Returns SVG file name (or a fallback if not found)
export function getWeatherIconSVG(weatherCode) {
  return weatherCodeToSVG[weatherCode] || "cloudy.svg";
}
