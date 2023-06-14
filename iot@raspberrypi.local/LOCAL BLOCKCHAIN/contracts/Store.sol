// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Store {
    event Message(string message);
    struct SensorData {
        uint timestamp;
        string iotID;
        string data;
    }
    SensorData[] public sensorDataChain;
    mapping(string => uint256) public data_finder;

    function storeSensor(
        string memory _iotID,
        string memory _data
    ) public {
        sensorDataChain.push(
            SensorData(block.timestamp,_iotID, _data)
        );
        data_finder[_iotID] = sensorDataChain.length;
        emit Message("Sensor data successfully stored");
    }

    function getSensorData(
        uint index
    ) public view returns (uint, string memory, string memory) {
        require(index < sensorDataChain.length, "Index out of range");
        SensorData memory data = sensorDataChain[index];
        return (data.timestamp, data.iotID, data.data);
    }
  
}
