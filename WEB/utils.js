const axios = require('axios');
const CryptoJS = require("crypto-js");
const { commonStorage, LOGGER } = require("../utils");


/**
 * Get data of a particular sensors registered with the specified company ID.
 * @function getSensors
 * @async
 * @param {string} companyId - The ID of the company.
 * @returns {Promise<Object>} - An object containing a boolean indicating the status of the operation, and an array of sensor objects.
*/
module.exports.getData = async (companyId) => {
    
    const result = [];
    const registeredSensors = await commonStorage.web3.contracts.sensorContract.methods
        .getIOts(companyId).call();
    registeredSensors.forEach((registeredSensor) => {
        result.push({
            iotId: registeredSensor.iotId,
            companyId: registeredSensor.companyId,
            available: false
        });
    });

    LOGGER(6, `[ WEB ] Sensors result is`, result);

    console.log("oh bccc!!");
   
    // Make a POST request to the server
    axios.post('http://localhost:3001/data')
    .then((response) => {
    console.log('Response:', response.data);
    })
    .catch((error) => {
    console.error('Error:', error);
    });

    return { status: true, info: result };
}

/**
 * Generates a new sensor for a given company ID
 * @function generateSensor
 * @param {string} iotId - The iot ID of the IOT to generate
 * @param {string} companyId - The company ID for which to generate a sensor
 * @returns {Promise<{ status: boolean, info: { companyId: string, iotId: string, message: string } }>} An object containing status and info fields
 */
module.exports.generateSensor = async (companyId,iotId) => 
{
    var time = Date.now() / 1000;
    LOGGER(6, `[ WEB ] Initialising IOT`);
   
    const receipt = await commonStorage.web3.contracts.sensorContract.methods
        .storeSensor(iotId, companyId)
        .send({ from: commonStorage.web3.account });
    LOGGER(6, `[ WEB ] Receipt:`, receipt);
    return { status: true, info: { companyId, iotId, message: receipt.events.Message.returnValues.message} };

}

/**
 * Deletes a sensor with the given registration ID and company ID
 * @function deleteSensor
 * @param {string} iotId - The iot ID of the IOT to delete
 * @param {string} companyId - The company ID of the sensor to delete
 * @returns {Promise<{ status: boolean, info: { message: string } }>} An object containing status and info fields
 */
module.exports.deleteSensor = async (iotId, companyId) => {
    var time = Date.now() / 1000;
    // add authentication
    LOGGER(6, `[ WEB ] Deleting IOT id:${iotId}`);
    const receipt = await commonStorage.web3.contracts.sensorContract.methods
        .deleteSensor(iotId, companyId)
        .send({ from: commonStorage.web3.account });
    LOGGER(6, `[ WEB ] Deleted sensor for IOT id:${iotId}`);
    LOGGER(3, `[ WEB ] Time taken for deleting: ${Date.now() / 1000 - time}s`);
    LOGGER(6, `[ WEB ] Receipt:`, receipt);
    return { status: true, info: { message: receipt.events.Message.returnValues.message } };
}



