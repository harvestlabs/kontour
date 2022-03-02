// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Bounty.sol";

contract Machine {
    using SafeMath for uint256;
    address public owner = msg.sender;

    event Create(address indexed configAddress, address indexed sender);

    function create(
        address payable _creatorWallet,
        uint256 _maxValue,
        uint8[] memory _bonusTargets,
        uint8[] memory _bonusPctYeasNeeded,
        uint8[] memory _bonusFailureThresholds,
        uint64 _mustBeClaimedTime,
        uint64 _timeLimit,
        address payable _owner
    ) public returns (address configAddress) {
        address config = address(
            new Bounty(
                _creatorWallet,
                _maxValue,
                _bonusTargets,
                _bonusPctYeasNeeded,
                _bonusFailureThresholds,
                _mustBeClaimedTime,
                _timeLimit,
                _owner
            )
        );
        emit Create(config, msg.sender);
        return config;
    }
}
