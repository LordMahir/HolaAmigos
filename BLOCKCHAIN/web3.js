/**
 * @module BLOCKCHAIN/Web3
 */
/**
 * @file Initializes connection to blockchain using Web3 API.
 * @author Rajat Bansal
 * @requires module:CONFIG/Contracts_abi
 * @requires module:Utils
 */

const Web3 = require("web3");
const { Store_ABI } = require("../config/contracts_abi");
const { commonStorage, LOGGER } = require("../utils");

/**
 * Connects to the blockchain using Web3 API
 * @async
 * @function
 * @name connectBlockchain
 * @returns {void}
*/
module.exports = async () => {
  const web3 = new Web3(`${process.env.blockchainHOST}:${process.env.blockchainPORT}`);
  // web3.eth.getAccounts : get account from Ethereum node, web3.eth.accounts is deprecated.
  var web3Accounts = await web3.eth.getAccounts();
  var account = web3Accounts[0];
  // creating new ethereum contracts
  const contracts = {
    storeContract: new web3.eth.Contract(
      Store_ABI, // stores functions in JSON format
      process.env.Store_ADDRESS // address for contract 
    ),
  };

  commonStorage.web3 = { account: account, contracts: contracts };
  LOGGER(2, '[ WEB3 ] Blockchain connected! ');
};
