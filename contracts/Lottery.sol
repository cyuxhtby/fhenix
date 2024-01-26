// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity >=0.8.13 <0.9.0;

import "@fhenixprotocol/contracts/FHE.sol";
//import "./lib/FHE.sol";

contract Lottery {
    euint8 private winningNumber;

    uint ticketCount;
    uint256 prize;

    event LotteryWon(address winner, uint256 prize);
    event LotteryTicketBought();

    constructor(inEuint8 calldata initialRandom) {
        contractKey = FHE.asEuint8(initialRandom);
        winningNumber = FHE.asEuint8(initialRandom);
    }

    function buyTicket(inEuint8 calldata encryptedGuess) public payable {
        require(msg.value > 1, "insufficient payment: a ticket costs 1 fhe");

        euint8 guess = FHE.asEuint8(encryptedGuess);

        // mix guess with winning number:
        winningNumber = winningNumber.xor(guess);

        // add message value to prize:
        prize += msg.value;
        ticketCount += 1;

        lastPlayer = msg.sender;

        FHE.sealoutput()
    }

    // should be called by the admin after every ticket purchase
    function checkTicket(inEuint8 calldata encryptedGuess) public payable {
        // todo only admin, or only after admin finalized the lottery
        // check if guess is correct:
        if (FHE.decrypt(winningNumber.eq(encryptedGuess)) == 1) {
            // send prize to winner:
            payable(lastPlayer).transfer(prize);
            prize = 0;
            ticketCount = 0;
            emit LotteryWon(msg.sender, prize);
        } else {
            emit LotteryTicketBought();
        }
    }
}
