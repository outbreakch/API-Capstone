// weatherIcons.js

export function getWeatherIconName(weathercode, is_day = 1) {
  switch (weathercode) {
    case 0:
      return is_day ? "wb_sunny" : "nights_stay";
    case 1:
    case 2:
      return is_day ? "partly_cloudy_day" : "partly_cloudy_night";
    case 3:
      return "cloud";
    case 45:
    case 48:
      return "foggy";
    case 51:
    case 53:
    case 55:
      return "grain";
    case 56:
    case 57:
      return "ac_unit";
    case 61:
    case 63:
    case 65:
      return "rainy";
    case 66:
    case 67:
      return "weather_mix";
    case 71:
    case 73:
    case 75:
    case 77:
      return "weather_snowy";
    case 80:
    case 81:
    case 82:
      return "showers";
    case 85:
    case 86:
      return "snowing";
    case 95:
      return "thunderstorm";
    case 96:
    case 99:
      return "thunderstorm";
    default:
      return "help"; // fallback icon
  }
}
