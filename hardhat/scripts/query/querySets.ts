/* global ethers */
/* eslint-disable  prefer-const */
import { ethers } from "hardhat"

async function main () {
  let tokenatxorDiamondAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d'
  console.log(tokenatxorDiamondAddress)
  let itemsFacet = await ethers.getContractAt('contracts/Tokenatxor/facets/ItemsFacet.sol:ItemsFacet', tokenatxorDiamondAddress)
  // let set = await itemsFacet.getWearableSet(69)
  // console.log(set)
  const names = [
    'Godlike Sergey',
    'Apex Sergey',
    'Sushi Chef'
  ]
  let sets = await itemsFacet.getWearableSets()
  for(const[index, set] of sets.entries()) {
    if(names.includes(set.name)) {
    console.log(index, set)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

