/* global ethers */
/* eslint-disable  prefer-const */
import { ethers } from "hardhat"

async function main () {
  // let tokenatxorDiamondAddress = '0xd0576c4371bBb9e531700898760B0064237832Ee'
  let tokenatxorDiamondAddress = '0x86935F11C86623deC8a25696E1C19a8659CbF95d'
  console.log(tokenatxorDiamondAddress)
  let svgFacet = await ethers.getContractAt('SvgFacet', tokenatxorDiamondAddress)
  // let tokenatxor = await svgFacet.gettokenatxorSvg(4685)
  // let tokenatxor = await svgFacet.gettokenatxorSvg(3564)
  // pajamas:
  // let tokenatxor = await svgFacet.gettokenatxorSvg(8120)
  // aagent
  // let tokenatxor = await svgFacet.gettokenatxorSvg(9887)
  // uni eyes  5795
  // hawwain shirt
  let tokenatxor = await svgFacet.getItemSvg(174)
  console.log(tokenatxor)
  // 11 = robe
  // 13 = aagent shirt
  // let svgs = await svgFacet.getSvgs(ethers.utils.formatBytes32String('sleeves'), [27])
  // let count = 0
  // for (const svg of svgs) {
  //   console.log(count)
  //   console.log(svg)
  //   count++
  //   console.log('  -   ')
  // }
  // let tokenatxor = await svgFacet.gettokenatxorSvg(7274)
  // console.log(tokenatxor)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
