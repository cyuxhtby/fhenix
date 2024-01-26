import {task} from "hardhat/config";
import type {HardhatRuntimeEnvironment, TaskArguments} from "hardhat/types";

import {EncryptionTypes, FhenixClient} from "fhenixjs";

task("task:addTest")
  .addParam("account", "Specify which account [0, 9]", "0")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    const { ethers, deployments } = hre;

    const AddTest = await deployments.get("AddTest");
    // console.log("got contract AddTest: ", AddTest);

    const signers = await ethers.getSigners();

    const addTest = await ethers.getContractAt("AddTest", AddTest.address);

    console.log(`contract at: ${AddTest.address}, for signer: ${signers[taskArguments.account].address}`);

    // console.log("getting FHE interaction instance...");
    // const client = await FhenixClient.Create({provider: hre.network.provider });

    // console.log(`encrypting the number 12...`);
    // const eAmountA = client.encrypt(12, EncryptionTypes.uint32);
    //
    // console.log(`encrypting the number 41...`);
    // const eAmountB = client.encrypt(41, EncryptionTypes.uint32);
    // console.log(`got encrypted amount`, eAmountB);

    console.log(`connecting to counter...`);
    let contractConnection = addTest.connect(signers[Number(taskArguments.account)]);
    console.log(`triggering the 'add' function in the test contract...`);

    let txHash: string;
    try {
      let result = await contractConnection.add(
        "add(euint32,euint32)",
        BigInt(42),
        BigInt(12),
        // {gasLimit: 1000000, gasPrice: 1000000000}
      );
      console.log("added 42 and 12, result: ", result);

      // txHash = tx.hash;
      // console.log("tx hash: ", txHash);
      // let receipt = await tx.wait();
      // console.log("receipt: ", receipt);
      // if (receipt?.status === 0) {
      //   throw Error(`Transaction failed!`)
      // }
    } catch (error) {
      console.log(`error: ${error}`);
      console.log(`error:`, JSON.stringify(error));
      console.log("error.data:", error.data);
      // let tx = await ethersHh.provider.getTransaction(txHash!);
      // console.log(await getRevertReason(txHash!) );
      // console.log("tx:", tx);
      const revertData = error.data;
      console.log("revertData:", revertData);
      const decodedError = addTest.interface.parseError(revertData);
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

    console.log("done!");
  });
