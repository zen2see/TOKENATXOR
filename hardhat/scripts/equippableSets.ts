import { ethers } from 'hardhat'

// Rarity bonus
// nrg
// agg
// spk
// brn

const equippableSetArrays = [
  {
    name: 'Infantry',
    equippableIds: [1, 2, 3],
    traitsBonuses: [1, 0, 1, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Trooper',
    equippableIds: [4, 5, 6],
    traitsBonuses: [2, 0, 1, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Sergeant',
    equippableIds: [7, 8, 9],
    traitsBonuses: [3, 0, 2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'General',
    equippableIds: [10, 11, 12],
    traitsBonuses: [4, 0, 2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Mythical Sergey',
    equippableIds: [13, 14, 15],
    traitsBonuses: [5, 0, 3, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Godlike Sergey',
    equippableIds: [13, 14, 16],
    traitsBonuses: [6, 0, 3, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Apex Sergey',
    equippableIds: [13, 14, 16, 17],
    traitsBonuses: [6, 1, 3, 0, 0],
    allowedCollaterals: [3]
  },
  {
    name: 'Aave Hero',
    equippableIds: [18, 19, 20],
    traitsBonuses: [1, 0, 0, 1, 0],
    allowedCollaterals: []
  },
  {
    name: 'Captain Aave',
    equippableIds: [21, 22, 23],
    traitsBonuses: [2, 0, 0, 1, 0],
    allowedCollaterals: []
  },
  {
    name: 'Thaave',
    equippableIds: [24, 25, 26],
    traitsBonuses: [3, 2, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Marc',
    equippableIds: [27, 28, 29],
    traitsBonuses: [4, 2, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Jordan',
    equippableIds: [30, 31, 32],
    traitsBonuses: [5, 0, 0, 3, 0],
    allowedCollaterals: []
  },
  {
    name: 'Godlike Stani',
    equippableIds: [33, 34, 35],
    traitsBonuses: [6, 0, -3, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Apex Stani',
    equippableIds: [32, 33, 34, 35],
    traitsBonuses: [6, 1, -3, 0, 0],
    allowedCollaterals: [2]
  },
  {
    name: 'ETH Maxi',
    equippableIds: [36, 37, 38],
    traitsBonuses: [1, 0, 0, 0, -1],
    allowedCollaterals: []
  },
  {
    name: 'Foxy Meta',
    equippableIds: [39, 40, 41],
    traitsBonuses: [2, 0, -1, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Nogara the Eagle',
    equippableIds: [42, 43, 44],
    traitsBonuses: [3, 2, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'DeFi Degen',
    equippableIds: [45, 46, 47],
    traitsBonuses: [4, 0, 0, 0, -2],
    allowedCollaterals: []
  },
  {
    name: 'DAO Summoner',
    equippableIds: [48, 49, 50, 51],
    traitsBonuses: [5, 0, 0, 0, 3],
    allowedCollaterals: []
  },
  {
    name: 'Vitalik Visionary',
    equippableIds: [52, 53, 54],
    traitsBonuses: [6, -3, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Apex Vitalik Visionary',
    equippableIds: [51, 52, 53, 54],
    traitsBonuses: [7, -3, 0, 0, 1],
    allowedCollaterals: [1]
  },
  {
    name: 'Super Aagent',
    equippableIds: [55, 56, 57, 58, 59],
    traitsBonuses: [4, -1, 0, 2, 0],
    allowedCollaterals: []
  },
  {
    name: 'Aagent ',
    equippableIds: [55, 56, 57],
    traitsBonuses: [3, -1, 0, 1, 0],
    allowedCollaterals: []
  },
  {
    name: 'Aagent ',
    equippableIds: [55, 56, 57, 58],
    traitsBonuses: [3, -1, 0, 2, 0],
    allowedCollaterals: []
  },
  {
    name: 'Wizard ',
    equippableIds: [60, 64, 66],
    traitsBonuses: [1, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Wizard',
    equippableIds: [61, 64, 66],
    traitsBonuses: [1, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Wizard',
    equippableIds: [62, 64, 66],
    traitsBonuses: [1, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Wizard',
    equippableIds: [63, 64, 66],
    traitsBonuses: [1, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Wizard',
    equippableIds: [60, 65, 66],
    traitsBonuses: [1, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Legendary Wizard',
    equippableIds: [61, 65, 66],
    traitsBonuses: [4, 1, 0, 0, 1],
    allowedCollaterals: []
  },
  {
    name: 'Mythical Wizard',
    equippableIds: [62, 65, 66],
    traitsBonuses: [5, 1, 0, 0, 2],
    allowedCollaterals: []
  },
  {
    name: 'Godlike Wizard',
    equippableIds: [63, 65, 66],
    traitsBonuses: [6, 1, 0, 0, 2],
    allowedCollaterals: []
  },
  {
    name: 'Farmer',
    equippableIds: [67, 68, 69],
    traitsBonuses: [1, -1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Mythical Farmer',
    equippableIds: [67, 68, 70],
    traitsBonuses: [5, -2, 0, 0, -1],
    allowedCollaterals: []
  },
  {
    name: 'OKex Jaay',
    equippableIds: [72, 73, 74],
    traitsBonuses: [5, -1, 0, 0, -2],
    allowedCollaterals: []
  },
  {
    name: 'OKex Jaay Hao',
    equippableIds: [72, 73, 74, 75],
    traitsBonuses: [5, -1, 0, 0, -2],
    allowedCollaterals: []
  },
  {
    name: 'Skater',
    equippableIds: [77, 78, 79],
    traitsBonuses: [2, 0, 0, 0, -1],
    allowedCollaterals: []
  },
  {
    name: 'Sushi Chef',
    equippableIds: [80, 81, 82],
    traitsBonuses: [3, 0, 2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Sushi Chef',
    equippableIds: [80, 81, 83],
    traitsBonuses: [4, 0, 2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Master Sushi Chef',
    equippableIds: [80, 81, 82, 83],
    traitsBonuses: [4, 0, 2, -1, 0],
    allowedCollaterals: []
  },
  {
    name: 'Gentleman',
    equippableIds: [84, 85, 86],
    traitsBonuses: [4, 0, -2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Miner',
    equippableIds: [87, 88, 89],
    traitsBonuses: [2, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Pajamas',
    equippableIds: [90, 91, 92],
    traitsBonuses: [3, 0, 0, -2, 0],
    allowedCollaterals: []
  },
  {
    name: 'Pajamas',
    equippableIds: [90, 91, 93],
    traitsBonuses: [3, 0, 0, -2, 0],
    allowedCollaterals: []
  },
  {
    name: 'Full Pajamas',
    equippableIds: [90, 91, 92, 93],
    traitsBonuses: [4, 0, 0, -3, 0],
    allowedCollaterals: []
  },
  {
    name: 'Runner',
    equippableIds: [94, 95, 96],
    traitsBonuses: [2, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Runner',
    equippableIds: [94, 95, 121],
    traitsBonuses: [2, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Runner',
    equippableIds: [94, 125, 96],
    traitsBonuses: [2, 1, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Long Distance Runner',
    equippableIds: [94, 125, 121],
    traitsBonuses: [4, 2, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Lady',
    equippableIds: [97, 98, 100],
    traitsBonuses: [4, 0, 0, -2, 0],
    allowedCollaterals: []
  },
  {
    name: 'Lady',
    equippableIds: [97, 98, 99],
    traitsBonuses: [4, 0, 0, -2, 0],
    allowedCollaterals: []
  },
  {
    name: 'Socialite',
    equippableIds: [97, 98, 99, 100],
    traitsBonuses: [5, 2, 0, -1, 0],
    allowedCollaterals: []
  },
  {
    name: 'Witchy',
    equippableIds: [101, 102, 103],
    traitsBonuses: [5, 0, 0, 3, 0],
    allowedCollaterals: []
  },
  {
    name: 'Portal Mage',
    equippableIds: [104, 105, 106],
    traitsBonuses: [4, 0, 2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Supreme Portal Mage',
    equippableIds: [104, 105, 107],
    traitsBonuses: [6, 0, 3, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Rastafarian',
    equippableIds: [108, 109, 110],
    traitsBonuses: [3, 0, -2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Off Duty Hazmat',
    equippableIds: [111, 112, 123],
    traitsBonuses: [4, 2, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'On Duty Hazmat',
    equippableIds: [111, 112, 113],
    traitsBonuses: [6, 3, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Blue Vacationer',
    equippableIds: [115, 116, 117],
    traitsBonuses: [4, -2, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Red Vacationer',
    equippableIds: [114, 116, 117],
    traitsBonuses: [5, -2, 0, -1, 0],
    allowedCollaterals: []
  },
  {
    name: 'Crypto OG',
    equippableIds: [12, 19, 36, 40, 77],
    traitsBonuses: [4, 0, 0, 0, -2],
    allowedCollaterals: []
  },
  {
    name: 'Rektboi',
    equippableIds: [29, 45, 46],
    traitsBonuses: [4, 0, 0, 0, -2],
    allowedCollaterals: []
  },
  {
    name: 'Man of Culture',
    equippableIds: [47, 59, 74],
    traitsBonuses: [4, 0, 0, 0, -2],
    allowedCollaterals: []
  },
  {
    name: 'Curve Surfer',
    equippableIds: [66, 76, 115],
    traitsBonuses: [4, 0, 0, 0, 2],
    allowedCollaterals: []
  },
  {
    name: 'PoW Miner',
    equippableIds: [25, 77, 89],
    traitsBonuses: [3, 0, 2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Toddler',
    equippableIds: [90, 91, 119],
    traitsBonuses: [4, 0, -2, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'FU Money',
    equippableIds: [35, 114, 117, 120],
    traitsBonuses: [6, 0, -3, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Farmer Alf',
    equippableIds: [13, 67, 68, 69],
    traitsBonuses: [5, -3, 0, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Battle Santa',
    equippableIds: [5, 13, 71, 106],
    traitsBonuses: [5, 0, 3, 0, 0],
    allowedCollaterals: []
  },
  {
    name: 'Party Animal',
    equippableIds: [109, 40, 124],
    traitsBonuses: [5, 0, 0, 0, -3],
    allowedCollaterals: []
  }

]

function sixteenBitArrayToUint (array) {
  const uint = Array()
  for (let item of array) {
    if (typeof item === 'string') {
      item = parseInt(item)
    }
    uint.unshift(item.toString(16).padStart(4, '0'))
  }
  if (array.length > 0) return ethers.BigNumber.from('0x' + uint.join(''))
  return ethers.BigNumber.from(0)
}

function eightBitIntArrayToUint (array) {
  if (array.length === 0) {
    return ethers.BigNumber.from(0)
  }
  const uint = Array()
  for (const num of array) {
    if (num > 127) {
      throw (Error('Value beyond signed 8 int '))
    }
    const value = ethers.BigNumber.from(num).toTwos(8)
    uint.unshift(value.toHexString().slice(2))
  }
  return ethers.BigNumber.from('0x' + uint.join(''))
}

const equippableSets = Array()
for (const equippableSet of equippableSetArrays) {
  if (!Array.isArray(equippableSet.allowedCollaterals)) {
    console.log(equippableSet)
    throw (Error('Is not array'))
  }
  equippableSets.push(
    {
      name: equippableSet.name,
      equippableIds: equippableSet.equippableIds,
      traitsBonuses: equippableSet.traitsBonuses,
      allowedCollaterals: equippableSet.allowedCollaterals
    }
  )
}

exports.equippableSets = equippableSets
