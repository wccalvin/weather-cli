/*
use the https://openweathermap.org/ api to get the current weather for the given
location
*/

const { Command } = require("commander");
const app = new Command();
const { version } = require("../package.json");

app
  .name("weather")
  .description("Show weather based on zip code.")
  .version(version);

app.parse();
