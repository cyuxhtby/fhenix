import {task} from "hardhat/config";
import type {HardhatRuntimeEnvironment, TaskArguments} from "hardhat/types";

import {EncryptionTypes, FhenixClient} from "fhenixjs";

task("task:addCount")
  .addParam("amount", "Amount to add to the counter (plaintext number)")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    const { ethers, deployments } = hre;

    const Counter = await deployments.get("Counter");

    const signers = await ethers.getSigners();

    const counter = await ethers.getContractAt("Counter", Counter.address);

    console.log(`contract at: ${Counter.address}, for signer: ${signers[taskArguments.account].address}`);
    console.log(`got the number ${taskArguments.amount} to add`);

    console.log("getting FHE interaction instance...");
    const client = await FhenixClient.Create({provider: hre.network.provider });

    console.log(`encrypting the number ${taskArguments.amount}...`);
    const eAmount = client.encrypt(Number(taskArguments.amount), EncryptionTypes.uint32);
    console.log(`got encrypted amount`, eAmount);

    console.log(`connecting to counter...`);
    let counterConnection = counter.connect(signers[Number(taskArguments.account)]);
    console.log(`triggering the 'add' function in the contract with the encrypted number...`);

    let txHash: string;
    try {
      let tx = await counterConnection.add(
        eAmount,
        // {gasLimit: 1000000, gasPrice: 1000000000}
      );

      // txHash = tx.hash;
      // console.log("tx hash: ", txHash);
      // let receipt = await tx.wait();
      // console.log("receipt: ", receipt);
      // if (receipt?.status === 0) {
      //   throw Error(`Transaction failed!`)
      // }
    } catch (error) {
      console.log(`error: ${error}`);
      console.log("error.data:", error.data);
      // let tx = await ethersHh.provider.getTransaction(txHash!);
      // console.log(await getRevertReason(txHash!) );
      // console.log("tx:", tx);
      const revertData = error.data;
      console.log("revertData:", revertData);
      const decodedError = counter.interface.parseError(revertData);
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
