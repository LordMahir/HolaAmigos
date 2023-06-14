const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const { LOGGER } = require("./utils");
const connectBlockchain = require("./BLOCKCHAIN/web3");
const createWebServer = require("./WEB/server");

/**
 * Initializes the application by connecting to the database, blockchain, and starting web and WebSocket servers.
 */
async function main() {
  var time = Date.now() / 1000;

  // Connect to the blockchain
  // await connectBlockchain();

  // Start the web server
  await createWebServer();


  // Log the time taken to run all services
  LOGGER(3, `[ DAPP ] Time taken to run all services ${Date.now() / 1000 - time}s`);
}

// Call the main function to start the application
main();
