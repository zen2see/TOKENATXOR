import { ethers } from 'hardhat'
import '@nomiclabs/hardhat-ethers'
import { TransactionResponse } from '@ethersproject/abstract-provider';

const hre = require('hardhat');
const diamond = require('./diamond-util/index.ts');
// const { tokenatxorSvgs } = require('../svgs/tokenatxor.ts')
// const { equippablesSvgs } = require('../svgs/equippables.ts')
// const { collateralsSvgs } = require('../svgs/collaterals.ts')
// const { expressionSvgs } = require('../svgs/expression.ts')
// const { equippableSets } = require('./equippableSets.ts')

function addCommas (nStr) {
  nStr += ''
  const x = nStr.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? '.' + x[1] : ''
  var rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  }
  return x1 + x2
}

function strDisplay (str) {
  return addCommas(str.toString())
}

async function main (scriptName?: string) {
  console.log('SCRIPT NAME:', scriptName)
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()
  const secondAccount = await accounts[1].getAddress()
  console.log('Account: ' + account)
  console.log('--')
  let tx2: TransactionResponse
  let totalGasUsed = ethers.BigNumber.from('0')
  let receipt
  let vrfCoordinator
  let linkAddress
  let linkContract
  let keyHash
  let fee
  let initialProductionSize
  let tktrTokenContract // '0x176d1E71b0D795315f77E53Af6D97f03938EABc4' GENERATXORdiamond 0x6714193F40dC748A4AAa76A7608F7a210B5A2324
  let dao
  let daoTreasury
  let rarityFarming
  let artists
  let childChainManager
  let tktrStakingDiamond
  let itemManagers
  const gasLimit = 32300000
  const portalPrice = ethers.utils.parseEther('100')
  const name = 'Tokenatxor'
  const symbol = 'TKTR'

  if (hre.network.name === 'hardhat') {
    childChainManager = account
    //InitDiamond = account
    // const LinkTokenMock = await ethers.getContractFactory('LinkTokenMock')
    // linkContract = await LinkTokenMock.deploy()
    // await linkContract.deployed()
    // linkAddress = linkContract.address
    // keyHash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
    // fee = ethers.utils.parseEther('0.0001')
    
  } else if (hre.network.name === 'matic') {
    // childChainManager = '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa'
    // vrfCoordinator = '0x3d2341ADb2D31f1c5530cDC622016af293177AE0'
    // linkAddress = '0xb0897686c545045aFc77CF20eC7A532E3120E0F1'
    // keyHash = '0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da'
    // fee = ethers.utils.parseEther('0.0001')
    
    // Matic tktr token address
    // tktrTokenContract = await ethers.getContractAt('GHSTFacet', '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7')
    // tktrStakingDiamond = '0xA02d547512Bb90002807499F05495Fe9C4C3943f'

    // dao = 'todo' // await accounts[1].getAddress()
    // daoTreasury = 'todo'
    // rarityFarming = 'todo' // await accounts[2].getAddress()
    // artists = 'todo' // await accounts[3].getAddress()
  } else if (hre.network.name === 'Arbitrum') {
    childChainManager = account

  } else if (hre.network.name === 'kovan') {
    childChainManager = account
    vrfCoordinator = '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9'
    linkAddress = '0xa36085F69e2889c224210F603D836748e7dC0088'
    keyHash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
    fee = ethers.utils.parseEther('0.1')
    initialProductionSize = '10000'
    //tktrTokenContract = await ethers.getContractAt('TKTRFacet', '0xAD2BA5a52DC26E8213Eceff3a04f21462F20b0E5')
    //tktrStakingDiamond = '0xA4fF399Aa1BB21aBdd3FC689f46CCE0729d58DEd'  
    dao = account // 'todo' // await accounts[1].getAddress()
    daoTreasury = account
    rarityFarming = account // 'todo' // await accounts[2].getAddress()
    artists = account // 'todo' // await accounts[3].getAddress()
    itemManagers = [account] // 'todo'
  }  else {
    throw Error('No network settings for ' + hre.network.name)
  }

  // deploy.ts script deploy()
  async function deployFacets (...facets) {
    const instances = Array()
    for (let facet of facets) {
      let constructorArgs = Array()
      if (Array.isArray(facet)) {
        ;[facet, constructorArgs] = facet;
      }
      console.log('After deployFacets in deploy script the constructorArgs are: [' + constructorArgs + ']')
      const factory = await ethers.getContractFactory(facet)
      const facetInstance = await factory.deploy(...constructorArgs)
      await facetInstance.deployed()
      tx2 = facetInstance.deployTransaction
      const receipt = await tx2.wait()
      console.log(`${facet} deploy gas used: ` + strDisplay(receipt.gasUsed))
      totalGasUsed = totalGasUsed.add(receipt.gasUsed)
      instances.push(facetInstance)
    }
    return instances
  }

  let [
    tokenatxorFacet
  ] = await deployFacets(
    'contracts/tokenatxor/facets/TokenatxorFacet.sol:TokenatxorFacet'
  )
  
  tktrTokenContract = await diamond.deploy({
    diamondName: 'TKTRDiamond',
    initDiamond: 'contracts/TKTR/InitDiamond.sol:InitDiamond',
    facets: [
      'TKTRFacet'
    ],
    owner: account
  })
  
  tktrTokenContract = await ethers.getContractAt('TKTRFacet', tktrTokenContract.address)
  console.log('TKTR diamond address: ' + tktrTokenContract.address)

  const tokenatxorDiamond = await diamond.deploy({
    diamondName: 'TokenatxorDiamond',
    initDiamond: 'contracts/Tokenatxor/InitDiamond.sol:InitDiamond',
    facets: [
      ['TokenatxorFacet', tokenatxorFacet]
    ],
    owner: account, 
    args: [[tktrTokenContract.address, name, symbol]]
  })
  console.log('Tokenatxor diamond address: ' + tokenatxorDiamond.address)
  const tx3 = tokenatxorDiamond.deployTransaction
  receipt = await tx3.wait()
  console.log('Tokenatxor diamond deploy gas used: ' + strDisplay(receipt.gasUsed))
  totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  //TXTR contract mint
  // const TktrTokenContract = await ethers.getContractFactory('TKTRFacet')
  // tktrTokenContract = await TktrTokenContract.deploy()
  // await tktrTokenContract.deployed()
  //await tktrTokenContract.mintTo()
  //tktrFacet = await ethers.getContractAt('contracts/TXTR/facets/TXTRFacet.sol:TXTRFacet', txtrFacet)
  // tx = await txtrFacet.mint()
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //    throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log("RECEIPT IS: " + receipt)
  // console.log('Mint() run')

  // Get name and symbol
  tokenatxorFacet = await ethers.getContractAt('contracts/tokenatxor/facets/TokenatxorFacet.sol:TokenatxorFacet', tokenatxorDiamond.address)
  tx2 = await tokenatxorFacet.name()
  receipt = await tx2.wait()
  if (!receipt.status) {
     throw Error(`Error:: ${tx2.hash}`)
  }
  console.log("RECEIPT IS: " + receipt)
  console.log('NAME IS: ' + name)
  const diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', tokenatxorDiamond.address)
  
  // // if (hre.network.name === 'matic') {
  //   // transfer ownership
  //   const newOwner = '0x94cb5C277FCC64C274Bd30847f0821077B231022'
  //   console.log('Transferring ownership of diamond: ' + generatxorDiamond.address)
  //   const diamond = await ethers.getContractAt('OwnershipFacet', generatxorDiamond.address)
  //   const tx = await diamond.transferOwnership(newOwner)
  //   console.log('Transaction hash: ' + tx.hash)
  //   receipt = await tx.wait()
  //   console.log('Transfer Transaction complete')
  //   console.log('Gas used:' + strDisplay(receipt.gasUsed))
  //   totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // // }

  console.log('Total gas used: ' + strDisplay(totalGasUsed))
  return {
    account: account,
    tokenatxorDiamond: tokenatxorDiamond,
    diamondLoupeFacet: diamondLoupeFacet,
    tktrTokenContract: tktrTokenContract,
    tokentatxorFacet: tokenatxorFacet,
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { main as deployProject }
