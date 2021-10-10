/* global ethers */
/* eslint-disable  prefer-const */
import { ethers } from "hardhat"

async function main () {
  let tokenatxorDiamondAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d'
  console.log(tokenatxorDiamondAddress)
  let itemsFacet = await ethers.getContractAt('contracts/Tokenatxor/facets/ItemsFacet.sol:ItemsFacet', tokenatxorDiamondAddress)
  let item = await itemsFacet.getItemType(70)
  console.log(item.totalQuantity.toString())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

