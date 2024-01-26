// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

//error AdditionError();

contract CounterN {
    uint256 private counter;

    constructor() {
        counter = 789;
    }

    function add(uint256 value) public {
        counter += value;
        revert("AdditionError");
        //revert AdditionError();
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
