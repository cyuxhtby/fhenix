import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  console.log("deploying");

  try {
    let tx = await deploy("Lottery", {
      from: deployer,
      args: [],
      log: true,
      skipIfAlreadyDeployed: false,
      // gasLimit: 1000000000,
      // gasPrice: "1000000000",
    });
    // console.log("tx:", tx);
  } catch (e) {
    console.log(`\n\nerror! ${e}`);
    // if (`${e}`.includes("nonce")) {
    //   console.log("nonce problem, trying again");
    //   // find last occurence of ": " in e and get the number that comes after
    //   const match = `${e}`.match(/state: (\d+)/);
    //   let stateNonce;
    //   if (match) {
    //     stateNonce = parseInt(match[1]);
    //   } else {
    //     const signers = await hre.ethers.getSigners();
    //     const mysigner = signers[0];
    //     console.log("my signer:", mysigner.address);
    //     stateNonce = await signers[0].provider.getTransactionCount(signers[0].address);
    //     console.log("got nonce:", stateNonce);
    //   }
    //
    //   if (stateNonce === null) {
    //     throw new Error("Could not find nonce in error");
    //   }
    //
    //   await deploy("Counter", {
    //     from: deployer,
    //     args: [],
    //     log: true,
    //     skipIfAlreadyDeployed: false,
    //     nonce: stateNonce,
    //   });
    // }
  }
};

export default func;
func.id = "deploy_counter";
func.tags = ["Counter"];
