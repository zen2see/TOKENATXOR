import { ethers } from 'hardhat'

async function main () {
  const aavegotchiDiamondAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d'
  const aavegotchiFacet = await ethers.getContractAt('contracts/Aavegotchi/facets/AavegotchiFacet.sol:AavegotchiFacet', aavegotchiDiamondAddress)
  const collateralFacet = await ethers.getContractAt('CollateralFacet', aavegotchiDiamondAddress)

  const diamondCreationBlock = 11516320
  const filter = collateralFacet.filters.IncreaseStake()
  const events: any = await collateralFacet.queryFilter(filter, diamondCreationBlock)
  for (const event of events) {
    console.log(event.args._tokenId.toString(), 'Amount increased:', event.args._stakeAmount.toString())
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
