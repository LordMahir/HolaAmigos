const router = require("express").Router();
const controller = require("./controller");

/**
 * Route for getting sensor details.
 * @name GET/data
 * @function
 * @param {string} path - Express path
 * @param {callback} controller.getSensorsDetails - Get sensors details controller function
 */
router.get(`/data`, controller.getSensorDetails);

/**
 * Route for generating sensors.
 * @name GET/sensor/generate
 * @function
 * @param {string} path - Express path
 * @param {callback} controller.sensorGenerate - Sensor generation controller function
*/
router.get(`/sensor/generate`, controller.sensorGenerate);

/**
 * Route for deleting a sensor.
 * @name POST/sensor/delete
 * @function
 * @param {string} path - Express route path
 * @param {callback} controller.sensorDelete - Sensor delete controller function
*/
router.post(`/sensor/delete`, controller.sensorDelete);

module.exports = router;
