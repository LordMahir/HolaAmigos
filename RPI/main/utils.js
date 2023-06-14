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
const contractAddress = "0x95762D84b4969A2A89Ff7DC588C63a63fd086B52"; 

const providerUrl = 'http://192.168.43.235:8501'; 
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const contract = web3.eth.contract(Store_ABI).at(contractAddress);

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
 * @function addSensorData Function to add sensor data to the chain
 * @returns {object} The JSON object containing the data from sensor.
 */
function addSensorData(iotId, data) {
  try {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error('Error retrieving accounts:', error);
      } else {
        console.log('LOADING....');

        contract.storeData.sendTransaction(
          iotId,
          data,
          { from: accounts[0], gas: 200000 },
          function(error, txHash) {
            if (error) {
              console.error('Error adding sensor data:', error);
            } else {
              waitForTransactionReceipt(txHash);
            }
          }
        );
      }
    });
  } catch (error) {
    console.error('Error adding sensor data:', error);
  }
}

function waitForTransactionReceipt(txHash) {
  const transactionCheckIntervalMs = 1000;
  const transactionReceiptTimeoutMs = 60000;
  const startTime = new Date().getTime();

  const checkTransaction = function(txHash) {
    web3.eth.getTransactionReceipt(txHash, function(error, receipt) {
      if (error) {
        console.error('Error retrieving transaction receipt:', error);
      } else if (receipt) {
        console.log('Sensor data added to the chain:', receipt);
      } else {
        const currentTime = new Date().getTime();
        if (currentTime - startTime < transactionReceiptTimeoutMs) {
          setTimeout(function() {
            checkTransaction(txHash);
          }, transactionCheckIntervalMs);
        } else {
          console.error('Transaction receipt timeout exceeded');
        }
      }
    });
  };

  checkTransaction(txHash);
}


//Function to retrieve all sensor data of a registration ID
function getAllData(socket) {
  contract.getSensorData(function(error, result) {
    if (error) {
      console.error('Error retrieving sensor data:', error);
      socket.emit('data', []);
    } else {
      const data = {
        timestamp: result[0].toNumber(),
        iotId: result[1],
        data: result[2]
      };
      console.log(data);
      socket.emit('data', data);
    }
  });
}


/**
 * @function getData
 * @returns {object} The JSON object containing all the data from sensors.
 */
function getData(intervals,socket) {
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
      iotId: getMacId(),
      measurement: measurement,
    };

    const dataAsString = JSON.stringify(data);

    // store data in local blockchain here.
    addSensorData(getMacId(), dataAsString);

    // socket.emit('data', data);

    
  }, pingTimeSecs * 1000);
}


module.exports = { getData, getAllData, getMacId };