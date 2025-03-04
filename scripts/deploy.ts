import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const billingSystem = await ethers.deployContract("BillingSystem");

  await billingSystem.waitForDeployment();

  console.log("BillingSystem deployed to:", await billingSystem.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });