// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Store {
    event Message(string message);
    struct SensorData {
        uint timestamp;
        string iotId;
        string data;
    }
    SensorData[] public sensorDataChain;
    mapping(string => uint256) public data_finder;

    function storeData(
        string memory _iotId,
        string memory _data
    ) public {
        sensorDataChain.push(
            SensorData(block.timestamp,_iotId, _data)
        );
        data_finder[_iotId] = sensorDataChain.length;
        emit Message("Sensor data successfully stored");
    }

    function getSensorData(
    ) public view returns (uint, string memory, string memory) {
        uint256 index = sensorDataChain.length - 1;

        SensorData memory data = sensorDataChain[index];
        return (data.timestamp, data.iotId, data.data);
    }
                
}
