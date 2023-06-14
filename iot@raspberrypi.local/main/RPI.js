const path = require("path");
// ------------ Requires installation ------------
const dotenv = require("dotenv");
const io = require("socket.io-client");
// ------------------------------------------------
const { getData } = require(path.resolve(__dirname, "utils.js"));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const websocket = process.env.WEBSOCKET_URL;
const websocketpath = process.env.WEBSOCKET_PATH;
const socket = io('http://localhost:3000');

const intervals = { pingInterval: null, gpsInterval: null };

/**
 * Event listener for socket connection.
 * @type {function}
 * @returns {undefined}
*/
socket.on('connect', async function () {
  console.log('Connected to Server');
});

/**
 * Event listener for data transfer to Global Blockchain.
 * @type {function}
 * @returns {undefined}
*/
socket.on('dataTransfer', () => {
  console.log('transferring data to Cloud');
  const data = getData(intervals);
  socket.emit('data',data);
});

/**
 * Event listener for socket disconnect.
 * @type {function}
 * @returns {undefined}
*/
socket.on('disconnect', function () {
  clearInterval(intervals.pingInterval);
  clearInterval(intervals.gpsInterval);
  console.log('Disconnect from server');
});

/**
 * Event listener for SIGINT signal.
 * @type {function}
 * @returns {undefined}
*/
process.on('SIGINT', _ => {
  socket.disconnect();
  process.exit();
});


console.log(getData(intervals));