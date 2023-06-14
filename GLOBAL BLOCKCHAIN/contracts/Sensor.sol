// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Sensor {
    event Message(string message);
    struct sensor {
        string iotId;
        string companyId;
    }
    sensor[] public sensors;
    mapping(string => uint256) public sensor_finder;

    function storeIOT(
        string memory _iotId,
        string memory _companyId
    ) public {
        sensors.push(
            sensor(_iotId, _companyId)
        );
        sensor_finder[_iotId] = sensors.length;
        emit Message("IOT details successfully stored");
    }

    function deleteIOT(
        string memory _iotId,
        string memory _companyId
    ) public {
        uint256 index = sensor_finder[_iotId];
        if (index == 0) {
            emit Message("IOT doesn't exists");
            return;
        }
        if (
            keccak256(bytes(sensors[index - 1].companyId)) !=
            keccak256(bytes(_companyId))
        ) {
            emit Message(
                "IOT Id does not belong to specified company Id"
            );
            return;
        }

        sensors[index - 1] = sensor("", "");
        delete sensor_finder[_iotId];
        emit Message("IOT details successfully deleted");
    }

    function getIOts(string memory _companyId)
        public
        view
        returns (sensor[] memory)
    {
        uint256[] memory resultIndices = new uint256[](sensors.length);
        uint256 count = 0;
        for (uint256 i = 0; i < sensors.length; i++) {
            if (
                keccak256(bytes(sensors[i].companyId)) ==
                keccak256(bytes(_companyId))
            ) {
                resultIndices[count] = i;
                count++;
            }
        }
        sensor[] memory result = new sensor[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = sensors[resultIndices[i]];
        }
        return result;
    }
}
