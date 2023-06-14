const { spawn } = require("child_process");
const Web3 = require('web3');
const { networkInterfaces } = require("os");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, ".env") });

// ------------ Requires installation ------------
const DHT = require("node-dht-sensor");
const { SerialPort } = require("serialport");
const nmea = require("nmea");
// ------------------------------------------------

const { ReadlineParser } = require("@serialport/parser-readline");
const server = process.env.SERVER_URL;

const pingTimeSecs = parseInt(process.env.PING_TIME_SECS);
const motionSensorPin = parseInt(process.env.MOTION_SENSOR_PIN);
const soilHumiditySensorPin = process.env.SOIL_HUMIDITY_SENSOR_PIN;
const gpioScript = process.env.GPIO_SCRIPT;
const adsScript = process.env.ADS_SCRIPT;

const tempSensorType = parseInt(process.env.TEMP_SENSOR_TYPE);
const tempSensorPin = parseInt(process.env.TEMP_SENSOR_PIN);
const gpsPingTimeMins = parseFloat(process.env.GPS_PING_TIME_MINS);
const gpsSensorPort = process.env.GPS_SENSOR_PORT;
const gpsSensorBaudRate = parseInt(process.env.GPS_SENSOR_BAUD_RATE);
const gpsPortOpenTimeSecs = parseInt(process.env.GPS_PORT_OPEN_TIME_SECS);

const { Store_ABI } = require("./contracts_abi");

const contractABI = Store_ABI; 
const contractAddress = '0x983A3B4B423cA027A103a20373f2778B20FE3EeD'; 

const web3 = new Web3('http://localhost:8501'); 
const contract = new web3.eth.Contract(contractABI, contractAddress);


var registrationId = null;
var coordinates = {};
var dhtValues = {},
  motion = null,
  soilHumidity = null;

/**
 * @async
 * @function getSensorValue
 * @param {string} scriptName - The name of the Python script to run.
 * @param {string} sensorPin - The sensor pin to use.
 * @returns {Promise} A Promise that resolves with the result of running the script or rejects with an error message.
 */
async function getSensorValue(scriptName, sensorPin) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", [
      path.resolve(__dirname, scriptName),
      sensorPin,
    ]);
    var result = null;
    pythonProcess.stdout.on("data", (data) => {
      result = data.toString().trim();
    });
    pythonProcess.stderr.on("data", (data) => {
      reject(data.toString());
    });
    pythonProcess.on("close", (code) => {
      resolve(result);
    });
  });
}

/**
 * @async
 * @function readDHT
 * @returns {Promise} A Promise that resolves with an object containing the temperature and humidity readings, or rejects with an error message.
 */
function readDHT() {
  return new Promise((resolve, reject) => {
    var temperature = null,
      humidity = null;
    DHT.read(tempSensorType, tempSensorPin, (err, temp, hum) => {
      if (!err) {
        temperature = temp;
        humidity = hum;
        resolve({ temperature, humidity });
      } else {
        reject(err);
      }
    });
  });
}

/**
 * @function convertDMS
 * @param {number} dms - The DMS (degrees, minutes, seconds) value to convert.
 * @returns {number} The converted decimal degrees value.
 */
function convertDMS(dms) {
  const degrees = Math.floor(dms / 100);
  const minutes = (dms % 100) / 60;
  return degrees + minutes;
}

/**
 * @function fetchCoordinates
 * @description Fetches the current GPS coordinates using a serial port connection.
 */
function fetchCoordinates() {
  console.log("Fetching coordinates");
  try {
    const port = new SerialPort({
      path: gpsSensorPort,
      baudRate: gpsSensorBaudRate,
    });
    const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    function closePort() {
      port.close(() => {
        console.log("Serial port closed.");
      });
    }
    var gpsClosingTimeout = setTimeout(closePort, gpsPortOpenTimeSecs * 1000);
    parser.on("data", (data) => {
      try {
        if (data.startsWith("$GNRMC")) {
          const msg = nmea.parse(data);
          if (msg.lat != "" && msg.lon != "") {
            coordinates = {
              latitude: convertDMS(msg.lat),
              longitude: convertDMS(msg.lon),
            };
            console.log(coordinates);
            clearTimeout(gpsClosingTimeout);
            closePort();
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
    parser.on("error", (err) => {
      console.log(err);
      reject(err);
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * @function getMacId
 * @returns {object} The MAC ID of the current machine.
 */
function getMacId() {
    const nets = networkInterfaces();
    const result = Object.keys(nets)
      .map(
        (ifname) =>
          nets[ifname].filter(
            (iface) => iface.family === "IPv4" && !iface.internal
          )[0]
      )
      .filter((iface) => iface && iface.mac)[0].mac;
  
    return result;
}

/**
 * @function addSensorData
 * @returns {object} The JSON object containing the data from sensor.
 */
// Function to add sensor data to the chain
async function addSensorData(registrationId, data) {
  try {
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods.addSensorData(registrationId, data).send({ from: accounts[0] });
      console.log('Sensor data added to the chain:', result.transactionHash);
  } catch (error) {
      console.error('Error adding sensor data:', error);
  }
}

// Function to retrieve all sensor data of a registration ID
async function getAllSensorData(registrationId) {
  try {
      const count = await contract.methods.getSensorDataCount(registrationId).call();
      console.log('Total sensor data count:', count);
      
      for (let i = 0; i < count; i++) {
          const result = await contract.methods.getSensorData(registrationId, i).call();
          console.log('Sensor data at index', i, ':', result);
      }
  } catch (error) {
      console.error('Error retrieving sensor data:', error);
  }
}


/**
 * @function getData
 * @returns {object} The JSON object containing all the data from sensors.
 */
function getData(intervals) {
  fetchCoordinates();
  intervals.gpsInterval = setInterval(async () => {
    fetchCoordinates();
  }, gpsPingTimeMins * 60 * 1000);

  intervals.pingInterval = setInterval(async () => {
    try {
      dhtValues = await readDHT();
      motion = Boolean(
        parseInt(await getSensorValue(gpioScript, motionSensorPin))
      );
      soilHumidity =
        ((parseFloat(await getSensorValue(adsScript, soilHumiditySensorPin)) -
          process.env.SOIL_0_VALUE) /
          (process.env.SOIL_100_VALUE - process.env.SOIL_0_VALUE)) *
        100;
    } catch (e) {
      console.log(e);
    }

    const measurement = JSON.stringify({
      time: new Date().getTime(),
      ...dhtValues,
      sensorId: getMacId(),
      sensorLocation: coordinates,
      motion,
      soilHumidity,
    });
    const data = {
      registrationId: registrationId,
      measurement: measurement,
    };
    console.log("Measurement is", measurement);
    console.log("Emitted data is", data);
    
    // store data in local blockchain here.
    // addSensorData(companyId, data);
    
  }, pingTimeSecs * 1000);
}


module.exports = { getData };
