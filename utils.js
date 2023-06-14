
/**
 * Common storage object that holds information about TCP, sensor, and web clients, and log types.
 * @typedef {Object} CommonStorage
 * @property {Set} sensorClients - Set of sensor clients.
 * @property {Set} webClients - Set of web clients.
 * @property {Array} logTypes - Array of log types.
 */
const commonStorage = {
    sensorClients: new Set(),
    webClients: new Set(),
    logTypes: JSON.parse(process.env.logTYPES)
};

/**
 * Logs a message to the console if the log type is enabled.
 * @param {number} logType - The log type.
 * @param {string} message - The message to log.
 * @param {Object} [data] - Additional data to log.
 * @returns {void}
 */
function LOGGER(logType, message, data = undefined) {
    var indentation = "";
    for (var i = 1; i < logType; i++)
        indentation += "  ";

    if (commonStorage.logTypes.includes(logType)) {
        if (data)
            console.log(indentation, message, data);
        else
            console.log(indentation, message);
    }
}

/**
 * Logs a message with information about the request to the console.
 * @param {string} url - The URL of the request.
 * @param {string} method - The HTTP method of the request.
 * @param {Object} req - The request object.
 * @returns {void}
 */
function logger(url, method, req) {
    const time = new Date();
    LOGGER(1, `[ WEB ] ${method} '${url}' ${req.socket.remoteAddress} ${time}`);
}


module.exports = { commonStorage, LOGGER, logger };