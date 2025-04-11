const hre = require("hardhat");

async function main() {
  const FIR = await hre.ethers.getContractFactory("FIRSystem");
  const deployedContract = await FIR.deploy(); // Pass constructor arguments if required

  await deployedContract.deploymentTransaction()?.wait();

  console.log(`FIR contract deployed to: ${deployedContract.target}`);
}

main().catch((error) => {
  console.error("Error in deployment:", error);
  process.exitCode = 1;
});
