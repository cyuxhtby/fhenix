// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

contract DataStore is Permissioned {
    mapping(address user => bytes32 encData) public userData;

    event DataStored(address indexed user, bytes32 dataHash);

    error Unauthorized();

    function storeEncData(address user, bytes32 encData) public {
        if (msg.sender != user) {
            revert Unauthorized();
        }
        userData[user] = encData;
        emit DataStored(user, encData);
    }

    function retrieveData(
        address user,
        Permission calldata permission
    ) public view onlySender(permission) returns (bytes memory) {
        if (msg.sender != user) {
            revert Unauthorized();
        }
        return FHE.sealoutput(userData[user], permission.publicKey);
    }
}
