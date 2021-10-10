/* global ethers hre */
import { ethers } from "hardhat"

async function main () {
  const tokenatxorDiamondAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d'
  let diamond
  diamond = await ethers.getContractAt('CollateralFacet', tokenatxorDiamondAddress)
  let result
  result = await diamond.collateralInfo(0)
  console.log(result)
  result = await diamond.collateralInfo(1)
  console.log(result)
  result = await diamond.collateralInfo(2)
  console.log(result)
  result = await diamond.collateralInfo(3)
  console.log(result)
  result = await diamond.collateralInfo(4)
  console.log(result)
  result = await diamond.collateralInfo(5)
  console.log(result)
  result = await diamond.collateralInfo(6)
  console.log(result)
  result = await diamond.collateralInfo(7)
  console.log(result)
  result = await diamond.collateralInfo(8)
  console.log(result)
  result = await diamond.collateralInfo(9)
  console.log(result)
  result = await diamond.collateralInfo(10)
  console.log(result)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
