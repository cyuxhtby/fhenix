// Copyright 2021-2022, Offchain Labs, Inc.
// For license information, see https://github.com/OffchainLabs/nitro-contracts/blob/main/LICENSE
// SPDX-License-Identifier: BUSL-1.1

pragma solidity >=0.8.13 <0.9.0;

/// @title Lookup for basic info about accounts and contracts.
/// @notice Precompiled contract that exists in every Arbitrum chain at 0x0000000000000000000000000000000000000065.
interface ArbInfo {
    /// @notice Retrieves an account's balance
    function getBalance(address account) external view returns (uint256);

    /// @notice Retrieves a contract's deployed code
    function getCode(address account) external view returns (bytes memory);
}

contract CounterB {
    uint256 private counter;

    constructor() {
        counter = 789;
    }

    function addBad(uint256 value) public {
        counter += value;
        revert("AdditionError");
        //revert AdditionError();
    }

    function addBalance(uint256 value) public {
        ArbInfo info = ArbInfo(address(0x65));
        uint256 balance = info.getBalance(msg.sender);
        counter += balance + value;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
