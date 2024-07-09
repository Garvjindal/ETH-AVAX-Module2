const hre = require("hardhat");

async function main() {
  const initialBalance = 1;
  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initialBalance);
  await assessment.deployed();

  console.log(`A balance of ${initialBalance} ETH deployed to ${assessment.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
