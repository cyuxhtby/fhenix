import {task} from "hardhat/config";
import {ethers} from "ethers";
import getRevertReason from "eth-revert-reason";
import type {HardhatRuntimeEnvironment, TaskArguments} from "hardhat/types";

task("task:addCountBalance")
  .addParam("amount", "Amount to add to the counter (plaintext number)")
  .addParam("account", "Specify which account [0, 9]")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    const { ethers: ethersHh, deployments } = hre;

    const Counter = await deployments.get("CounterB");

    const signers = await ethersHh.getSigners();

    const counter = await ethersHh.getContractAt("CounterB", Counter.address);

    console.log(`contract at: ${Counter.address}, for signer: ${signers[taskArguments.account].address}`);
    console.log(`got the number ${taskArguments.amount} to add`);

    console.log(`connecting to counter...`);
    let counterConnection = counter.connect(signers[Number(taskArguments.account)]);
    console.log(`triggering the 'addBalance' function in the contract with the value...`);

    let txHash: string;
    try {
      let tx = await counterConnection.addBalance(
        taskArguments.amount,
        // {gasLimit: 1000000, gasPrice: 1000000000}
      );

      console.log("returned from contract method");
      txHash = tx.hash;
      console.log("tx hash: ", txHash);
      let receipt = await tx.wait();
      console.log("receipt: ", receipt);
      if (receipt?.status === 0) {
        throw Error(`Transaction failed! checked status`)
      }
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
    }
  }
);
