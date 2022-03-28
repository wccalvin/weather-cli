/*
use the https://openweathermap.org/ api to get the current weather for the given
location
*/

const { Command } = require("commander");
const app = new Command();
const { version } = require("../package.json");

app
  .description("Show weather based on zip code.")
  .version(version)
  .argument("[zip]", "zip code for the location", "02864")
  .action((zip) => {
    console.log(`zip code: ${zip}`);
  });

app.parse();
