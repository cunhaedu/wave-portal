// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    struct Wave {
        uint256 id;
        uint256 date;
        string message;
        address owner;
    }

    mapping(uint256 => Wave) public waves;

    uint256 totalWaves;

    constructor() {
        console.log("Yo yo, I am the wave portal smart contract!");
    }

    function wave(string memory _message) external {
        waves[totalWaves] = Wave(
            totalWaves,
            block.timestamp,
            _message,
            msg.sender
        );

        totalWaves++;

        console.log("%s has waved!", msg.sender);
    }

    function getWaves() external view returns (Wave[] memory) {
        Wave[] memory _waves = new Wave[](totalWaves);

        for (uint256 i = 0; i < totalWaves; i++) {
            _waves[i] = waves[i];
        }

        return _waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
