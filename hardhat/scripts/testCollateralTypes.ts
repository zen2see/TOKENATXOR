import { ethers } from "hardhat"
const collaterals = [
  {
    name: 'TKTR',
    kovanAddress: '',
    mainnetAddress: '',
    hardhatAddress: '',
    mumbaiAddress: '',
    maticAddress: '',
    primaryColor: '#FF7D00',
    secondaryColor: '#F9D792',
    cheekColor: '#F4AF24',
    svgId: 0,
    expressionSvgId: 16,
    modifiers: [0, 0, -1, 0, 0, 0],
    conversionRate: 1 // 1 DAI equals 1 DAI
  }

  /*
    {
        name: 'TEST',
        kovanAddress: '',
        mainnetAddress: '',
        hardhatAddress: '',
        primaryColor: '#FF7D00',
        secondaryColor: '#F9D792',
        cheekColor: '#F4AF24',
        svgId: 0,
        eyeShapeSvgId: 16,
        modifiers: [1, 0, 0, 0, 0, 0],
        conversionRate: 1 // 1 DAI equals 1 DAI
    },
    */
]

function eightBitArrayToUint (array) {
  const uint = Array()
  for (const num of array) {
    const value = ethers.BigNumber.from(num).toTwos(8)
    uint.unshift(value.toHexString().slice(2))
  }
  return ethers.BigNumber.from('0x' + uint.join(''))
}

function getCollaterals (network, tktrAddress, testAddress) {
  const collateralTypes = Array()
  for (const collateralType of collaterals) {
    const collateralTypeInfo = {
      primaryColor:
        '0x' + collateralType.primaryColor.slice(1),
      secondaryColor:
        '0x' + collateralType.secondaryColor.slice(1),
      cheekColor:
        '0x' + collateralType.cheekColor.slice(1),
      svgId: collateralType.svgId,
      eyeShapeSvgId: collateralType.expressionSvgId,
      // modifiers: eightBitArrayToUint(collateralType.modifiers),
      modifiers: collateralType.modifiers,
      conversionRate: collateralType.conversionRate,
      delisted: false
    }
    const item: any = {}
    if (network === 'kovan') {
      item.collateralType = collateralType.kovanAddress
    } else if (network === 'mumbai') {
      if (collateralType.name === 'GHST') {
        item.collateralType = tktrAddress
      }
    } else if (network === 'hardhat') {
      if (collateralType.name === 'GHST') item.collateralType = tktrAddress
      else if (collateralType.name === 'TEST') item.collateralType = testAddress
    } else if (network === 'mainnet') {
      item.collateralType = collateralType.mainnetAddress
    } else if (network === 'matic') {
      item.collateralTypeInfo = collateralType.maticAddress
    }
    item.collateralTypeInfo = collateralTypeInfo
    collateralTypes.push(item)
  }

  return collateralTypes
}

exports.getCollaterals = getCollaterals
