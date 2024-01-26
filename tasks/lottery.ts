import {task} from "hardhat/config";
import type {HardhatRuntimeEnvironment, TaskArguments} from "hardhat/types";

import {EncryptionTypes, FhenixClient} from "fhenixjs";

task("task:lottery")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    taskArguments.account = 0;
    const { ethers, deployments } = hre;

    const Lottery = await deployments.get("Lottery");

    const signers = await ethers.getSigners();
    const lottery = await ethers.getContractAt("Lottery", Lottery.address);

    console.log(`contract at: ${Lottery.address}, for signer: ${signers[taskArguments.account].address}`);

    const isInTest = typeof global?.it === "function";
    console.log("isInTest:", isInTest);
    console.log("getting FHE interaction instance...");
    const client = new FhenixClient({});

    let currentGuess = 123;
    // await new Promise(r => setTimeout(r, 1000));
    // while ((await client.fhePublicKey) === undefined) {
    //   console.log("waiting for FHE public key...");
    //   await new Promise(r => setTimeout(r, 1000));
    // }
    console.log(`encrypting the number ${currentGuess}...`);
    const eAmount = await client.encrypt(currentGuess, EncryptionTypes.uint32);
    console.log(`got encrypted amount`, eAmount);

    console.log(`connecting to lottery...`);
    let counterConnection = lottery.connect(signers[Number(taskArguments.account)]);
    console.log(`triggering the 'add' function in the contract with the encrypted number...`);

    let txHash: string;
    try {
      let tx = await counterConnection.buyTicket(
        eAmount,
        // {gasLimit: 1000000, gasPrice: 1000000000}
      );

      txHash = tx.hash;
      console.log("tx hash: ", txHash);
      let receipt = await tx.wait();
      console.log("receipt: ", receipt);
      if (receipt?.status === 0) {
        throw Error(`Transaction failed!`)
      }
    } catch (error) {
      console.log(`error: ${error}`);
      console.log("error.data:", error.data);
      // let tx = await ethersHh.provider.getTransaction(txHash!);
      // console.log(await getRevertReason(txHash!) );
      // console.log("tx:", tx);
      const revertData = error.data;
      console.log("revertData:", revertData);
      const decodedError = lottery.interface.parseError(revertData);
      console.log("ERROR: ", decodedError);

      // As a workaround, we have a function with the
      // same name and parameters as the error in the abi.
      const abi = [
        'function AdditionError()',
      ]

      const int = new ethers.Interface(abi)

      const decoded = int.decodeFunctionData(
        "AdditionError",
        revertData
      )

      console.log("decoded: ", decoded);
    }

    console.log(`Added ${taskArguments.amount} to counter!`);
  });
