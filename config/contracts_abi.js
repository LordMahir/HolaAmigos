/**
 * @module CONFIG/Contracts_abi
 */

// The ABI defines the functions, variables, and events that are part of the smart contract, as well as their data types and order. 
const Store_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "Message",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "sensor_finder",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "sensors",
    "outputs": [
      {
        "internalType": "string",
        "name": "registrationId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "companyId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "initV",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "sensorId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "sensorLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "sensorType",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_registrationId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_companyId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_key",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_initV",
        "type": "string"
      }
    ],
    "name": "storeSensor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_registrationId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sensorId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sensorLocation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sensorType",
        "type": "string"
      }
    ],
    "name": "updateSensor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_registrationId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_companyId",
        "type": "string"
      }
    ],
    "name": "deleteSensor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_companyId",
        "type": "string"
      }
    ],
    "name": "getSensors",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "registrationId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "companyId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "key",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "initV",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "sensorId",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "sensorLocation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "sensorType",
            "type": "string"
          }
        ],
        "internalType": "struct Sensor.sensor[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

module.exports = {
  Store_ABI,
};
