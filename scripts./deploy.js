const { ethers } = require("hardhat");

async function main() {
  const BusRental = await ethers.getContractFactory("BusRental");
  const bicycleRental = await BusRental.deploy();
  await bicycleRental.deployed();

  console.log(`BusRental deployed to: ${bicycleRental.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
