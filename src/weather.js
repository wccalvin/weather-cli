const https = require("https");
const http = require("http");
const api = require("./api.json");

const getWeatherData = (location) => {
  const apiKey = api.key;
  const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
  const apiUrl = `${weatherUrl}?q=${location}&units=imperial&APPID=${apiKey}`;
  try {
    req = https.get(apiUrl, (res) => {
      const status = res.statusCode;
      if (status === 200) {
        let data = "";
        res.on("data", (d) => {
          data += d;
        });
        res.on("end", () => {
          try {
            const weatherData = JSON.parse(data);
            const summary = weatherData.weather[0].main;
            const temp = weatherData.main.temp;
            const feelsLike = weatherData.main.feels_like;
            const minTemp = weatherData.main.temp_min;
            const maxTemp = weatherData.main.temp_max;
            const humidity = weatherData.main.humidity;
            console.log(`${summary} ()`);
            console.log(
              `${location} (): ${temp} (feels: ${feelsLike}) deg F (min: ${minTemp} | max: ${maxTemp})`
            );
            console.log(`Wind: | Humidity: ${humidity}`);
          } catch (e) {
            console.error(e.message);
          }
        });
      } else {
        const statusMessage = http.STATUS_CODES[status];
        const statusError = new Error(
          "An error occurred when retrieving weather data for " +
            `${location}: ${status} (${statusMessage})`
        );
        console.error(statusError.message);
      }
    });
    req.on("error", (e) => {
      console.error(e);
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports.get = getWeatherData;
