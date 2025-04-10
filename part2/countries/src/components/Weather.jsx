/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import weatherService from "../services/weather";

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Heavy rain showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

const Weather = ({ capital, latlng }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService.getWeather(latlng).then((weather) => setWeather(weather));
  }, []);

  if (!weather) {
    return null;
  }

  return (
    <>
      <h2>Weather in {capital}</h2>
      <div>
        Temperature: {weather.current.temperature_2m}
        {weather.current_units.temperature_2m}
      </div>
      <div>Conditions: {weatherCodes[weather.current.weather_code]}</div>
      <div>
        Wind: {weather.current.wind_speed_10m}{" "}
        {weather.current_units.wind_speed_10m}
      </div>
    </>
  );
};

export default Weather;
