import { ethers } from 'hardhat'
const { LedgerSigner } = require("@ethersproject/hardware-wallets");
const {
  addTokenxtrMinimal,
// @ts-ignore
} = require("./upgrades/upgrade-tokenIdsWithWisdom");

async function main(this: any) {
  this.timeout = 20000000;
  console.log("adding new function");
  await addTokenxtrMinimal();
  const diamondAddress = "0x86935F11C86623deC8a25696E1C19a8659CbF95d";
  const gameFacet = await ethers.getContractAt(
    "TokenatxorGameFacet",
    diamondAddress
  );
  const minimalDetails = await gameFacet.tokenIdsWithWisdom(
    "0x4e7bf3694962fc482a16d60fd78f99db9c4c52b0"
  );
  console.log(minimalDetails);
}

if (require.main === module) {
  main()
    .then(() => process.exit())
    .catch((error) => {
      console.error(error);
    });
}
