const Web3 = require('web3');

const providerUrl = 'http://localhost:8501'; 
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

async function getAccounts() {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log('Accounts:', accounts);
  } catch (error) {
    console.error('Error retrieving accounts:', error);
  }
}

getAccounts();
