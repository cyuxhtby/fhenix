import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import {FhenixClient, generatePermit} from "fhenixjs";

task("task:getCount")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments } = hre;

    const Counter = await deployments.get("Counter");

    const signers = await ethers.getSigners();

    const counter = await ethers.getContractAt("Counter", Counter.address);

    console.log("creating FHE client...");
    const client = await FhenixClient.Create({provider: hre.ethers.provider });

    console.log("generating permit...");
    const permit = await generatePermit(Counter.address, hre.ethers.provider);

    console.log("connecting to contract");
    const counterConnection = counter.connect(signers[taskArguments.account]);

    console.log("getting count");
    const eAmount = await counterConnection.getCounter("0x" + permit.sealingKey.publicKey);

    console.log("got count: ", eAmount);
    const amount = permit.sealingKey.unseal(eAmount);
    console.log("Current counter: ", amount);
  });
