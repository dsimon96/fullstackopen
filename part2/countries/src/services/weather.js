import axios from "axios";

const apiUrl = "https://api.open-meteo.com/v1/forecast";

const getWeather = ([lat, lng]) => {
  return axios
    .get(apiUrl, {
      params: {
        latitude: lat,
        longitude: lng,
        current: ["temperature_2m", "weather_code", "wind_speed_10m"],
      },
    })
    .then((response) => {
      return response.data;
    });
};

export default { getWeather };
