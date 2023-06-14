const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const {  LOGGER } = require("../utils");

/**
 * @name connectWebServer
 * @function
 * @async
 * @description Sets up Express server.
 * @returns {void}
 */
module.exports = async () => {
  // ---------------- EXPRESS SESSION SETUP -------------------

  // Create the Express app
  let app = express();

  // Enable Cross-Origin Resource Sharing
  app.use(cors());
  LOGGER(5,`[ WEB ] Cors is : *`)

  // Parse JSON bodies and url-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount the app's routes on the designated API URL prefix
  app.use(`${process.env.webServerApiURL}`, routes);

  // Start listening on the designated port
  app.listen(process.env.webServerPORT, (err) => {
    if (err) throw err;
    LOGGER(0, `[ WEB ] Server listening on http://localhost:${process.env.webServerPORT}!`);
  });
};
