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
  // const secondAccount = await accounts[1].getAddress()
  console.log('Account: ' + account)
  console.log('--')
  let tx: TransactionResponse
  let totalGasUsed = ethers.BigNumber.from('0')
  let receipt
  let vrfCoordinator
  let linkAddress
  let linkContract
  let keyHash
  let fee
  let initialProductionSize
  let tktrTokenContract // '0x176d1E71b0D795315f77E53Af6D97f03938EABc4' TOKENATXORdiamond 0x6714193F40dC748A4AAa76A7608F7a210B5A2324
  let dao
  let daoTreasury
  let rarityFarming
  let artists
  let childChainManager
  let tktrStakingDiamond
  let itemManagers
  const gasLimit = 32300000
  const productionPrice = ethers.utils.parseEther('100')
  const name = 'Tokenatxor'
  const symbol = 'TOKENTXR'

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
    tktrTokenContract = await ethers.getContractAt('TKTRFacet', '0xF086813fc5A4d41E6fFcc509eb4004B82AEae082')
    //tktrStakingDiamond = '0xA4fF399Aa1BB21aBdd3FC689f46CCE0729d58DEd'  
    dao = account // 'todo' // await accounts[1].getAddress()
    daoTreasury = account
    //rarityFarming = account // 'todo' // await accounts[2].getAddress()
    //artists = account // 'todo' // await accounts[3].getAddress()
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
      tx = facetInstance.deployTransaction
      const receipt = await tx.wait()
      console.log(`${facet} deploy gas used: ` + strDisplay(receipt.gasUsed))
      totalGasUsed = totalGasUsed.add(receipt.gasUsed)
      instances.push(facetInstance)
    }
    return instances
  }

  let [
    bridgeFacet,
    tokenatxorFacet,
    tokenatxorGameFacet,
    // svgFacet,
    // itemsFacet,
    // itemsTransferFacet,
    // collateralFacet,
    // daoFacet,
    // vrfFacet,
    // shopFacet,
    // metaTransactionsFacet,
    // erc1155MarketplaceFacet,
    // erc721MarketplaceFacet,
    // escrowFacet
  ] = await deployFacets(
    'contracts/Tokenatxor/facets/BridgeFacet.sol:BridgeFacet',
    'contracts/Tokenatxor/facets/TokenatxorFacet.sol:TokenatxorFacet',
    'TokenatxorGameFacet',
    // 'SvgFacet',
    // 'contracts/Tokenatxor/facets/ItemsFacet.sol:ItemsFacet',
    // 'ItemsTransferFacet',
    // 'CollaterFacet',
    // 'DAOFacet',
    // 'VrfFacet',
    // 'ShopFacet',
    // 'MetaTransactionsFacet',
    // 'ERC1155MarketplaceFacet',
    // 'ERC721MarketplaceFacet',
    // 'EscrowFacet'
  )
  // CONTRACT ADDRESS NOW KNOWN
  // tktrTokenContract = await diamond.deploy({
  //   diamondName: 'TKTRDiamond',
  //   initDiamond: 'contracts/TKTR/InitDiamond.sol:InitDiamond',
  //   facets: [
  //     'TKTRFacet'
  //   ],
  //   owner: account
  // })
  // tktrTokenContract = await ethers.getContractAt('TKTRFacet', tktrTokenContract.address)
  // console.log('TKTR diamond address: ' + tktrTokenContract.address)

  const tokenatxorDiamond = await diamond.deploy({
    diamondName: 'TokenatxorDiamond',
    initDiamond: 'contracts/Tokenatxor/InitDiamond.sol:InitDiamond',
    facets: [
      ['BridgeFacet', bridgeFacet],
      ['TokenatxorFacet', tokenatxorFacet],
      ['TokenatxorGameFacet', tokenatxorGameFacet],
      // ['SvgFacet', svgFacet],
      // ['ItemsFacet', itemsFacet],
      // ['ItemsTransferFacet', itemsTransferFacet],
      // ['CollateralFacet', collateralFacet],
      // ['DAOFacet', daoFacet],
      // ['VrfFacet', vrfFacet],
      // ['ShopFacet', shopFacet],
      // ['MetaTransactionsFacet', metaTransactionsFacet],
      // ['ERC1155MarketplaceFacet', erc1155MarketplaceFacet],
      // ['ERC721MarketplaceFacet', erc721MarketplaceFacet],
      // ['EscrowFacet', escrowFacet]
    ],
    owner: account, 
    args: [[dao, daoTreasury, artists, rarityFarming, tktrTokenContract.address, keyHash, fee, vrfCoordinator, linkAddress, childChainManager,  name, symbol]]
  })
  console.log('Tokenatxor diamond address: ' + tokenatxorDiamond.address)

  tx = tokenatxorDiamond.deployTransaction
  receipt = await tx.wait()
  console.log('Tokenatxor diamond deploy gas used: ' + strDisplay(receipt.gasUsed))
  totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // create first production
  // daoFacet = await ethers.getContractAt('DAOFacet', tokenatxorDiamond.address)
  // tx = await daoFacet.createProduction(initialProductionSize, productionPrice, '0x000000')
  // receipt = await tx.wait()
  // console.log('Production created: ' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.getUsed)

  // receipt = await tx.wait()
  // console.log('Tokenatxor diamond deploy gas used: ' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  const diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', tokenatxorDiamond.address)
  //vrfFacet = await ethers.getContractAt('VrfFacet', tokenatxorDiamond.address)
  tokenatxorFacet = await ethers.getContractAt('contracts/Tokenatxor/facets/TokenatxorFacet.sol:TokenatxorFacet', tokenatxorDiamond.address)
  tokenatxorGameFacet = await ethers.getContractAt('TokenatxorGameFacet', tokenatxorDiamond.address)
  // collateralFacet = await ethers.getContractAt('CollateralFacet', tokenatxorDiamond.address)
  // shopFacet = await ethers.getContractAt('ShopFacet', tokenatxorDiamond.address)
  // erc1155MarketplaceFacet = await ethers.getContractAt('ERC1155MarketplaceFacet', tokenatxorDiamond.address)
  // erc721MarketplaceFacet = await ethers.getContractAt('ERC721MarketplaceFacet', tokenatxorDiamond.address)
  // escrowFacet = await ethers.getContractAt('EscrowFacet', tokenatxorDiamond.address)
  bridgeFacet = await ethers.getContractAt('contracts/Tokenatxor/facets/BridgeFacet.sol:BridgeFacet', tokenatxorDiamond.address)

  // Add collateral info
  console.log('Adding Collateral Types')
  if (hre.network.name === 'hardhat') {
    // const { getCollaterals } = require('./collateralTypes.ts')
    const { getCollaterals } = require('./testCollateralTypes.ts')
    //tx = await daoFacet.addCollateralTypes(getCollaterals(hre.network.name, tktrTokenContract.address))
  } else if (hre.network.name === 'mumbai') {
    // const { getCollaterals } = require('./collateralTypes.ts')
    const { getCollaterals } = require('./testCollateralTypes.ts')
    //tx = await daoFacet.addCollateralTypes(getCollaterals(hre.network.name, tktrTokenContract.address))
  } else {
    const { getCollaterals } = require('./collateralTypes.ts')
    //tx = await daoFacet.addCollateralTypes(getCollaterals(hre.network.name, tktrTokenContract.address))
  }
  receipt = await tx.wait()
  console.log('Adding Collateral Types gas used::' + strDisplay(receipt.gasUsed))
  totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  console.log('Adding item managers')
  //tx = await daoFacet.addItemManagers(itemManagers)
  console.log('Adding item managers tx:', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Adding item manager failed: ${tx.hash}`)
  }
  console.log('Adding ticket categories')

  //tx = await daoFacet.addItemManagers(itemManagers)
  console.log('Adding item managers tx:', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Adding item manager failed: ${tx.hash}`)
  }

  // adding type categories
  // const ticketCategories = Array()
  // for (let i = 0; i < 6; i++) {
  //   ticketCategories.push({
  //     erc1155TokenAddress: tktrStakingDiamond,
  //     erc1155TypeId: i,
  //     category: 3
  //   })
  // }
  // tx = await erc1155MarketplaceFacet.setERC1155Categories(ticketCategories, { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding ticket categories gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // console.log('Adding Item managers gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // console.log('Adding Item Types')
  // itemsFacet = await ethers.getContractAt('contracts/Tokenatxor/facets/ItemsFacet.sol:ItemsFacet', tokenatxorDiamond.address)
  // itemsTransferFacet = await ethers.getContractAt('ItemsTransferFacet', tokenatxorDiamond.address)
  // const { itemTypes } = require('./itemTypes.ts')

  // tx = await daoFacet.addItemTypes(itemTypes.slice(0, itemTypes.length / 4), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Item Types (1 / 4) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // tx = await daoFacet.addItemTypes(itemTypes.slice(itemTypes.length / 4, (itemTypes.length / 4) * 2), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Item Types (2 / 4) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice((itemTypes.length / 4) * 2, (itemTypes.length / 4) * 3), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Item Types (3 / 4) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice((itemTypes.length / 4) * 3), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Item Types (4 / 4) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add raffle4ItemTypes
  // const { itemTypes:raffle4ItemTypes } = require('./raffle4ItemTypes.ts')

  // tx = await daoFacet.addItemTypes(itemTypes.slice(0, raffle4ItemTypes.length / 4), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Raffle4 Item Types (4 / 16) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice(raffle4ItemTypes.length / 4, (itemTypes.length / 16) * 5), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Raffle4 Item Types (5 / 16) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice((itemTypes.length / 16) * 5, (itemTypes.length / 8) * 3), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Raffle4 Item Types (6 / 16) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice((itemTypes.length / 8) * 3, (itemTypes.length / 4) * 2), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Raffle4 Item Types (8 / 16) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice((itemTypes.length / 4) * 2, (itemTypes.length / 4) * 3), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Raffle4 Item Types (12 / 16) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice((itemTypes.length / 4) * 3), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Raffle4 Item Types (16 / 16) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add Miami shirts
  // console.log('Adding Miami shirts')
  // const { itemTypes:miamiShirtTypes } = require('./addItemTypes/itemTypes/miamiShirtItemType')
  // tx = await daoFacet.addItemTypes(miamiShirtTypes)
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Miami shirts gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add Szn1Rnd1bages
  // console.log('Adding Szn1Rnd1badges')
  // const { szn1rnd1ItemTypes } = require('./addItemTypes/itemTypes/szn1rnd1ItemTypes')
  // tx = await daoFacet.addItemTypes(szn1rnd1ItemTypes)
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Szn1Rnd1badges gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add Szn1Rnd2bages
  // console.log('Adding Szn1Rnd2badges')
  // const { szn1rnd2ItemTypes } = require('./addItemTypes/itemTypes/szn1rnd2ItemTypes')
  // tx = await daoFacet.addItemTypes(szn1rnd2ItemTypes)
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Szn1Rnd2badges gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add Unicly Badges
  // console.log('Adding Unicly Badges')
  // const { uniclyBaadgeItemType } = require('./addItemTypes/itemTypes/uniclyBaadgeItemType')
  // tx = await daoFacet.addItemTypes(uniclyBaadgeItemType)
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Unicly Badges gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add wearable types sets
  // console.log('Adding Equippable Sets')
  // tx = await daoFacet.addEquippableSets(equippableSets.slice(0, equippableSets.length / 2))
  // receipt = await tx.wait()
  // console.log('Adding Equippable Sets (1 / 2) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add wearable types sets
  // console.log('Adding Equippable Sets')
  // tx = await daoFacet.addWearableSets(equippableSets.slice(equippableSets.length / 2))
  // receipt = await tx.wait()
  // console.log('Adding Wearable Sets (2 / 2) gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add wearable types sets
  // console.log('Adding Wearable Sets Raffle4')
  // tx = await daoFacet.addEquippableSets(equippableSetsRaffle4)
  // receipt = await tx.wait()
  // console.log('Adding Equippable Sets Raffle4 gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // ----------------------------------------------------------------
  // // Upload Svg layers
  // svgFacet = await ethers.getContractAt('SvgFacet', tokenatxorDiamond.address)

  // function setupSvg (...svgData) {
  //   const svgTypesAndSizes = Array()
  //   const svgs = Array()
  //   for (const [svgType, svg] of svgData) {
  //     svgs.push(svg.join(''))
  //     svgTypesAndSizes.push([ethers.utils.formatBytes32String(svgType), svg.map(value => value.length)])
  //   }
  //   return [svgs.join(''), svgTypesAndSizes]
  // }

  // // eslint-disable-next-line no-unused-vars
  // function printSizeInfo (svgTypesAndSizes) {
  //   console.log('------------- SVG Size Info ---------------')
  //   let sizes = 0
  //   for (const [svgType, size] of svgTypesAndSizes) {
  //     console.log(ethers.utils.parseBytes32String(svgType) + ':' + size)
  //     for (const nextSize of size) {
  //       sizes += nextSize
  //     }
  //   }
  //   console.log('Total sizes:' + sizes)
  // }

  // console.log('Uploading Wearable Svgs')
  // let svg, svgTypesAndSizes
  // console.log('Number of wearables:' + equippablesSvgs.length)
  // let svgItemsStart = 0
  // let svgItemsEnd = 0
  // while (true) {
  //   let itemsSize = 0
  //   while (true) {
  //     if (svgItemsEnd === equippablesSvgs.length) {
  //       break
  //     }
  //     itemsSize += equippablesSvgs[svgItemsEnd].length
  //     if (itemsSize > 24576) {
  //       break
  //     }
  //     svgItemsEnd++
  //   }
  //   ;[svg, svgTypesAndSizes] = setupSvg(
  //     ['equippables', equippablesSvgs.slice(svgItemsStart, svgItemsEnd)]
  //   )
  //   console.log(`Uploading ${svgItemsStart} to ${svgItemsEnd} wearable SVGs`)
  //   printSizeInfo(svgTypesAndSizes)
  //   tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  //   receipt = await tx.wait()
  //   console.log('Gas used:' + strDisplay(receipt.gasUsed))
  //   console.log('-------------------------------------------')
  //   totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  //   if (svgItemsEnd === equippablesSvgs.length) {
  //     break
  //   }
  //   svgItemsStart = svgItemsEnd
  // }

  // console.log('Uploading raffle4 sleeves')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['sleeves', raffe4SleevesSvgs.map(value => value.svg)],
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // console.log('Uploading miami sleeves')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['sleeves', miamiSleevesSvgs.map(value => value.svg)],
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // console.log('Uploading szn1rnd1 badges')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['wearables', szn1Rnd1badgeSvgs.slice(0, szn1Rnd1badgeSvgs.length / 3)]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['wearables', szn1Rnd1badgeSvgs.slice(szn1Rnd1badgeSvgs.length / 3, (szn1Rnd1badgeSvgs.length / 3) * 2)]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['wearables', szn1Rnd1badgeSvgs.slice((szn1Rnd1badgeSvgs.length / 3) * 2)]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // console.log('Uploading szn1rnd2 badges')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['wearables', szn1Rnd2badgeSvgs.slice(0, szn1Rnd2badgeSvgs.length / 3)]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['wearables', szn1Rnd2badgeSvgs.slice(szn1Rnd2badgeSvgs.length / 3, (szn1Rnd2badgeSvgs.length / 3) * 2)]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['wearables', szn1Rnd2badgeSvgs.slice((szn1Rnd2badgeSvgs.length / 3) * 2)]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // console.log('Uploading badges')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['wearables', uniclyBaadgeSvgs]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // // --------------------------------
  // console.log('Uploading tokenatxor SVGs')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['tokenatxor', tokenatxorSvgs]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // console.log('Uploading collaterals and expressions')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['collaterals', collateralsSvgs],
  //   ['expressions', expressionSvgs]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // console.log('Setting raffle4 sleeves...')
  // let sleevesSvgId = 23
  // let sleeves = []
  // for (const sleeve of raffe4SleevesSvgs) {
  //   sleeves.push(
  //     {
  //       sleeveId: sleevesSvgId,
  //       equippableId: sleeve.id
  //     }
  //   )
  //   sleevesSvgId++
  // }
  // tx = await svgFacet.setSleeves(sleeves, { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // console.log('Setting miami sleeves...')
  // sleevesSvgId = 27
  // sleeves = []
  // for (const sleeve of miamiSleevesSvgs) {
  //   sleeves.push(
  //     {
  //       sleeveId: sleevesSvgId,
  //       equippableId: sleeve.id
  //     }
  //   )
  //   sleevesSvgId++
  // }
  // tx = await svgFacet.setSleeves(sleeves, { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  console.log('Total gas used: ' + strDisplay(totalGasUsed))
  return {
    account: account,
    tokenatxorDiamond: tokenatxorDiamond,
    diamondLoupeFacet: diamondLoupeFacet,
    bridgeFacet: bridgeFacet,
    tktrTokenContract: tktrTokenContract,
    // itemsFacet: itemsFacet,
    // itemsTransferFacet: itemsTransferFacet,
    tokenatoxrFacet: tokenatxorFacet,
    tokenatxorGameFacet: tokenatxorGameFacet,
    // collateralFacet: collateralFacet,
    // vrfFacet: vrfFacet,
    // daoFacet: daoFacet,
    // svgFacet: svgFacet,
    // erc1155MarketplaceFacet: erc1155MarketplaceFacet,
    // erc721MarketplaceFacet: erc721MarketplaceFacet,
    // shopFacet: shopFacet,
    // escrowFacet: escrowFacet,
    linkAddress: linkAddress,
    linkContract: linkContract,
    // secondAccount: secondAccount
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
