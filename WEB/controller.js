const { logger } = require("../utils");
const { getData, generateSensor, deleteSensor} = require("./utils");

/**
 * Retrieves details of sensors.
 * @function getSensorsDetails
 * @returns {Object} Returns a JSON object with status and information.
 */
module.exports.getSensorDetails = async (req, res) => {
  // Logging request.
  logger(`${process.env.webServerApiURL}`, "POST", req);
  try {
    const result = await getData(req.user.username);
    if (result.status)
      return res.status(200).json(result.info);
    return res.status(403).json(result.info)
  } catch (err) {
    return res.status(500).json(err);
  }
};

/**
 * Generates a new sensor.
 * @function sensorGenerate
 */
module.exports.sensorGenerate = async (req, res) => {
  logger(`${process.env.webServerApiURL}sensor/generate`, "GET", req);
  try {
    var result = await generateSensor(req.user.username);
    if (result.status)
      return res.status(200).json(result.info);
    return res.status(403).json(result.info)
  } catch (err) {
    return res.status(500).json(err);
  }
};

/**
 * Deletes a sensor.
 * @function sensorDelete
 */
module.exports.sensorDelete = async (req, res) => {
  logger(`${process.env.webServerApiURL}sensor/delete`, "POST", req);
  try {
    var result = await deleteSensor(req.body.registrationId, req.user.username);
    if (result.status)
      return res.status(200).json(result.info);
    return res.status(403).json(result.info);
  } catch (err) {
    return res.status(500).json(err);
  }
};
