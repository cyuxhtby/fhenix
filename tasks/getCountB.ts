import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import {FhenixClient, generatePermit} from "fhenixjs";

task("task:getCountB")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const Counter = await deployments.get("CounterB");

    const signers = await ethers.getSigners();

    const counter = await ethers.getContractAt("CounterB", Counter.address);

    console.log("skipping: creating FHE client...");
    console.log("skipping: generating permit...");

    console.log("connecting to contract");
    const counterConnection = counter.connect(signers[taskArguments.account]);

    console.log("getting count");
    const eAmount = await counterConnection.getCounter();

    console.log("skipping: unsealing result", eAmount);
    console.log("Current counter: ", eAmount);
  }
);
