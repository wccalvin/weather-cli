const https = require("https");
const http = require("http");
const api = require("./api.json");

const formatWithLeadingZeros = (dt) => ("0" + dt).slice(-2);

const getConvertedDateTime = (timeStamp, timeZone, fullForm = true) => {
  const convertedDt = new Date(timeStamp * 1000 + timeZone * 1000);
  const month = formatWithLeadingZeros(convertedDt.getMonth() + 1);
  const year = convertedDt.getFullYear();
  const date = formatWithLeadingZeros(convertedDt.getDate());
  const hour = formatWithLeadingZeros(convertedDt.getUTCHours());
  const mins = formatWithLeadingZeros(convertedDt.getMinutes());
  const secs = formatWithLeadingZeros(convertedDt.getSeconds());
  if (fullForm) {
    return `${year}-${month}-${date} ${hour}:${mins}:${secs}`;
  }
  return `${hour}:${mins}:${secs}`;
};

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
            const summaryDesc = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const feelsLike = weatherData.main.feels_like;
            const minTemp = weatherData.main.temp_min;
            const maxTemp = weatherData.main.temp_max;
            const humidity = weatherData.main.humidity;
            const wind = weatherData.wind.speed;
            const country = weatherData.sys.country;
            const sunrise = weatherData.sys.sunrise;
            const sunset = weatherData.sys.sunset;
            const currentDateTime = weatherData.dt;
            const timeZone = weatherData.timezone;
            console.log(
              `Summary: ${summary} (${summaryDesc}) | Date: ${getConvertedDateTime(
                currentDateTime,
                timeZone
              )}`
            );
            console.log(
              `${location} (${country}): ${temp} (feels: ${feelsLike}) deg F ` +
                `(min: ${minTemp} | max: ${maxTemp})`
            );
            console.log(`Wind: ${wind} mph | Humidity: ${humidity}`);
            console.log(
              `Sunrise: ${getConvertedDateTime(sunrise, timeZone, false)} | ` +
                `Sunset: ${getConvertedDateTime(sunset, timeZone, false)}`
            );
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
